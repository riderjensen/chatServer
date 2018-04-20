var socket = io('http://127.0.0.1:3000/');
// connection to socket IO and sending information to the server

const chatButton = document.getElementById('chatButton');
chatButton.onclick = () => {
    const userMessage = document.getElementById('inputField').value;
    const date = new Date();
    const timestamp = date.getTime();
    const username = document.getElementById('username').innerHTML;
    const userTotal = [username, userMessage, timestamp];
    socket.emit('message', userTotal);
};

function createText(username, className, time, message) {
    const pTag = document.createElement('p');
    const textNode = document.createTextNode(`${username} ${time}`);
    pTag.appendChild(textNode);
    const userInfo = document.createElement('p');
    const userInfoTextNode = document.createTextNode(`${message}`);
    userInfo.appendChild(userInfoTextNode);
    const divTag = document.createElement('div');
    divTag.classList.add(className);
    divTag.appendChild(pTag);
    divTag.appendChild(userInfo);
    return divTag;
}

socket.on('returnMessage', (userData) => {
    const currentTime = new Date(userData[2]).toLocaleTimeString();
    if (userData[0] === document.getElementById('username').innerHTML) {
        document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromHere', currentTime, userData[1]));
    } else {
        document.getElementById('userMessages').appendChild(createText(userData[0], 'sentFromOther', currentTime, userData[1]));
    }
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
