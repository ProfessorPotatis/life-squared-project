/**
 * Client script for memories.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

let images = document.getElementsByClassName('listImg');
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

for (let i = 0; i < images.length; i += 1) {
    images[i].addEventListener(touchEvent, function(event) {
        enhance(event.target);
    });
}

function enhance(image) {
    document.getElementById('memoImage').src = image.src;
    document.getElementById('story').textContent = 'My experience:\r\n' + image.nextElementSibling.textContent;
}
