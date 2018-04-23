const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
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

                    const db = client.db(dbName);

                    const col = db.collection('users');
                    const user = { username, password };
                    const results = await col.insertOne(user);
                    const userFromDB = await col.findOne({ username });
                    req.login(results.ops[0], () => {
                        const { _id } = userFromDB;
                        const usernameFromDB = {
                            'username':username
                        }
                        const newVals = {$push: {rooms: [{
                            Link:'announcements',
                            Text:'Announcements'
                        }
                        // },
                        // {
                        //     Link:{ _id: new ObjectID(_id) },
                        //     Text:'Your Chat Room'
                        // }
                        ]}};
                        col.update(usernameFromDB, newVals, (err, res) => {
                            if(err) throw err;
                        })
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
            const userData = req.user;
            res.render('profile', {
                nav,
                userData,
                title: 'Profile'
            });
        });
    return authRouter;
}

module.exports = router;
