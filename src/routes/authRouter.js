const express = require('express');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/')
        .get((req, res) => {
            res.send('this is the <h1>authorization</h1> area');
        });
    return authRouter;
}

module.exports = router;
