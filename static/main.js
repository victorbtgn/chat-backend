let connectionWSUrl = window.location.origin.replace(/https|http/, 'wss');

const socket = new WebSocket(connectionWSUrl);

const titleRef = document.getElementById('title');
const statusRef = document.getElementById('status');
const nameFormRef = document.getElementById('nameForm');
const messageFormRef = document.getElementById('messageForm');
const nameInputRef = document.getElementById('name');
const messageInputRef = document.getElementById('message');
const notificationsRef = document.getElementById('notifications');

nameFormRef.addEventListener('submit', nameInputListener);
messageFormRef.addEventListener('submit', messageInputListener);

socket.onmessage = data => {
    const response = JSON.parse(data.data);
    renderMessage(response);
}

socket.onopen = () => {
    statusRef.innerText = 'online'
};

socket.onclose = () => {
    statusRef.innerText = 'offline'
}

function nameInputListener (evt) {
    evt.preventDefault();
    fetch(
        'http://localhost:3000/registration/',
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nameInputRef.value}),
        }
    ).then(data => {
        console.log('DATA: ', data);
    });

    titleRef.textContent += ` ${nameInputRef.value}`;

    statusRef.classList.toggle('none');
    statusRef.classList.toggle('status');

    nameFormRef.classList.add('none');
    messageFormRef.classList.remove('none');

    nameFormRef.removeEventListener('submit', nameInputListener);
};

function messageInputListener(evt) {
    evt.preventDefault();

    const name = nameInputRef.value;
    const message = messageInputRef.value;

    socket.send(JSON.stringify({ name, message }))

    messageInputRef.value = '';
}

function renderMessage({ name, message }) {
    const li = document.createElement('li');

    const nameElement = document.createElement('span');
    nameElement.className = 'name';
    nameElement.innerText = name;

    const messageElement = document.createElement('span');
    messageElement.className = 'message';
    messageElement.innerText = message;

    li.append(nameElement, messageElement);
    notificationsRef.appendChild(li);
}
