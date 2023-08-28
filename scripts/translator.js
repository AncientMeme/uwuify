/* Translator Rulesets */
const rules = [
    { pattern: /(?:r|l)/g, replacement: "w"},
    { pattern: /(?:R|L)/g, replacement: "W"},
    { pattern: /n([aeiou])/g, replacement: "ny$1"},
    { pattern: /N([AEIOU])/g, replacement: "NY$1"},
    { pattern: /th/g, replacement: "f"},
    { pattern: /ove/g, replacement: "uv"},
    { pattern: /\bcan\b/g, replacement: "c-can" },
    { pattern: /!+/g, replacement: () => " " + getRandomElement(["৻(  •̀ ᗜ •́  ৻)", "♡⸜(˶˃ ᵕ ˂˶)⸝♡", "o(*>ω<*)o", "(ﾉ´ヮ´)ﾉ", "( ˶ˆᗜˆ˵ )", "♡⸜(˶˃ ᵕ ˂˶)⸝♡"]) + " " },
    { pattern: /\?+/g, replacement: () => " " + getRandomElement(["o( ˶^▾^˶ )o", "⸜(｡˃ ᵕ ˂ )⸝♡", "(‘. • ᵕ •. `)", "(づ •. •)?", "◝(ᵔᵕᵔ)◜", "(ㅅ´ ˘ `)"]) + " " },
    { pattern: /\.+(?=$|\s)/g, replacement: () => " " + getRandomElement(["<(˶ᵔᵕᵔ˶)>", "(*´▽`*)", "( • ᴗ - ) ✧", "(｡>﹏<)", "◝(ᵔᵕᵔ)◜", "(,,>﹏<,,)"]) + " " },
];

/* Keep track of data */
var isActive = true;
var textCache = [];

/* Get user settings */
chrome.storage.sync.get(["active"]).then((data)=>{
    console.log("uwuify status:", isActive);
    isActive = data.active;
    changeContent();
})

/* Track if the plugin is active */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request && request.msg == "toggled") {
        isActive = request.data;
        isActive ? changeContent() : restoreContent();
    }
});

/*
 * Grabs text containers and UwUify the content
 */
function getTextElements() {
    let domElements = document.querySelectorAll("*");
    let textElements = Array.from(domElements).filter(containText);
    return textElements;
}

function containText(element) {
    const style = getComputedStyle(element);
    // Disregard hidden elements and images that are too small.
    if(style.display === 'none' || element.width <= 0 || element.height <= 0) {
        return false;
    }
    // check if the element has a text node, if so, make sure it's not just whitespace.
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

function changeContent() {
    if (!isActive) {
        return;
    }

    let textElements = getTextElements();
    for (element of textElements) {
        if (!element.classList.contains("UwU")) {
            textCache.push([element, element.textContent]);
            element.innerText = uwuifyText(element.innerText) ;
            element.classList.add("UwU");
        }
    }

    setTimeout(() => {changeContent()}, 3 * 1000);
}

function restoreContent() {
    for (let i = 0; i < textCache.length; ++i) {
        if (textCache[i][0].classList.contains("UwU")) {
            textCache[i][0].textContent = textCache[i][1];
            textCache[i][0].classList.remove("UwU");
        }
    }
}

function uwuifyText(text) {
    if (text) {
        rules.forEach(({pattern, replacement}) => {
            text = text.replace(pattern, replacement);
        });
        return text;
    }
}

/* Util functions */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}