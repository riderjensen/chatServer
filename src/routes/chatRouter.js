const express = require('express');

const chatRouter = express.Router();

function router(nav) {
    chatRouter.route('/')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            const { user } = req;
            res.render('chat', { nav, user });
        });
    return chatRouter;
}

module.exports = router;
