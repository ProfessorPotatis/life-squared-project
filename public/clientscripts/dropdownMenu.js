/**
 * Client script for dropdownMenu.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

// Toggle view of dropdown menu
function dropdownMenu() {
    document.getElementById('theMenu').classList.toggle('show');
}

// Polyfill for Element.matches and Element.matchesSelector
window.onclick = function(event) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Close dropdown menu when user clicks outside of the menu
    if (!event.target.matches('.navMobile')) {
        let dropdowns = document.getElementsByClassName('navList');

        for (let i = 0; i < dropdowns.length; i += 1) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

// On click -> toggle view of dropdown menu.
document.getElementsByClassName('navMobile')[0].addEventListener('click', dropdownMenu);
