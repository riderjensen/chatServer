const express = require('express');
const passport = require('passport');

const chatRouter = express.Router();

function router(nav) {
    chatRouter.route('/')
        .all((req, res, next) => {
            if(req.user) {
                next();
            } else {
                res.redirect('/')
            }
        })
        .get((req, res) => {
            const user = req.user;
            res.render('chat', { nav, user });
        })
        ;
    return chatRouter;
}

module.exports = router;
