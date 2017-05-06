/**
 * Client side script for checkboxes and progress bar.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 // Connect to socket.io.
 let socket = io();

 // When receiving WebHook data from GitHub.
 socket.on('webhook', function (data) {
     addNotification(data);

     if (data.message.action.includes('comment')) {
         flashComments(data.message);
     } else if (data.message.action.includes('issue')) {
         toggleIssue(data.message);
     }

     // Send message to server
     socket.send(data.message);
 });

let checkboxes = document.getElementsByClassName('checkbox');
let percentPerBox = 100 / checkboxes.length;

showProgress();

for (let i = 0; i < checkboxes.length; i += 1) {
    checkboxes[i].addEventListener('click', showProgress);
}

function showProgress(e) {
    let progressBar = document.getElementById('myBar');
    let count = 0;

    for (let x = 0; x < checkboxes.length; x += 1) {
        if (checkboxes[x].checked) {
            count += 1;
            console.log(checkboxes[x]);
        }
    }

    let percent = percentPerBox * count;
    progressBar.style.width = percent + '%';

}
