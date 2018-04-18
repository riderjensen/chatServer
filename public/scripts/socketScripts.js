var socket = io('http://127.0.0.1:3000/');
// connection to socket IO and sending information to the server
let userName;
function getName() {
    while (userName === '' || userName === null || userName === undefined) {
        userName = prompt('Username?');
    }
    document.getElementById('username').innerHTML = (`${userName}:`);
}
getName();

const x = document.getElementById('chatButton');
x.onclick = () => {
    const userMessage = document.getElementById('inputField').value;
    const date = new Date();
    const timestamp = date.getTime();
    const userTotal = [userName, userMessage, timestamp];
    socket.emit('message', userTotal);
};
socket.on('returnMessage', (userData) => {
    const pTag = document.createElement('p');
    const currentTime = new Date(userData[2]).toLocaleTimeString();
    const textNode = document.createTextNode(`${userData[0]} ${currentTime}: ${userData[1]}`);
    pTag.appendChild(textNode);
    document.getElementById('userMessages').appendChild(pTag);
});


// Enter pushes message out
const input = document.getElementById('inputField');

input.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById('chatButton').click();
        input.value = '';
    }
});
