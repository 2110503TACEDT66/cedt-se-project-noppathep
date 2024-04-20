const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // For file operations

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const uploadDir = './uploads/';
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => {
                cb(null, uploadDir);
            })
            .catch((err) => {
                console.error('Error creating upload directory:', err);
                cb(err, null);
            });
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.uploadImage = async (req, res, next) => {
    try {
        // Check if req.file exists (assuming you have a single file upload)
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Access the uploaded file path
        const imagePath = req.file.path;

        // Save the image path to your database or storage
        const savedImage = await ImageModel.create({ image: imagePath });

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: savedImage
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

exports.deleteImage = async (req, res, next) => {
    try {
        // Assuming you have an ID parameter for the image to be deleted
        const { id } = req.params;

        // Find the image path from the database
        const image = await ImageModel.findById(id);

        // Delete the image file from the storage
        await fs.unlink(image.image);

        // Delete the image document from the database
        await ImageModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
