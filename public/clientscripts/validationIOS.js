/**
 * Client script for form validation on iOS mobile devices.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

// Form validation for earlier, not updated versions of iOS mobile devices
let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
let browserVersion = /10_3/.test(navigator.userAgent) && !window.MSStream;

if (iOS && !browserVersion) {
    let form = document.getElementById('myForm');
     form.noValidate = true;
     form.addEventListener('submit', function(event) {
        if (!event.target.checkValidity()) {
             event.preventDefault();
             alert('Error! You must fill all required fields.');
    }
    }, false);
}
