## File System Microservice


### Tech Stack

* **Node.js** (ESM)
* **Express.js**
* **PostgreSQL**
* **Knex.js** (Query Builder + Migrations)
* **S3/PVC** 
---
### Project Structure

```text
authservice/
├── bin/
│   └── www.js                 # App entry point
├── docs/
│   └── swagger.json
├── migrations/
│   └── hash_description.json 
├── routes/
│   ├── filesystem.js  
├── service/
│   ├────── repo/  
│   └── implemenatation/
│   └── ...
├── utility/
│   └── db/
│   └── logger/
│   └── multer/
│   └── helpers...
├── knexfile.cjs               # Knex configuration (CLI)
├── .env                       # Environment variables
├── .env.dummy   
├── .gitignore
├── Dockerfile                 
├── package.json
└── README.md
```

### Environment Variables (`.env`)

```env
PORT=8081
BASE_URL=http://localhost:8081

ROOT_FOLDER=/data

DB_HOST=localhost
DB_PORT=5432
DB_NAME=filesystem
DB_USER=postgres
DB_PASSWORD=123

PASSWORD_SECRET=hashPasswordSecret
PIN_TOKEN_SECRET_KEY=resetPinToken

JWT_SECRET_KEY=jwtSignSecretKey
JWT_EXPIRES_IN=7d

```

---

### Knex Configuration

#### Create a Migration

```bash
npx knex migrate:make create_users_table
```

####  Run Migrations

```bash
npx knex migrate:latest
```
---
