var socket = io.connect();
// connection to socket IO and sending information to the server
const URL = window.location.href;
const URLArray = URL.split('/');
const URLArrayLength = URLArray.length;
const room = URLArray[URLArrayLength - 1];
const username = document.getElementById('username').innerHTML;

socket.on('connect', () => {
    socket.emit('room', room);
});

// sending information to server
const chatButton = document.getElementById('chatButton');
chatButton.onclick = () => {
    const userMessage = document.getElementById('inputField').value;
    if ((userMessage !== '')) {
        // URL
        const userTotal = [username, userMessage, URL];
        socket.emit('message', userTotal, room);
    }
};

function pullData() {
    socket.emit('windowLoad', URL);
}
window.onload = pullData;

// scrolling window
function scrollWindow() {
    const elem = document.getElementById('userMessages');
    elem.scrollTop = elem.scrollHeight;
}

// creating text node for incoming chat messages
function createText(user, className, time, message) {
    // image
    const userImage = document.createElement('img');
    userImage.classList.add('userImage');
    userImage.setAttribute('src', '../images/placeholder.png');
    // username
    const userTag = document.createElement('p');
    const userTextNode = document.createTextNode(`${user}`);
    userTag.appendChild(userTextNode);
    // div for username and image
    const usernameAndImageDiv = document.createElement('div');
    usernameAndImageDiv.appendChild(userImage);
    usernameAndImageDiv.appendChild(userTag);
    // time
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('userTime');
    const timeTextNode = document.createTextNode(`${time} `);
    timeSpan.appendChild(timeTextNode);
    // message
    const userInfo = document.createElement('p');
    const userMessageNode = document.createTextNode(`${message}`);
    // add
    userInfo.appendChild(timeSpan);
    userInfo.appendChild(userMessageNode);
    const divTag = document.createElement('div');
    divTag.classList.add(className);
    divTag.appendChild(usernameAndImageDiv);
    divTag.appendChild(userInfo);
    return divTag;
}

// create text without a username attached
function createTextNoUsername(message, className, time) {
    // creating div
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(className);
    // time
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('userTime');
    const timeTextNode = document.createTextNode(`${time} `);
    timeSpan.appendChild(timeTextNode);
    // message
    const userInfo = document.createElement('p');
    const userInfoTextNode = document.createTextNode(`${message}`);
    // add
    userInfo.appendChild(timeSpan);
    userInfo.appendChild(userInfoTextNode);
    messageDiv.appendChild(userInfo);
    document.getElementById('userMessages').appendChild(messageDiv);
}


// show incoming message
socket.on('returnMessage', (userData) => {
    const currentTime = new Date(userData[2]).toLocaleTimeString();
    if (userData[0] === document.getElementById('username').innerHTML) {
        if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromHere') === true) {
            createTextNoUsername(userData[1], 'sentFromHere', currentTime);
        } else {
            document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromHere', currentTime, userData[1]));
        }
    } else {
        if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromOther') === true) {
            createTextNoUsername(userData[1], 'sentFromOther', currentTime);
        } else {
            document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromOther', currentTime, userData[1]));
        }      
    }
    scrollWindow();
});

// get messages to display from db
socket.on('previousMessages', (prevMessagesArray) => {
    for (let i = 0; i < prevMessagesArray.length; i += 1) {
        const currentTime = new Date(prevMessagesArray[i].Time).toLocaleTimeString();
        if (prevMessagesArray[i].User === document.getElementById('username').innerHTML) {
            if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromHere') === true) {
                createTextNoUsername(prevMessagesArray[i].Message, 'sentFromHere', currentTime);
            } else {
                document.getElementById('userMessages').appendChild(createText(prevMessagesArray[i].User, 'sentFromHere', currentTime, prevMessagesArray[i].Message));
            }
        } else {
            if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromOther') === true) {
                createTextNoUsername(prevMessagesArray[i].Message, 'sentFromOther', currentTime);
            } else {
                document.getElementById('userMessages').appendChild(createText(prevMessagesArray[i].User, 'sentFromOther', currentTime, prevMessagesArray[i].Message));
            }      
        }
    }
    scrollWindow();
});

// Enter pushes message out
const input = document.getElementById('inputField');
input.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        chatButton.click();
        input.value = '';
    }
});

// user typing
const textInput = document.getElementById('inputField');
let timeout = null;
textInput.onkeyup = () => {
    socket.emit('typing', username);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        socket.emit('stopTyping');
    }, 1000);
};

socket.on('typing', (user) => {
    document.getElementById('userTyping').innerHTML = `<p class="userTyping">${user} is typing</p>`;
});

socket.on('stopTyping', () => {
    document.getElementById('userTyping').innerHTML = '';
});

// add room to user list
const addRoomButton = document.getElementById('addRoom');
addRoomButton.onclick = () => {
    const roomIDandUser = { _id: room, username: username }
    socket.emit('addRoom', roomIDandUser);
};
