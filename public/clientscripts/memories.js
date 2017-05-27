/**
 * Client script for memories.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

let images = document.getElementsByClassName('listImg');

// Add support for touch event on mobile
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

for (let i = 0; i < images.length; i += 1) {
    images[i].addEventListener(touchEvent, function(event) {
        enhance(event.target);
    });
}

// When an image is clicked -> show bigger image and users written text about memory
function enhance(image) {
    document.getElementById('memoImage').src = image.src;
    document.getElementById('story').textContent = 'My experience:\r\n' + image.nextElementSibling.textContent;
}
