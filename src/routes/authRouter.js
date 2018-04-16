const express = require('express');
const { MongoClient } = require('mongodb');
const assert = require('assert');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/')
        .get((req, res) => {
            res.send('this is the <h1>authorization</h1> area');
        });
    return authRouter;
}

module.exports = router;
