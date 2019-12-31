const express = require('express');
const { body, query } = require('express-validator/check');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

const performerController = require('../controllers/performer');

const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, 'public/images');
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

var cpUpload = upload.single('image');

router.get('/performer', performerController.getPerformers);
router.get('/performer/search', performerController.searchPerformer);
router.get('/performer/:id', performerController.getPerformer);

module.exports = router;