# Product Inventory API

This project is a RESTful API for managing a product inventory. It is built using Express.js and SQLite, and includes authentication and authorization mechanisms to secure the API.

## Setup and Running the Project

1. Clone the repository:
   ```
   git clone https://github.com/githubnext/workspace-blank.git
   cd workspace-blank
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the SQLite database:
   ```
   node db.js
   ```

4. Start the server:
   ```
   npm start
   ```

## API Documentation

### Authentication

#### Register a new user

- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** `{ "message": "User registered successfully" }`

#### Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "token": "JWT token" }`

### Products

#### Get all products

- **URL:** `/products`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Success Response:**
  - **Code:** 200
  - **Content:** `[{ "id": 1, "name": "Product 1", "description": "Description 1", "price": 10.0, "quantity": 100 }, ...]`

#### Get a single product

- **URL:** `/products/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "id": 1, "name": "Product 1", "description": "Description 1", "price": 10.0, "quantity": 100 }`

#### Create a new product

- **URL:** `/products`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "quantity": "number"
  }
  ```
- **Success Response:**
  - **Code:** 201
  - **Content:** `{ "message": "Product created successfully" }`

#### Update a product

- **URL:** `/products/:id`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "quantity": "number"
  }
  ```
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Product updated successfully" }`

#### Delete a product

- **URL:** `/products/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Success Response:**
  - **Code:** 200
  - **Content:** `{ "message": "Product deleted successfully" }`
