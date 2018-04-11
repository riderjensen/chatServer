const express = require('express');


const port = process.env.PORT;
const app = express();

// routes
const chatRouter = require('./src/routes/chatRouter');

app.use('/chat', chatRouter);

app.get('/', (req, res) => {
    res.send('index page');
});

app.listen(port, () => console.log(`App is running on ${port}`));
