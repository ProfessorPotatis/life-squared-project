/**
 * Client script for preventing iOS devices to open links in Safari.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

let a = document.getElementsByTagName('a');
for (let x = 0; x < a.length; x += 1)
{
    a[x].addEventListener('click', function() {
        window.location = this.getAttribute('href');
        return false;
    });
}
