const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "driveusers";

async function connectToDatabase() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    const db = client.db(dbName);
    return db;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  } finally {
    await client.close();
  }
}

module.exports = connectToDatabase;
