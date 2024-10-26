# Property Management API

This project is a Property Management API built with Node.js with TypeScript, Express, and TypeORM. It provides endpoints to manage properties, including creating, reading, updating, and deleting property records.

The database is a SQLite running in memory and seed data is inserted when the app is started. Besides, there are validations on the routes following the seed data structure. The lib [`express-validator`](https://github.com/express-validator/express-validator) was added for that.

Unit tests were added for the service layer and integration tests were added to cover the routes with validations, filtering, and sorting.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)

## Installation

1. Install dependencies:

    ```sh
    yarn install
    ```

## Usage

1. Build:

    ```sh
    yarn build
    ```

2. Start the server:

    ```sh
    # dev
    yarn dev

    # prod
    yarn start
    ```

3. The server will be running at `http://localhost:3000`.

## API Endpoints

### Properties

- **GET /properties**

    Retrieve a list of properties with optional filters and pagination.

    Query Parameters:
    - `skip` (optional): Number of records to skip (default: 0).
    - `take` (optional): Number of records to take (default: 10).
    - `address` (optional): Filter by address.
    - `priceMin` (optional): Minimum price filter.
    - `priceMax` (optional): Maximum price filter.
    - `bedrooms` (optional): Filter by number of bedrooms.
    - `bathrooms` (optional): Filter by number of bathrooms.
    - `type` (optional): Filter by property type.
    - `orderBy` (optional): Order by field (e.g., `id`, `address`, `price`) (default: `id`).
    - `order` (optional): Order direction (`ASC` or `DESC`) (default: `ASC`).

- **GET /properties/:id**

    Retrieve a property by its ID.

- **POST /properties**

    Create a new property.

    Request Body:
    - `address` (string): Property address.
    - `price` (float): Property price.
    - `bedrooms` (int): Number of bedrooms.
    - `bathrooms` (int): Number of bathrooms.
    - `type` (string, optional): Property type.

- **PUT /properties/:id**

    Update an existing property by its ID.

    Request Body:
    - `address` (string): Property address.
    - `price` (float): Property price.
    - `bedrooms` (int): Number of bedrooms.
    - `bathrooms` (int): Number of bathrooms.
    - `type` (string, optional): Property type.

- **DELETE /properties/:id**

    Delete a property by its ID.

## Running Tests

To run the tests, use the following command:

```sh
yarn test
```
