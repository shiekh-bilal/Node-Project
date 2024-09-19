const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://bilalmazharbm5:jQpRJoMSOHwUIE2m@attendancetracker.fp19y.mongodb.net/?retryWrites=true&w=majority&appName=AttendanceTracker";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        // console.log("Connected to MongoDB");
        return client.db('attendanceDB');
    } catch (err) {
        console.error(err);
    }
}

async function createUser(username, password) {
  const db = await connectDB();
  const users = db.collection('users');

  await users.insertOne({ username, password });
  // console.log("User created:", username);
}

async function findUser(username) {
  const db = await connectDB();
  const users = db.collection('users');
  console.log(username);
  console.log("DB User= ",users,"User name=  ", await users.findOne({username: username[0] }))
  return await users.findOne({ username: username[0] });
}

module.exports = { connectDB, createUser, findUser };
// module.exports = connectDB;
// createUser('testuser', 'password123');