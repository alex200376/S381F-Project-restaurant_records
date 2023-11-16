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

// Sample user data
const usersinfo = [
  { name: "admin", password: "admin" },
];

// MongoDB helper functions
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

// Authentication middleware
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
  const docs = await findDocuments(db, {}); // Retrieve all documents
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
      restaurant_id: req.body.restaurant_id, // Use the provided restaurant ID
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
    const criteria = { _id: new ObjectId(req.body.postId) }; // Assuming the unique identifier for the document is "_id"
    const updatedDocument = {
      $set: {
        name: req.body.name,
        cuisine: req.body.cuisine,
        borough: req.body.borough,
        address: {
          building: req.body.building,

          street: req.body.street || "",
          zipcode: req.body.zipcode || "", // Assuming you have a field for the zipcode in the database
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

app.post("/api/item/restaurant_id/:restaurant_id", function (req, res) {
  if (req.params.restaurantID) {
    console.log(req.body);
    const client = new MongoClient(mongourl);
    client.connect(function (err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);
      let newDocument = {};
      newDocument["restaurant_id"] = req.body.restaurantID;

      db.collection("restaurants").insertOne(
        newDocument,
        function (err, results) {
          assert.equal(err, null);
          client.close();
          res.status(200).end();
        }
      );
    });
  } else {
    res.status(500).json({ error: "missing restaurant ID" });
  }
});

//find
app.get("/api/item/restaurant_id/:restaurant_id", function (req, res) {
  if (req.params.restaurantID) {
    let criteria = {};
    criteria["restaurant_id"] = req.params.restaurantID;
    const client = new MongoClient(mongourl);
    client.connect(function (err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);

      findDocuments(db, criteria, function (docs) {
        client.close();
        console.log("Closed DB connection");
        res.status(200).json(docs);
      });
    });
  } else {
    res.status(500).json({ error: "missing restaurant id" });
  }
});

//delete
app.delete("/api/item/restaurantID/:restaurantID", function (req, res) {
  if (req.params.restaurantID) {
    let criteria = {};
    criteria["restaurantID"] = req.params.restaurantID;
    const client = new MongoClient(mongourl);
    client.connect(function (err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
      const db = client.db(dbName);

      db.collection("restaurants").deleteMany(
        criteria,
        function (err, results) {
          assert.equal(err, null);
          client.close();
          res.status(200).end();
        }
      );
    });
  } else {
    res.status(500).json({ error: "missing restaurant id" });
  }
});
// Start the server
app.listen(8099, () => {
  console.log("Server running on port 3000");
});
