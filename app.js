const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT;

const nav = [{
    Link: '/auth',
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


let currentUsers = 0;

io.on('connection', (socket) => {
    currentUsers += 0.5;
    console.log(`Current Users Here: ${currentUsers}`);
    socket.on('my other event', (data) => {
        console.log(data);
    });
    socket.on('message', (data) => {
        io.emit('returnMessage', data);
    });
    socket.on('disconnect', () => {
        currentUsers -= 0.5;
        console.log(`Current Users Here: ${currentUsers}`);
    });
});

server.listen(port, () => console.log(`App is running on ${port}`));


// run db
// mongod --dbpath "C:\Program Files\MongoDB\data"
