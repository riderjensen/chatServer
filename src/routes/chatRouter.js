const express = require('express');

const chatRouter = express.Router();

function router(nav) {
    chatRouter.route('/')
        .get((req, res) => {
            res.render('chat', { nav });
        });
    return chatRouter;
}

module.exports = router;
