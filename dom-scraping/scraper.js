/* Keep track of data */
var isActive = true
var updater = null
var textCache = []

/* Get user settings */
chrome.storage.sync.get(["active"]).then((data)=>{
    isActive = data.active
    console.log("Plugin Status:", isActive)
    changeContent()
})

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
    if(style.display === 'none' || element.width < 128 || element.height < 128) {
        return false
    }
    // check if the element has a text node, if so, make sure it's not just whitespace.
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

function changeContent() {
    if (isActive) {
        console.log("change text uwu")
        let textElements = getTextElements()
        for (element of textElements) {
            if (!element.classList.contains("UwU")) {
                textCache.push([element, element.textContent])
                element.innerText = uwuifyText(element.innerText) 
                element.classList.add("UwU")
            }
        }

        setTimeout(() => {changeContent()}, 5 * 1000)
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

function uwuifyText(text) 
{
    if (text) {
        text = text.replace(/(?:r|l)/g, "w");
        text = text.replace(/(?:R|L)/g, "W");
        text = text.replace(/n([aeiou])/g, "ny$1");
        text = text.replace(/N([aeiou])/g, "Ny$1");
        text = text.replace(/th/g, "f");
        text = text.replace(/ove/g, "uv");
        text = text.replace(/!+/g, " " + "❤️".repeat(Math.floor(Math.random() * 3) + 1) + " ");
        text = text.replace(/\?+/g, " " + "🌸".repeat(Math.floor(Math.random() * 3) + 1) + " ");
        return text;
    }
}


/*
 * Get access to all images on the website
 */
function getImageElements() {
    let domElements = document.querySelectorAll("*")
    let imageElements = Array.from(domElements).filter(isImage)
    return imageElements
}

function isImage(element) {
    const style = getComputedStyle(element);
    // Disregard hidden elements and images that are too small.
    if(style.display === 'none' || element.width < 128 || element.height < 128) {
        return false
    }
    return element.tagName == "IMG"
}

function createImageJson(elements) {
    var obj = new Object()
    obj.urls = []
    for (element of elements) {
        obj.urls.push(element.src)
    }
    return JSON.stringify(obj)
}

function postImages(elements) {
    var request = new XMLHttpRequest()
    request.open("POST", "https://wenjunblog.xyz/echoJson")
    request.setRequestHeader("Content-Type", "application/json")
    var data = createImageJson(elements)
    console.log(data)
    request.send(data)

    request.onreadystatechange = function () {
        console.log("Got packet")
        if (request.readyState === 4 && request.status === 200) {
            var json = JSON.parse(request.response)
            console.log(json)
        }
    };
}

function changeImages() {
    let imageElements = getImageElements()
    //postImages(imageElements)
}


/*
 * Track if the updater is active
 */
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

setTimeout(() => {
    changeImages()
}, 2 * 1000)