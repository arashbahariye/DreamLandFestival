const express = require('express');
const { body, query } = require('express-validator/check');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

const artisticeventController = require('../controllers/artisticevent');

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

router.get('/artisticevent', artisticeventController.getArtisticevents);
router.get('/artisticevent/searchbytitle', artisticeventController.searchArtisticeventByTitle);
router.get('/artisticevent/searcheventsbydate', artisticeventController.searchEventsByDate);
router.get('/artisticevent/searcheventsbytype', artisticeventController.searchEventsByType);
router.get('/artisticevent/:id', artisticeventController.getArtisticevent);
router.get('/artisticevent/sameday/:id', artisticeventController.getSameDayEvents);
router.get('/artisticevent/similars/:id', artisticeventController.getSimilars);
router.get('/types', artisticeventController.getTypes);

module.exports = router;