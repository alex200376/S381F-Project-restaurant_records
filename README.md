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
   git clone https://github.com/alex200376/restaurant-management-system.git
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

5. Access the application in your browser at `http://localhost:8099` or 'https://restaurants-record-system.onrender.com'.
## Data structure
- The restaurant data consists of the following fields:

- restaurant_id (String): The unique identifier for the restaurant in 8 digits..
- name (String): The name of the restaurant.
- cuisine (String): The type of cuisine served at the restaurant.
- address (Object): An object containing address details of the restaurant, including:
-- building (String): The building number or identifier.
-- borough (String): The borough or district where the restaurant is located.
-- street (String): The street name.
-- zipcode (String): The ZIP code of the restaurant's location in 5 ditgits.

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
OR
````bash
curl https://restaurants-record-system.onrender.com/api/restaurants
```
- Create a new restaurant with the provided ID.
   ````bash
curl -X POST -H "Content-Type: application/json" -d "{\"restaurant_id\": \"12345678\", \"name\": \"Restaurant Name\", \"cuisine\": \"Restaurant Cuisine\", \"borough\": \"Restaurant Borough\", \"building\": \"Restaurant Building\", \"street\": \"Restaurant Street\", \"zipcode\": \"12345\"}" http://localhost:8099/api/restaurants
```
OR
  ````bash
curl -X POST -H "Content-Type: application/json" -d "{\"restaurant_id\": \"12345678\", \"name\": \"Restaurant Name\", \"cuisine\": \"Restaurant Cuisine\", \"borough\": \"Restaurant Borough\", \"building\": \"Restaurant Building\", \"street\": \"Restaurant Street\", \"zipcode\": \"12345\"}" https://restaurants-record-system.onrender.com/api/restaurants
```

- Retrieve information about a restaurant based on its ID.
  ````bash
curl http://localhost:8099/api/restaurants/12345678
```
OR
  ````bash
curl https://restaurants-record-system.onrender.com/api/restaurants/12345678
```
-Delete a restaurant based on its ID.
   ````bash
   curl -X DELETE http://localhost:8099/api/restaurants/12345678
```
OR
````bash
   curl -X DELETE https://restaurants-record-system.onrender.com/api/restaurants/12345678
```
-update a restaurant by restaurant_id
````bash
curl -X PUT  -H "Content-Type: application/json"  -d "{\"name\": \"Updated Restaurant\", \"cuisine\": \"Italian\", \"borough\": \"Manhattan\", \"building\": \"123\", \"street\": \"Main St\", \"zipcode\": \"10001\"}" "http://localhost:8099/api/restaurants/12345678"
```
OR
````bash
curl -X PUT  -H "Content-Type: application/json"  -d "{\"name\": \"Updated Restaurant\", \"cuisine\": \"Italian\", \"borough\": \"Manhattan\", \"building\": \"123\", \"street\": \"Main St\", \"zipcode\": \"10001\"}"  "https://restaurants-record-system.onrender.com/api/restaurants/12345678"
```