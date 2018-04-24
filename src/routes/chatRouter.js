const express = require('express');
const chatController = require('../controllers/userController');

const chatRouter = express.Router();

function router(nav) {
    const { getIndex, getById } = chatController(nav);
    chatRouter.route('/')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get(getIndex);

    chatRouter.route('/:id')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get(getById);
    return chatRouter;
}

module.exports = router;
