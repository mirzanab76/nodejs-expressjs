const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfigurasi storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'users', // folder di cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // format yang diizinkan
        transformation: [{ width: 500, height: 500, crop: 'limit' }] // optional: resize gambar
    }
});

// Konfigurasi upload
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2 // Limit 2MB
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

module.exports = {
    upload,
    cloudinary
};