const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const extraScripts = require('./src/scripts/extraScripts');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT;

const nav = [{
    Link: '/auth/profile',
    Text: 'Profile'
},
{
    Link: '/chat',
    Text: 'Chat'
}];

// middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'library',
}));
require('./src/config/passport')(app);
require('./src/config/strategies/local.strategy')(passport);

app.use(express.static(`${__dirname}/public/`));

// routes
const chatRouter = require('./src/routes/chatRouter')(nav);
const authRouter = require('./src/routes/authRouter')(nav);

app.use('/chat', chatRouter);
app.use('/auth', authRouter);

app.set('views', './src/views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index', { nav });
});


io.on('connection', (socket) => {
    // this area to be used for getting the DB and sending an array of messages
    socket.on('windowLoad', (data) => {
        const { pullData } = extraScripts;
        const userMessages = pullData(data);
        io.emit('previousMessages', userMessages);
    });
    socket.on('message', (data) => {
        const { storeData } = extraScripts;
        const returnData = storeData(data, chatRouter.userID);
        io.emit('returnMessage', returnData);
    });
    socket.on('addRoom', (data) => {
        const { addRoom } = extraScripts;
        addRoom(data);
    });
    socket.on('disconnect', () => {
    });
});

server.listen(port, () => console.log(`App is running on ${port}`));


// run db
// mongod --dbpath "C:\Program Files\MongoDB\data"
