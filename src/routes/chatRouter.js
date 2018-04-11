const express = require('express');

const chatRouter = express.Router();

function router() {
    chatRouter.route('/1')
        .get((req, res) => {
            res.send('this is the chat area');
        });
    return chatRouter;
}

module.exports = router;
