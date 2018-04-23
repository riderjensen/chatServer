const { MongoClient, ObjectID } = require('mongodb');

function chatController(nav) {
    function getIndex(req, res) {
        const { username } = req.user;
        const url = 'mongodb://localhost:27017';
        const dbName = 'chatServer';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);

                const col = await db.collection('users');
                const userFromDB = await col.findOne({ username });
                res.render(
                    'chatList',
                    {
                        nav,
                        userFromDB
                    }
                );
            } catch (err) {
                console.log(err.stack);
            }
        }());            
        
    }
    function getById(req, res) {
        const { id } = req.params;

        const url = 'mongodb://localhost:27017';
        const dbName = 'chatServer';
        const user = req.user;

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);

                const col = await db.collection('users');
                

                res.render(
                    'chat',
                    {
                        nav,
                        user
                    }
                );
            } catch (err) {
                console.log(err.stack);
            }
        }());
    }
    function middleware(req, res, next) {
        // if (req.user) {
        next();
        // } else {
        //     res.redirect('/');
        // }
    }
    return {
        getIndex,
        getById,
        middleware
    };
}

module.exports = chatController;
