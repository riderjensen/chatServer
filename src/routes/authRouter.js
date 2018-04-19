const express = require('express');
const { MongoClient } = require('mongodb');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signUp')
        .get((req, res) => {
            res.send('this is the <h1>authorization</h1> area');
        })
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'chatServer';

            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    console.log('Connected correctly to server');

                    const db = client.db(dbName);

                    const col = db.collection('users');
                    const user = { username, password };
                    const results = await col.insertOne(user);
                    req.login(results.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch (err) {
                    console.log(err);
                }
            }());
        });
    authRouter.route('/signIn')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'Sign In'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            const user = req.user;
            res.render('profile', {
                nav,
                user,
                title: 'Profile'
            });
        });
    return authRouter;
}

module.exports = router;
