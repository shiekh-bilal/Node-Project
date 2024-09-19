const http = require('http');
const fs = require('fs');
const formidable = require('formidable');
const processFile = require('./processFile');
const calculateRemainingTime = require('./calculateTime');
const { connectDB, createUser, findUser } = require('./db');

async function main() {
  const db = await connectDB();

  const server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url === '/') {
          fs.readFile('./index.html', (err, data) => {
              if (err) {
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error loading page');
              } else {
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(data);
              }
          });
      } else if (req.method === 'POST' && req.url === '/signin') {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) => {
              if (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Error processing form' }));
                  return;
              }

              const { username, password } = fields;
              console.log("fileds = ", fields)
              console.log("username = ", username)
              const user = await findUser(username);
              console.log("User = ",user, "Password= ", password)

              if (user && user.password == password) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Sign-in successful' }));
              } else {
                  res.writeHead(401, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Invalid credentials' }));
              }
          });
      } else if (req.method === 'POST' && req.url === '/calculate') {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) => {
              if (err) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Error processing file' }));
                  return;
              }

              const { checkin, checkout } = fields;
              const filePath = files.file[0].filepath;

              const data = processFile(filePath);

              const results = data.map((record) => {
                  const remainingTime = calculateRemainingTime(checkin, checkout, record.short);

                  // Insert record into MongoDB
                  db.collection('attendanceRecords').insertOne({
                      date: record.date,
                      checkin: record.checkin,
                      checkout: record.checkout,
                      short: record.short,
                      calculatedRemainingTime: remainingTime
                  });

                  return {
                      date: record.date,
                      remainingTime: remainingTime
                  };
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(results));
          });
      } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
      }
  });

  server.listen(3000, () => {
      console.log('Server is listening on port 3000');
  });
}

main();
