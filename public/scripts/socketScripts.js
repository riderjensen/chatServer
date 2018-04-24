var socket = io('http://127.0.0.1:3000/');
// connection to socket IO and sending information to the server


// sending information to database
const chatButton = document.getElementById('chatButton');
chatButton.onclick = () => {
    const userMessage = document.getElementById('inputField').value;
    if ((userMessage !== '')) {
        const date = new Date();
        const timestamp = date.getTime();
        const username = document.getElementById('username').innerHTML;
        const userTotal = [username, userMessage, timestamp];
        socket.emit('message', userTotal);
    }
};

// scrolling window
function scrollWindow() {
    const elem = document.getElementById('userMessages');
    elem.scrollTop = elem.scrollHeight;
}

// creating text node for incoming chat messages
function createText(username, className, time, message) {
    // image
    const userImage = document.createElement('img');
    userImage.classList.add('userImage');
    userImage.setAttribute('src', '../images/placeholder.png');
    // username
    const userTag = document.createElement('p');
    const userTextNode = document.createTextNode(`${username}`);
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
function createTextNoUsername(message, time) {
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
    document.getElementById('userMessages').lastChild.appendChild(userInfo);
}


// show incoming message
socket.on('returnMessage', (userData) => {
    const currentTime = new Date(userData[2]).toLocaleTimeString();
    if (userData[0] === document.getElementById('username').innerHTML) {
        if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromHere') === true) {
            createTextNoUsername(userData[1], currentTime);
        } else {
            document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromHere', currentTime, userData[1]));
        }
    } else {
        if (document.getElementById('userMessages').lastElementChild.classList.contains('sentFromOther') === true) {
            createTextNoUsername(userData[1], currentTime);
        } else {
            document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromOther', currentTime, userData[1]));
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

// add room to user list
const addRoomButton = document.getElementById('addRoom');
addRoomButton.onclick = () => {
    const URL = window.location.href;
    const URLArray = URL.split('/');
    const URLArrayLength = URLArray.length;
    const roomID = URLArray[URLArrayLength - 1];
    socket.emit('addRoom', roomID);
};
