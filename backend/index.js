const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { default: mongoose } = require('mongoose');



// // Ensure that the uploads directories exist
// const directories = [
//   "uploads/profiles",
//   "uploads/files",
//   "uploads/voiceNotes"
// ];

// directories.forEach(dir => {
//   const dirPath = path.join(__dirname, dir);
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// });

// Middlewares
app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));
// app.use("/uploads/voiceNotes", express.static("uploads/voiceNotes"));
app.use(express.json());
app.use(cookieparser());

const port = process.env.PORT || 3000;
const db = process.env.MOONGODB_URI;

// API Routes
app.use('/api/auth', authRoutes);


const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


mongoose.connect(db)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));
