/**
 * Client script for chat.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

let edgeBrowser = /Edge/.test(navigator.userAgent) && !window.MSStream;
let ieBrowser = /MSIE/.test(navigator.userAgent) && !window.MSStream;

if (edgeBrowser || ieBrowser) {
    alert('The chat is not supported in Microsoft Edge or Internet Explorer. Please use any other browser.');
}

// Connect to socket.io.
let socket = io();

let url = window.location.pathname;
let urlArray = url.split('/');
let path = urlArray[urlArray.length - 2];

let template2 = document.querySelectorAll('template')[1];
let connectedUser = document.importNode(template2.content.firstElementChild, true);

if (path === 'chat') {
    let chatDiv = document.getElementsByClassName('chat')[0];
    let user = urlArray[urlArray.length - 1];
    let sendBtn = document.getElementsByClassName('send')[0];

    sendBtn.addEventListener('click', function(event) {
        sendMessage(event.target.previousElementSibling.value, user);
        event.target.previousElementSibling.value = '';
        event.preventDefault();
    });

    chatDiv.addEventListener('keypress', function(event) {
        // Listen for Enter key
        if (event.keyCode === 13) {
            // Send a message and empty the textarea
            sendMessage(event.target.value, user);
            event.target.value = '';
            event.preventDefault();
        }
    });

    function sendMessage(message, user) {
        socket.emit('chat message', {message: message, user: user});
    }

    socket.on('new user', function(user) {
        let message = 'System message: A user connected to chat.';
        socket.emit('system message', {message: message, user: user});
    });

    socket.on('print message', function(theMsg) {
        let template = document.querySelectorAll('template')[0];
        let messageDiv = document.importNode(template.content.firstElementChild, true);

        messageDiv.querySelectorAll('.author')[0].textContent = theMsg.user;
        messageDiv.querySelectorAll('.text')[0].textContent = theMsg.msg;

        let messages = document.getElementsByClassName('messages')[0];
        messages.appendChild(messageDiv);

        if (theMsg.users) {
            addUserToList(theMsg.users);
        }
    });

    function addUserToList(users) {
        let theUsers = document.getElementsByClassName('theUsers')[0];

        connectedUser.querySelectorAll('.user')[0].textContent = '';

        connectedUser.querySelectorAll('.user')[0].setAttribute('style', 'white-space: pre;');

        for (let i = 0; i < users.length; i += 1) {
            connectedUser.querySelectorAll('.user')[0].textContent += users[i] + '\r\n';
        }

        theUsers.appendChild(connectedUser);
    }
}
