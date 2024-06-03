const me = "ggasconmoline";
const place = "gmail.com";

const elink = document.querySelectorAll(".mlink");
const etext = document.querySelectorAll(".mtext");

elink.forEach(function (el) {
    el.href = `mailto:${me}@${place}`;
});
etext.forEach(function (el) {
    el.textContent = `${me}@${place}`;
});
