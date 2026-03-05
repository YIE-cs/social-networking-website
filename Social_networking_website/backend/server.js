const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./db');
const path = require('path');

const app = express();
const PORT = 5050;
//all routes will use my student number 
const STUDENT_ID = 'M01002570';
const BASE = `/${STUDENT_ID}`;

app.use(express.json());

(async () => {
  const client = await connectDB();
  const db = client.db('Mixed_Martial_Arts');//connects to database 

  app.use(session({
    secret: 'CST2120_ends_on_december',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: client,
      dbName: 'Mixed_Martial_Arts',      
      collection: 'sessions'
    }),
  }));
  //makes mongo accessible
  app.use((req, res, next) => {
    req.db = db;
    next();
  });

  require('./controllers/authController').setDB?.(db);
  //serves frontend files 
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  //put image in folder uploads
  app.get(BASE, (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));


  app.use(BASE, require('./routes/authRoutes'));
  app.use(BASE, require('./routes/contentRoutes'));
  app.use(BASE,require('./routes/follow'));
  app.use(BASE, require('./routes/users'));       
  

  app.listen(PORT, () => {
    console.log(`\nDragonSocial server MMA community is live\n`);
  });
})();
