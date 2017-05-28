/**
 * Client script for preventing iOS devices to open links in Safari.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 (function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener('click',function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;'href'in d&&(d.href.indexOf('http')||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href);},!1);}})(document,window.navigator,'standalone');

/*let a = document.getElementsByTagName('a');
for (let x = 0; x < a.length; x += 1)
{
    a[x].addEventListener('click', function() {
        window.location = this.getAttribute('href');
        return false;
    });
}*/
