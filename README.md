# Klouge API

A backend API built with [Express.js](https://expressjs.com/), designed for scalable and maintainable server-side applications.

## 🚀 Features

- RESTful API structure
- Environment-based config with `.env`
- Prisma ORM for database interaction
- Error handling and validation
- Ready for production with minimal setup

## 🛠️ Tech Stack

- Node.js
- Express.js
- Prisma
- PostgreSQL


## 📦 Installation

```bash
git clone https://github.com/isnn/klouge-api.git
cd klouge-api
npm install
```


## 🗃️ Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

## ▶️ Run the App
```bash
# setup the .env then
npm run dev
```


