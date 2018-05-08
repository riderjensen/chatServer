const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// this is for cookies
module.exports = function localStrategy() {
    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        const url = 'mongodb://localhost:27017';
        const dbName = 'chatServer';
        (async function mongo() {
            let client;

            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);
                const col = db.collection('users');
                const user = await col.findOne({ username });

                if (user === null) {
                    done(null, false);
                    console.log('No user');
                } else if (user != null) {
                    bcrypt.compare(password, user.password, function(err, res) {
                        console.log('User entered ' +password);
                        console.log('User password '+ user.password );
                        console.log(res);
                        if(res == true){
                            console.log('User is true');
                            done(null, user);
                        }
                        else{
                            console.log('User is false');
                            done(null, false);
                        }
                    });
                    
                } else {
                    done(null, false);
                }
            } catch (err) {
                console.log(err.stack);
            }
            // Close connection
            client.close();
        }());
    }));
};
