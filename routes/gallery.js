const express = require('express');
const { body, query } = require('express-validator/check');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

const galleryController = require('../controllers/gallery');

const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'public/gallery');
    },
    filename : (req, file, callback) => {
        //callback(null, Date.now() + '-' + file.originalname);
        callback(null, uuidv4() + path.extname(file.originalname));
    },
});

const fileFilter = ((req, file, callback) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        callback(null, true);
    } else {
        req.fileValidationError = "Estensione non consentita solo: 'image/jpg' | 'image/png' | 'image/jpeg'";
        callback(null, false);
    }
});

var upload = multer({ storage : storage, fileFilter : fileFilter});

var cpUpload = upload.fields([
    {name : 'avatar', maxCount : 1},
    {name : 'gallery', maxCount : 8}
]);

router.post('/', [isAuth, cpUpload], galleryController.createGallery);

module.exports = router;