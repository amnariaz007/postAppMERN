const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
require('dotenv').config(); 
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postRoutes');
const commentRoutes = require('./Routes/commentRoutes');

// Ensure that the uploads directories exist
const directories = [
  "uploads/posts",
];


directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Middlewares
app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use("/uploads/posts", express.static("uploads/posts"));

app.use(express.json());
app.use(cookieparser());

const port = process.env.PORT || 3000;
const db = process.env.MOONGODB_URI;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);


const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


mongoose.connect(db)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));
