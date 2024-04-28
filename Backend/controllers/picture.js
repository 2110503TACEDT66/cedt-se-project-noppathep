// picture.js
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Load environment variables
require('dotenv').config();

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI;

// Create MongoDB connection
const conn = mongoose.createConnection(mongoURI);

// Initialize GridFS stream
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads'
    };
  }
});
const upload = multer({ storage });

// Function to handle file upload
exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ file: req.file });
  });
};

// Function to handle file retrieval
exports.retrieveFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
};
