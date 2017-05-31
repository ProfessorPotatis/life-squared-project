/**
 * Client script for user page.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

// When page is loaded -> connect to socket,
// add event listeners to padlocks and checkboxes,
// and calculate users progress
function ready() {
    // Connect to socket.io.
    let socket = io();

    let dates = document.getElementsByClassName('date');

    for (let x = 0; x < dates.length; x += 1) {
        let d = new Date(dates[x].textContent);
        let months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
        dates[x].textContent = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    let lockImg = document.getElementsByClassName('lockImg');

    for (let i = 0; i < lockImg.length; i += 1) {
        lockImg[i].addEventListener('click', function(event) {
            lockList(event.target);
        });
    }

    // Toggle padlock image and save locked value to database
    function lockList(clickedImg) {
        let src = document.getElementById(clickedImg.id).src;
        let addGoalButton = document.getElementById(clickedImg.id).parentNode.getElementsByClassName('addGoal')[0];

        if (src.indexOf('padlock-green.png') != -1) {
            addGoalButton.setAttribute('hidden', true);
            document.getElementById(clickedImg.id).src = '/images/padlock-red.png';
        } else {
            addGoalButton.removeAttribute('hidden');
            document.getElementById(clickedImg.id).src = '/images/padlock-green.png';
        }

        socket.emit('lockList', {id: clickedImg.id, list: clickedImg.getAttribute('data-list')});
    }

    let checkboxes = document.getElementsByClassName('checkbox');
    let percentPerBox = 100 / checkboxes.length;
    let theCount = 0;

    for (let i = 0; i < checkboxes.length; i += 1) {
        checkboxes[i].addEventListener('click', showProgress);
        if (theCount === 0 && checkboxes[i].checked) {
            theCount += 1;
            showProgress();
        }
    }

    // Update progress bar and notify server about checked and unchecked checkboxes
    function showProgress() {
        let progressBar = document.getElementById('myBar');
        let count = 0;

        for (let x = 0; x < checkboxes.length; x += 1) {
            if (checkboxes[x].checked) {
                checkboxes[x].nextElementSibling.nextElementSibling.removeAttribute('hidden');
                count += 1;
                // When checkbox is checked, send message to server.
                socket.emit('checked', {message: checkboxes[x].value, id: checkboxes[x].id, list: checkboxes[x].getAttribute('data-list')});
            } else if (!checkboxes[x].checked) {
                checkboxes[x].nextElementSibling.nextElementSibling.setAttribute('hidden', true);
                // When checkbox is unchecked, send message to server.
                socket.emit('unchecked', {message: checkboxes[x].value, id: checkboxes[x].id, list: checkboxes[x].getAttribute('data-list')});
            }
        }

        let percent = percentPerBox * count;
        progressBar.style.width = percent + '%';
    }
}
window.onload = ready();
