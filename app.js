const express = require('express');

const port = process.env.PORT;
const app = express();

// routes
const chatRouter = require('./src/routes/chatRouter');

app.use(express.static('/public'));
app.use('/chat', chatRouter);
app.set('views', './src/views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index', {
        nav: [{
            Link: '/',
            Text: 'Home'
        }]
    });
});

app.listen(port, () => console.log(`App is running on ${port}`));
