# Documentation and Setup Instruction

## Machine should have these installed as Prerequisites

- nodejs (to run without docker)
- nodemon (to run without docker)
- Docker
- Docker Compose

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/KiranPolaki/growthxAssignment.git
cd growthxAssignment
```

2. (Optional) Run without Docker:

```bash
npm i
npm run dev
```

(or)

2. Build and start the containers:

```bash
docker-compose up --build
```

### This will:

- Start a MongoDB instance locally on port 27017 in your computer.
- Build and start your Node.js application on port 8000
- Create a persistent volume for MongoDB data (stores the state of the db)

## Accessing the Application

### API

- API: http://localhost:8000 (addd end points after this)

#### User End point

- http://localhost:8000/api/v1/user/login
- Send a raw body like this

```javascript
 {username:"saikiran",password:"saikiranpolaki",email:"saikiran@gmail.com"}
```

### MongoDB

- MongoDB: mongodb://localhost:27017

## Stopping the Application

```bash
docker-compose down
```

To remove all data and start new in mongodb running locally:

```bash
docker-compose down -v
```

## Checking logs while running with Docker

```bash
docker-compose logs api
docker-compose logs mongodb
```

## Common error or Issues

- If running without docker you may face issue with nodemon not install globally please use the command below:

```bash
npm run start
```

- If there is any port conflict while running docker, make sure that port 8000 and 27017 is not in use.
- If you see and Deamon issue please make sure docker desktop is up and runnning

Thats all i can think of right now :)
