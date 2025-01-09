const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

let db;

const client = new MongoClient(uri);
async function connect() {
  try {
    db = client.db('dbMobile');
    return db;
  } catch (error) {
    // Ensures that the client will close when you finish/error
    // await client.close();
    console.log(error);
  }
}

function getDb() {
  return db;
}

module.exports = { connect, getDb };
