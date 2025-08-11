# OZmap Geolocation API

A robust, internationalized RESTful API for managing geolocations (regions) with CRUD operations and geospatial queries. Built with **Node.js, Express, TypeScript** and **MongoDB**.

## 🚀 Features

* **Regions CRUD**: Create, read, update and delete regions defined as GeoJSON polygons.
* **Geospatial Queries**:

  * Find regions that contain a specific point (longitude/latitude).
  * Find regions within a given distance from a point.
  * Find regions by address (using geocoding).
* **Internationalization (i18n)**: All error messages and logs are translated (PT/EN) and respect the `Accept-Language` header or the `?lang` query parameter.
* **Comprehensive tests**: Unit and integration tests with Mocha/Chai. Coverage report available.
* **Swagger / OpenAPI documentation**: Interactive docs available at `/api-docs`.
* **Dockerized**: Local development and testing made easy with Docker Compose.

## 🏗️ Project Structure

* `src/` — Main source code

  * `modules/region/` — Regions domain (controllers, services, models, tests)
  * `common/` — Shared decorators, errors, interfaces and services
  * `middlewares/` — Express middlewares
  * `config/` — App, database, logging and Swagger configuration
  * `I18n/` — Translation files
* `test/` — (if present) Additional test files

## ⚡ Quick Start

### 1. Clone and install

```sh
git clone <repo-url>
cd technical-assessment-ozmap
npm install
```

### 2. Environment variables

Copy `.env.test` to `.env` and adjust as needed:

```
MONGODB_URI=mongodb://localhost:27017/ozmap
GOOGLE_MAPS_API_KEY=<your-google-geocoding-key>
```

### 3. Start the database via Docker

```sh
docker-compose up --build
```

* MongoDB runs in a container (see `docker-compose.yml`).

### 4. Start the server locally (without Docker)

Run:

```sh
npm run build
npm run dev
```

### 5. Run tests and coverage

```sh
npm test
npm run coverage
```

* Coverage report: `coverage/lcov-report/index.html` (open in the browser)
* All endpoints have unit and integration tests. Test names follow the pattern: `METHOD - endpoint - number - description` for integration tests and `- Test N - description` for unit tests.
* To interpret the coverage report, "ghost" files may appear if files were recently removed; run `npm run coverage` after cleaning the build.

## 📦 API Payload Examples

### Valid Region Payload

```json
{
  "name": "São Paulo",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-46.693419, -23.568704],
        [-46.641146, -23.568704],
        [-46.641146, -23.525024],
        [-46.693419, -23.525024],
        [-46.693419, -23.568704]
      ]
    ]
  }
}
```

### Invalid Region Payload (non-closed polygon)

```json
{
  "name": "Invalid",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [0, 0],
        [1, 0],
        [1, 1]
      ]
    ]
  }
}
```

* The invalid payload above will return a **400 Bad Request** with an internationalized validation message.
* See `/api-docs` for interactive examples and full schemas.

### Search addresses via Google (does not return DB regions)

```bash
curl "http://localhost:3000/api/regions/query/address?address=Paulista"
```

**Response:**

```json
[
  {
    "latitude": -23.561684,
    "longitude": -46.655981,
    "formattedAddress": "Avenida Paulista, São Paulo - SP, Brasil"
  }
]
```

### Search regions by point

```bash
curl "http://localhost:3000/api/regions/query/point?longitude=-46.65&latitude=-23.55"
```

**Response:**

```json
[
  {
    "id": "1",
    "name": "São Paulo",
    "geometry": { ... }
  }
]
```

### Search regions by distance

```bash
curl "http://localhost:3000/api/regions/query/distance?longitude=-46.65&latitude=-23.55&distance=10000"
```

**Response:**

```json
[
  {
    "id": "1",
    "name": "São Paulo",
    "geometry": { ... }
  }
]
```

## 📚 API Documentation

* Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* All endpoints, request/response schemas and error messages are documented.
* Example error responses (internationalized):

  * `{"message": "Região não encontrada"}` (pt)
  * `{"message": "Region not found"}` (en)

## 🌍 Internationalization

* Default language: Portuguese (`pt`)
* Switch to English using the header `Accept-Language: en` or the query `?lang=en`.
* All validation and error messages are translated automatically.

## 🧑‍💻 Usage Examples

### Create a Region

```bash
curl -X POST http://localhost:3000/api/regions/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "São Paulo",
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-46.693419, -23.568704],
          [-46.641146, -23.568704],
          [-46.641146, -23.525024],
          [-46.693419, -23.525024],
          [-46.693419, -23.568704]
        ]
      ]
    }
  }'
```

### List All Regions

```bash
curl http://localhost:3000/api/regions/
```

### Search Regions by Point

```bash
curl "http://localhost:3000/api/regions/query/point?longitude=-46.66&latitude=-23.55"
```

### Search Regions by Address

```bash
curl "http://localhost:3000/api/regions/query/address?address=São+Paulo"
```

### Delete a Region

```bash
curl -X DELETE http://localhost:3000/api/regions/<regionId>
```

## 🛠️ Scripts

* `npm run build` — Compiles TypeScript
* `npm run dev` — Starts the server in development mode with hot reload
* `npm test` — Runs all tests
* `npm run coverage` — Runs tests with coverage report
* `npm run lint` — Runs code linting
* `npm run format:check` — Checks code formatting
* `npm run seed` — Populates the database with example regions (runs `src/scripts/seed-regions.ts`)

## 📦 How to populate the database

To quickly insert example regions into MongoDB, run:

```sh
npm run seed
```

This command runs `src/scripts/seed-regions.ts`, which inserts several real regions from São Paulo and other neighborhoods to ease API testing.

## 📝 Environment Variables

* `MONGODB_URI` — MongoDB connection string
* `GOOGLE_MAPS_API_KEY` — Google Geocoding API key
* `DEFAULT_COUNTRY_CODE` — Default country code for geocoding (default: `BR`)
* `PORT` — API port (default: `3000`)

## 🧪 Tests

* All endpoints have unit and integration tests.
* Test database configuration is in `.env.test`.
* To run tests, use Node.js 22+ (`nvm use 22`).
* The test setup ensures isolation and cleanup of the database between runs.

## 🧑‍💻 Author & License

* MIT License — see [LICENSE](./LICENSE)
* [https://github.com/amilcarpio](https://github.com/amilcarpio)
