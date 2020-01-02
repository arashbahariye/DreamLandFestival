const express = require('express');
const router = express.Router();
const path = require('path');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');
const reservationRoutes = require('./routes/reservation');
const fs = require('fs');
var helmet = require('helmet');
var morgan = require('morgan');

const sequelize  = require('./utils/database');

const app = express();

app.use(helmet());

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'a'});
app.use(morgan('combined', {stream : logStream}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.static('public'));

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Routing
app.use('/',router);
require("./routes")(app);

const User = require('./models/user');
const Ticket = require('./models/ticket');
const Artistic_Event = require('./models/artisticevent');
const Performer = require('./models/performer');
const Seminary = require('./models/seminary');
const Type = require('./models/type');
const Similarity = require('./models/similarity');
const Performance = require('./models/performance');
const Typologyae = require('./models/typologyae');
const Typologyse = require('./models/typologyse');

//user and ticket
User.hasMany(Ticket);
Ticket.belongsTo(User, { constraints : true, onDelete : 'CASCADE'});

//artistic event and performer
Artistic_Event.belongsToMany(Performer, {through : Performance});
Performer.belongsToMany(Artistic_Event, {through : Performance});

//artistic event and seminary
Seminary.hasMany(Artistic_Event);
Artistic_Event.belongsTo(Seminary);

//artistic event and similar
Artistic_Event.belongsToMany(Artistic_Event, { as: 'similar', through: Similarity });

//artistic event and type
Artistic_Event.belongsToMany(Type, {through : Typologyae});
Type.belongsToMany(Artistic_Event, {through : Typologyae});

//seminary and type
Seminary.belongsToMany(Type, {through : Typologyse});
Type.belongsToMany(Seminary, {through : Typologyse});

console.log(process.env.NODE_ENV || 'develop');

sequelize.authenticate().then( rec => {
    console.log('Connessione Stabilita con Successo');
    //sequelize.sync({force:true})
    sequelize.sync()
    .then(user => {
        console.log('Sync al DB con Successo');
    }).catch( err => {
        console.log('Sync al DB Error:',err);
    });
}).catch( err => {
     console.log('Connession al DB Error:',err);
});

app.listen(process.env.PORT || 8081);