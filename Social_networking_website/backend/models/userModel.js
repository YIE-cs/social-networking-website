const { ObjectId } = require('mongodb');

async function createUser(db, userData) {
  const collection = db.collection('users');
  
  const existingUser = await collection.findOne({
    $or: [{ username: userData.username }, { email: userData.email }]
  });
  if (existingUser) {
    return { success: false, message: "User already exists!" };
  }
 //insert new user 
  const result = await collection.insertOne({
    ...userData,
    createdAt: new Date()
  });

  return { success: true, userId: result.insertedId };
}
//retrieve user from db by email  
async function findUserByEmail(db, email) {
  const collection = db.collection('users');
  return await collection.findOne({ email });
}

module.exports = { createUser, findUserByEmail };