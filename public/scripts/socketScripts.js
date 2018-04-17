let userName;
function getName() {
    while (userName === '' || userName === null || userName === undefined) {
        userName = prompt('Username?');
    }
    document.getElementById('username').innerHTML = (`Username : ${userName}`);
}
getName();
var socket = io('http://127.0.0.1:3000/');
socket.on('news', (data) => {
    console.log(data);
    socket.emit('my other event', {
        my: 'data'
    });
});
const x = document.getElementById('submitButton');
x.onclick = () => {
    const userMessage = document.getElementById('data').value;
    const userTotal = [userName, userMessage];
    socket.emit('message', userTotal);
};
socket.on('otherMessage', (userData) => {
    const pTag = document.createElement('p');
    const textNode = document.createTextNode(`${userData[0]} : ${userData[1]}`);
    pTag.appendChild(textNode);
    document.getElementById('userMessages').appendChild(pTag);
});
