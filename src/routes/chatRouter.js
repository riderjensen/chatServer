const express = require('express');

const chatRouter = express.Router();

function router(nav) {
    chatRouter.route('/')
        .get((req, res) => {
            res.send('this is the <h1>chat</h1> area');
        });
    return chatRouter;
}

module.exports = router;
