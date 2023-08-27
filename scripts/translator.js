/* Keep track of data */
var isActive = true
var textCache = []

/* Get user settings */
chrome.storage.sync.get(["active"]).then((data)=>{
    isActive = data.active
    console.log("Plugin Status:", isActive)
    changeContent()
})

/* Track if the updater is active */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "toggled") {
            console.log("uwu toggled:", request.data)
            isActive = request.data
            if (isActive) {
                changeContent()
            } else {
                restoreContent()
            }
        }
    }
});


/*
 * Grabs text containers and UwUify the content
 */
function getTextElements() {
    let domElements = document.querySelectorAll("*")
    let textElements = Array.from(domElements).filter(containText)
    return textElements
}

function containText(element) {
    const style = getComputedStyle(element);
    // Disregard hidden elements and images that are too small.
    if(style.display === 'none' || element.width <= 0 || element.height <= 0) {
        return false
    }
    // check if the element has a text node, if so, make sure it's not just whitespace.
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

function changeContent() {
    if (isActive) {
        let textElements = getTextElements()
        for (element of textElements) {
            if (!element.classList.contains("UwU")) {
                textCache.push([element, element.textContent])
                element.innerText = uwuifyText(element.innerText) 
                element.classList.add("UwU")
            }
        }

        setTimeout(() => {changeContent()}, 3 * 1000)
    }
}

function restoreContent() {
    console.log("Restore Text")
    for (let i = 0; i < textCache.length; ++i) {
        if (textCache[i][0].classList.contains("UwU")) {
            textCache[i][0].textContent = textCache[i][1]
            textCache[i][0].classList.remove("UwU")
        }
    }
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function uwuifyText(text) {
    const uwuReplacements = [
        // ... other replacement rules ...
        { pattern: /\bcan\b/g, replacement: "c-can" }, // \b ensures whole word matching
        //{ pattern: /(\w)(\w*)/g, replacement: "$1-$1$2" }, // Stuttering effect
        { pattern: /!+/g, replacement: () => " " + getRandomElement(["❤️", "৻(  •̀ ᗜ •́  ৻)", "♡⸜(˶˃ ᵕ ˂˶)⸝♡", "o(*>ω<*)o", "(ﾉ´ヮ´)ﾉ", "( ˶ˆᗜˆ˵ )", "♡⸜(˶˃ ᵕ ˂˶)⸝♡"]) + " " },
        { pattern: /\?+/g, replacement: () => " " + getRandomElement(["🌸", "o( ˶^▾^˶ )o", "⸜(｡˃ ᵕ ˂ )⸝♡", "(‘. • ᵕ •. `)", "(づ •. •)?", "◝(ᵔᵕᵔ)◜", "(ㅅ´ ˘ `)"]) + " " },
        { pattern: /\.+(?=$|\s)/g, replacement: () => " " + getRandomElement(["<(˶ᵔᵕᵔ˶)>", "(*´▽`*)", "( • ᴗ - ) ✧", "(｡>﹏<)", "◝(ᵔᵕᵔ)◜", "(,,>﹏<,,)"]) + " " },
    ];

    if (text) {
        text = text.replace(/(?:r|l)/g, "w");
        text = text.replace(/(?:R|L)/g, "W");
        text = text.replace(/n([aeiou])/g, "ny$1");
        text = text.replace(/N([aeiou])/g, "Ny$1");
        text = text.replace(/th/g, "f");
        text = text.replace(/ove/g, "uv");
        // text = text.replace(/!+/g, " " + "❤️".repeat(Math.floor(Math.random() * 3) + 1) + " ");
        // text = text.replace(/\?+/g, " " + "🌸".repeat(Math.floor(Math.random() * 3) + 1) + " ");

        uwuReplacements.forEach(({pattern, replacement}) => {
            if (typeof replacement === "function") {
                text = text.replace(pattern, replacement);
            } else {
                text = text.replace(pattern, replacement);
            }
        });
        return text;
    }
}