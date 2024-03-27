var elements = document.querySelectorAll('.scrolling-image')
var animationDuration = 500;

for (var i = 0; i < elements.length; i++) {
    var randomDuration = Math.floor(Math.random() * animationDuration);
    elements[i].style.animationDelay = -randomDuration + 's';
}