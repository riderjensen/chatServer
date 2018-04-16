const express = require('express');
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

io.on('connection', function (socket) {
    currentUsers = currentUsers + 1;
    console.log("Current Users Here: " + currentUsers);
    socket.on('my other event', function (data) {
      console.log(data);
    });
    socket.on('message', function (data) {
      io.emit('otherMessage', data);
    });
    socket.on('disconnect', function () {
    currentUsers = currentUsers -1;
    console.log("Current Users Here: " + currentUsers);
  });
  });

server.listen(port, () => console.log(`App is running on ${port}`));
