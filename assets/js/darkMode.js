var html = document.documentElement;

if (localStorage.getItem("pref-theme") === "dark") {
    html.setAttribute('data-mode', 'dark');
} else if (localStorage.getItem("pref-theme") === "light") {
    html.removeAttribute('data-mode');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-mode', 'dark');
}
function toggleMode() {
    var hasAttribute = html.hasAttribute('data-mode');

    if (hasAttribute) {
        html.removeAttribute('data-mode');
        localStorage.setItem("pref-theme", 'light');
    } else {
        html.setAttribute('data-mode', 'dark');
        localStorage.setItem("pref-theme", 'dark');
    }
}