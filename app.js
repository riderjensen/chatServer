const express = require('express');

const port = process.env.PORT;
const app = express();
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


app.listen(port, () => console.log(`App is running on ${port}`));
