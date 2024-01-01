var html = document.documentElement;

function toggleMode() {
    var hasAttribute = html.hasAttribute('data-mode');
    var value = hasAttribute ? html.getAttribute('data-mode') : null;

    if (hasAttribute) {
        if (value == "light") {
            html.setAttribute('data-mode', 'dark');
        } else {
            html.setAttribute('data-mode', 'light');
        }
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            html.setAttribute('data-mode', 'dark');
        } else {
            html.setAttribute('data-mode', 'light');
        }
    }
}

toggleMode();