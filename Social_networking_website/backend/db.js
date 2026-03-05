const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';//localhost
const client = new MongoClient(uri);

let clientPromise;

function connectDB() {
  //check if connection already exists
  if (!clientPromise) {
    //connect if exists
    clientPromise = client.connect()  
      .then((connectedClient) => {
        console.log('MongoDB connected successfully');
        return connectedClient;  
      })
      .catch(err => {
        console.error('MongoDB connection failed:', err);
        throw err;
      });
  }
  return clientPromise;
}

module.exports = connectDB;