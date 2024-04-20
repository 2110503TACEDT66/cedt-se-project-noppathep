const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the directory where uploaded files will be stored
        const uploadDir = './uploads/';
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Rename the file (you can customize the file name as needed)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Route for uploading an image
router.post('/upload', upload.single('image'), imageController.uploadImage);

// Route for deleting an image
router.delete('/:id', imageController.deleteImage);

module.exports = router;