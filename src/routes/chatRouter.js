const express = require('express');
const passport = require('passport');

const chatRouter = express.Router();

function router(nav) {
    chatRouter.route('/')
        // .get((req, res) => {
        //     res.render('chat', { nav });
        // })
        .get(passport.authenticate('local', {
            successRedirect: '/chat',
            failureRedirect: '/'
        }));
    return chatRouter;
}

module.exports = router;
