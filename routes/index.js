const authRoutes = require('./auth');
const reservationRoutes = require('./reservation')
const artisticeventRoutes = require('./artisticevent');
const performerRoutes = require('./performer');
const seminaryRoutes = require('./seminary');
const galleryRoutes = require('./gallery');

module.exports = function(app) {
    app.use('/auth', authRoutes);
    app.use('/reservation', reservationRoutes)
    app.use('/artisticevent', artisticeventRoutes);
    app.use('/performer', performerRoutes);
    app.use('/seminary', seminaryRoutes);
    app.use('/gallery', galleryRoutes);
};