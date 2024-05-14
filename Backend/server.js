// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const mongoose = require("mongoose");
// const path = require("path");
// const albumController = require("./controllers/albumController");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const PORT = process.env.PORT || 3000;

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/employee-sync", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", async () => {
//   console.log("Connected to MongoDB");

//   // Call the saveRecords function to fetch and save records from the external API
//   const counts = await albumController.saveRecords();
//   console.log("Records saved successfully");

//   // Send counts data to all connected WebSocket clients
//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify(counts)); // Serialize counts to JSON before sending
//   });
// });

// // WebSocket handling
// wss.on("connection", (ws) => {
//   console.log("WebSocket connected");
// });

// // Serve frontend files
// app.use(express.static(path.join(__dirname, "../frontend")));

// // Start the server
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

////////////////////////////////////////////////////////////////

// const express = require("express");
// const http = require("http");
// const WebSocket = require("ws");
// const mongoose = require("mongoose");
// const { saveRecords } = require("./controllers/albumController");
// const path = require("path");

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/employee-sync", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   // Pass WebSocket connection to saveRecords function
//   saveRecords(ws)
//     .then(() => {
//       console.log("Data processing completed");
//     })
//     .catch((err) => {
//       console.error("Error processing data:", err);
//     });
// });

// app.use(express.static(path.join(__dirname, "../frontend")));

// server.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
//////////////////////////////////////////////////////////////////////////
const express = require("express");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const { saveRecords } = require("./controllers/albumController");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb://localhost:27017/employee-sync", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });
console.log("WebSocket server started");

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    if (message === "startSync") {
      console.log("Received startSync request");
      try {
        const results = await saveRecords(ws);
        const resultsJSON = JSON.stringify(results, null, 2);
        fs.writeFileSync("batchResults.json", resultsJSON);
        console.log("Batch results saved to batchResults.json");
      } catch (error) {
        console.error("Error during synchronization:", error);
        ws.send("Error during synchronization: " + error.message);
      }
    }
  });
});

// Define a route to handle GET request for /startSync
app.get("/startSync", async (req, res) => {
  try {
    const results = await saveRecords(null); // Pass null as ws parameter
    const resultsJSON = JSON.stringify(results, null, 2);
    fs.writeFileSync("batchResults.json", resultsJSON);
    console.log("Batch results saved to batchResults.json");
    res.status(200).send("Synchronization completed successfully");
  } catch (error) {
    console.error("Error starting synchronization:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/batchResults.json", (req, res) => {
  try {
    const batchResults = fs.readFileSync("batchResults.json", "utf8");
    const results = JSON.parse(batchResults);
    res.json(results);
  } catch (error) {
    console.error("Error fetching batch results:", error);
    res.status(404).send("Batch results not found");
  }
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});
