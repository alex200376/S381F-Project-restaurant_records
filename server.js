const assert = require("assert");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("cookie-session");
const { MongoClient, ObjectID, ObjectId } = require("mongodb");

const mongourl =
  "mongodb+srv://alex200376:a35257925@testing.co0zdol.mongodb.net/?retryWrites=true&w=majority";
const dbName = "sample_restaurants";
const SECRETKEY = "13340714";

const app = express();
app.set("view engine", "ejs");

app.use(
  session({
    name: "session",
    keys: [SECRETKEY],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const usersinfo = [
  { name: "admin", password: "admin" },
];


const connectToMongo = async () => {
  const client = await MongoClient.connect(mongourl);
  return client.db(dbName);
};

const createDocument = async (db, createdDocument) => {
  const result = await db.collection("restaurants").insertOne(createdDocument);
  return result;
};

const findDocuments = async (db, criteria) => {
  let cursor = db.collection("restaurants").find(criteria);
  const docs = await cursor.toArray();
  return docs;
};

const updateDocument = async (db, criteria, updatedDocument) => {
  const result = await db
    .collection("restaurants")
    .updateOne(criteria, updatedDocument);
  return result;
};

const deleteDocument = async (db, criteria) => {
  const result = await db.collection("restaurants").deleteOne(criteria);
  return result;
};


const requireAuthentication = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
  } else {
    res.redirect("/home");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", function (req, res) {
  console.log("...Handling your login request");
  for (var i = 0; i < usersinfo.length; i++) {
    if (
      usersinfo[i].name == req.body.username &&
      usersinfo[i].password == req.body.password
    ) {
      req.session.authenticated = true;
      req.session.userid = usersinfo[i].name;
      console.log(req.session.userid);
      return res.status(200).redirect("/home");
    }
  }
  console.log("Error username or password.");
  return res.redirect("/");
});

app.get("/logout", function (req, res) {
  req.session = null;
  req.authenticated = false;
  res.redirect("/login");
});

app.get("/home", requireAuthentication, (req, res) => {
  res.render("home");
});

app.get("/list", requireAuthentication, async (req, res) => {
  const db = await connectToMongo();
  const docs = await findDocuments(db, {});
  res.render("display", { nItems: docs.length, items: docs });
});

app.get("/find", function (req, res) {
  return res.status(200).render("search");
});

app.post("/search", requireAuthentication, async (req, res) => {
  const db = await connectToMongo();
  const searchID = { restaurant_id: req.body.restaurantID };
  if (searchID.restaurant_id) {
    const docs = await findDocuments(db, searchID);
    res.render("display", { nItems: docs.length, items: docs });
  } else {
    res.redirect("/find");
  }
});
app.post("/create", requireAuthentication, async (req, res) => {
  try {
    const db = await connectToMongo();
    const createdDocument = {
      _id: new ObjectId(),
      restaurant_id: req.body.restaurant_id, 
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
      address: {
        building: req.body.building,
        street: req.body.street || "",
        zipcode: req.body.zipcode || "",
      },
    };
    const result = await createDocument(db, createdDocument);
    result.insertedCount = +1;
    if (result.insertedCount === 1) {
      setTimeout(() => {
        res.send(
          `<script>alert('Restaurant created successfully!'); window.location.href='/details?_id=${createdDocument._id}';</script>`
        );
      }, 2000);
    } else {
      setTimeout(() => {
        res.send(
          `<script>alert('Failed to create restaurant.'); window.location.href='/create';</script>`
        );
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    res.send(
      `<script>alert('An error occurred while creating the restaurant.'); window.location.href='/create';</script>`
    );
  }
});
app.get("/details", requireAuthentication, async (req, res) => {
  const db = await connectToMongo();
  const documentID = { _id: new ObjectId(req.query._id) };
  const docs = await findDocuments(db, documentID);

  const nItems = docs.length;

  if (nItems > 0) {
    const item = docs[0];
    res.render("details", { item, nItems, items: docs });
  } else {
    res.redirect("/search");
  }
});

app.get("/edit", requireAuthentication, async (req, res) => {
  const db = await connectToMongo();
  const documentID = { _id: new ObjectId(req.query._id) };
  const docs = await findDocuments(db, documentID);
  res.render("edit", { item: docs[0] });
});

app.get("/create", function (req, res) {
  return res.status(200).render("create");
});

app.post("/update", requireAuthentication, async (req, res) => {
  try {
    const db = await connectToMongo();
    const criteria = { _id: new ObjectId(req.body.postId) }; 
    const updatedDocument = {
      $set: {
        name: req.body.name,
        cuisine: req.body.cuisine,
        borough: req.body.borough,
        address: {
          building: req.body.building,

          street: req.body.street || "",
          zipcode: req.body.zipcode || "", 
        },
      },
    };
    const result = await updateDocument(db, criteria, updatedDocument);

    if (result && result.modifiedCount === 1) {
      setTimeout(() => {
        res.send(
          `<script>alert('Restaurant updated successfully!'); window.location.href='/details?_id=${req.body.postId}';</script>`
        );
      }, 2000);
    } else {
      setTimeout(() => {
        res.send(
          `<script>alert('Restaurant update failed.'); window.location.href='/details?_id=${req.body.postId}';</script>`
        );
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    res.send(
      `<script>alert('An error occurred while updating the restaurant.'); window.location.href='/details?_id=${req.body.postId}';</script>`
    );
  }
});
app.get("/delete", requireAuthentication, async (req, res) => {
  const db = await connectToMongo();
  const criteria = { _id: new ObjectId(req.query._id) };
  const result = await deleteDocument(db, criteria);
  if (result.deletedCount > 0) {
    setTimeout(() => {
      res.send(
        `<script>alert('Restaurant deleted successfully!'); window.location.href='/home';</script>`
      );
    }, 2000);
  } else {
    setTimeout(() => {
      res.send(
        `<script>alert('Restaurant delete failed.'); window.location.href='/home';</script>`
      );
    }, 2000);
  }
});

// Create a new restaurant
app.post('/api/restaurants', async (req, res) => {
  try {
    const db = await connectToMongo();
    const newRestaurant = {
      _id: new ObjectId(),
      restaurant_id: req.body.restaurant_id,
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
      address: {
        building: req.body.building,
        street: req.body.street || '',
        zipcode: req.body.zipcode || '',
      },
    };
    const result = await db.collection('restaurants').insertOne(newRestaurant);
    insertedCount=+1;
    if (result.insertedCount === 1) {
      res.status(201).json({ message: 'Restaurant created successfully.', restaurant: newRestaurant });
    } else {
      res.status(500).json({ error: 'Failed to create the restaurant.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the restaurant.' });
  }
});
// Get all restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const db = await connectToMongo();
    const docs = await db.collection('restaurants').find({}).toArray();
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve restaurants.' });
  }
});

// Get a restaurant by ID
app.get('/api/restaurants/:restaurant_id', async (req, res) => {
  try {
    const db = await connectToMongo();
    const doc = await db.collection('restaurants').findOne({ restaurant_id: req.params.restaurant_id });
    if (doc) {
      res.json(doc);
    } else {
      res.status(404).json({ error: 'Restaurant not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve the restaurant.' });
  }
});

// Update a restaurant by restaurant_id
app.put('/api/restaurants/:restaurant_id', async (req, res) => {
  try {
    const db = await connectToMongo();
    const documentID = { restaurant_id: req.params.restaurant_id };
    const updatedDocument = {
      $set: {
        name: req.body.name,
        cuisine: req.body.cuisine,
        borough: req.body.borough,
        building: req.body.building,
        street: req.body.street || '',
        zipcode: req.body.zipcode || '',
      },
    };
    const result = await db.collection('restaurants').updateOne(documentID, updatedDocument);
    if (result.modifiedCount > 0) {
      res.json({ message: 'Restaurant updated successfully.' });
    } else {
      res.status(404).json({ error: 'Restaurant not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the restaurant.' });
  }
});

// Delete a restaurant by restaurant_id
app.delete('/api/restaurants/:restaurant_id', async (req, res) => {
  try {
    const db = await connectToMongo();
    const documentID = { restaurant_id: req.params.restaurant_id };
    const result = await db.collection('restaurants').deleteOne(documentID);
    if (result.deletedCount > 0) {
      res.json({ message: 'Restaurant deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Restaurant not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete the restaurant.' });
  }
});

// Start the server
app.listen(8099, () => {
  console.log("Server running on port 8099");
});
