/**
 * Client script for uploading images.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

document.getElementById('files').onchange = function () {
    // Create new FileReader
    let reader = new FileReader();

    reader.onload = function (e) {
        // Get loaded data and render thumbnail
        document.getElementById('image').src = e.target.result;
        document.getElementById('imgSrc').value = e.target.result;
    };

    // Read the image file as a data URL
    document.getElementById('typeOfFile').value = this.files[0].type;
    reader.readAsDataURL(this.files[0]);
};
