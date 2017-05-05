/**
 * Client side script for checkboxes and progress bar.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

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
        }
    }

    let percent = percentPerBox * count;
    progressBar.style.width = percent + '%';

}
