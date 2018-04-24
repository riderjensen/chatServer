const express = require('express');
const { MongoClient } = require('mongodb');

module.exports =  {
    addRoom: function(data) {
        console.log(data);
        // change socketScript so that it takes the id of the chat room and the username
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
                const usernameToAdd = await col.findOne({ _id: roomID });
                console.log(addRoomHere);
                console.log(usernameToAdd);

                // add owener of chatroom with ID to the addRoomHere rooms section on database
            } catch (err) {
                console.log(err.stack);
            }
        }());
    }

};
