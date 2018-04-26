const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

module.exports =  {
    addRoom: function(data) {
        const { _id } = data;
        const { username } = data;
        const url = 'mongodb://localhost:27017';
        const dbName = 'chatServer';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);

                const db = client.db(dbName);

                const col = await db.collection('users');
                // search for current user of the chat
                const addRoomHere = await col.findOne({ username });
                // find owner of the chat room
                const usernameToAdd = await col.findOne({ _id: new ObjectID(_id) });
                console.log(addRoomHere.rooms);
                const addRoomHereUser = {
                    username:username
                };
                const newVals = {
                    $push: {
                        rooms: [{
                            Link: { _id: new ObjectID(_id) },
                            Text: `${usernameToAdd.username}'s Room`
                        }
                        ]
                    }
                };
                col.update(addRoomHereUser, newVals, (err) => {
                    if (err) throw err;
                });
            } catch (err) {
                console.log(err.stack);
            }
        }());
    }

};
