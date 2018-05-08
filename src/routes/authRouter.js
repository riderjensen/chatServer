const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');
const bcrypt = require('bcrypt');


const authRouter = express.Router();


function router(nav) {
    authRouter.route('/signUp')
        .get((req, res) => {
            res.redirect('/profile');
        })
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'chatServer';
                bcrypt.hash(password, 10, function(err, hash) {
                    console.log(hash);
                (async function addUser() {
                    let client;
                    try {
                        client = await MongoClient.connect(url);

                        const db = client.db(dbName);
                        const col = db.collection('users');
                        const userFromDB = await col.findOne({ username });
                        if (userFromDB) {
                            console.log('Duplicate User');
                        } else {
                            
                            const user = { username, password: hash };
                            const results = await col.insertOne(user);

                            req.login(results.ops[0], () => {
                                const { _id } = user;
                                const usernameFromDB = {
                                    username: username
                                };
                                const newVals = {
                                    $push: {
                                        rooms: {
                                            Link: { _id: new ObjectID(_id) },
                                            Text: 'Your Chat Room'
                                        }
                                    }
                                };
                                col.update(usernameFromDB, newVals, (err) => {
                                    if (err) throw err;
                                });
                                res.redirect('/auth/profile');
                            });
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }());
            });
        });
    authRouter.route('/signIn')
        .get((req, res) => {
            res.redirect('auth/profile');
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
