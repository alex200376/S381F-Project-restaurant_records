<h1>Restaurant Management System</h1>

Group: 34
Name: 
Tsang Hing Ho (13340714),
Mui chun Yin (13313945)
Siu Chak Hang (13364400)

Web app link:https://restaurants-record-system.onrender.com

This is a restaurant management system implemented using Node.js and MongoDB. It provides functionalities for creating, updating, and deleting restaurant information, as well as searching for restaurants based on their IDs.

## Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- MongoDB

## Installation

1. Clone the repository:

   ````bash
   git clone https://github.com/your-username/restaurant-management-system.git
   ```

2. Navigate to the project directory:

   ````bash
   cd restaurant-management-system
   ```

3. Install the dependencies:

   ````bash
   npm install
   ```


4. Start the server:

   ````bash
   node server.js
   ```

5. Access the application in your browser at `http://localhost:8099`.

## Usage

- Login: Access the `/login` route to log in with your username and password.
  *modify this part of server.js to add more account
  const usersinfo = [
  { name: "admin", password: "admin" },
             ]

- Home: After logging in, you will be redirected to the home page (`/home`), where you can view and manage restaurants.
- Create: Use the `/create` route to add a new restaurant by providing the required information.
- Edit: Access the `/edit` route to modify the details of a specific restaurant.
- Delete: Use the `/delete` route to delete a restaurant from the system.
- Search: Access the `/find` route to search for a restaurant based on its ID.
- Logout: Click on the "Logout" button to end your session.

## RESTful API Endpoints
-Get all restaurant 
````bash
curl http://localhost:8099/api/restaurants
```
- Create a new restaurant with the provided ID.
   ````bash
  curl -X POST -H "Content-Type: application/json" -d "{ \"restaurant_id\": \"12345678\", \"name\": \"Restaurant Name\", \"cuisine\": \"Cuisine Type\", \"address\": { \"building\": "123", "borough": "Borough", "street": "Street Name", "zipcode": "12345" } }" http://localhost:8099/api/restaurants
```

- Retrieve information about a restaurant based on its ID.
  ````bash
curl http://localhost:8099/api/restaurants/12345678
```
-Delete a restaurant based on its ID.
   ````bash
   curl -X DELETE http://localhost:8099/api/restaurants/12345678
```
-update a restaurant by restaurant_id
````bash
  curl -X PUT -H "Content-Type: application/json" -d "{ \"name\": \"Updated Restaurant\", \"cuisine\": \"Italian"\, \"borough\": \"Manhattan\", \"address\": { \"building\": \"1234\", \"street\": \"Main Street\", \"zipcode\": \"10001\" } }" "http://localhost:8099/api/restaurants/12345678"
```