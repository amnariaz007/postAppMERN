const multer = require('multer');
const { mkdirSync } = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileDir = 'uploads/posts'; 
        mkdirSync(fileDir, { recursive: true }); 
        cb(null, fileDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer with the configured storage
const upload = multer({ storage });

module.exports = upload;
