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

4. Configure the MongoDB connection:

   - Open the `server.js` file.
   - Locate the `mongourl` variable and replace it with your MongoDB connection string.

5. Start the server:

   ````bash
   node server.js
   ```

6. Access the application in your browser at `http://localhost:3000`.

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

- `POST /api/item/restaurant_id/:restaurant_id`: Create a new restaurant with the provided ID.
- 
- `GET /api/item/restaurant_id/:restaurant_id`: Retrieve information about a restaurant based on its ID.
- 
- `DELETE /api/item/restaurantID/:restaurantID`: Delete a restaurant based on its ID.


