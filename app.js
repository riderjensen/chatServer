const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const extraScripts = require('./src/scripts/extraScripts');
const { MongoClient, ObjectID } = require('mongodb');

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
    socket.on('room', (room) => {
        socket.join(room);
    });
    // send out the previous chat messages when the page is loaded
    socket.on('windowLoad', (data) => {
        const URLArray = data.split('/');
        const URLArrayLength = URLArray.length;
        const roomID = URLArray[URLArrayLength - 1];
        (async function mongo() {
            const url = 'mongodb://localhost:27017';
            const dbName = 'chatServer';
            try {
                const client = await MongoClient.connect(url);
                const db = client.db(dbName);
                const col = await db.collection('users');
                const findChatRoomOwner = await col.findOne({ _id: new ObjectID(roomID) });
                const discourseList = findChatRoomOwner.discourse;
                if (discourseList.length < 50 || discourseList === undefined) {
                    socket.emit('previousMessages', discourseList);
                } else {
                    const shortList = discourseList.slice((discourseList.length - 50), discourseList.length);
                    socket.emit('previousMessages', shortList);
                }
            } catch (err) {
                console.log(err);
            }
        }());
    });
    socket.on('message', (data, room) => {
        const { storeData } = extraScripts;
        const returnData = storeData(data);
        io.sockets.in(room).emit('returnMessage', returnData);
    });
    socket.on('addRoom', (data) => {
        const { addRoom } = extraScripts;
        addRoom(data);
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });
    socket.on('disconnect', () => {
    });
});

server.listen(port, () => console.log(`App is running on ${port}`));


// run db
// mongod --dbpath "C:\Program Files\MongoDB\data"
