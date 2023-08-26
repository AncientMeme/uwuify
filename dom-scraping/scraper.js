/* Keep track of data */
var isActive = true
var textCache = []
// Update Every 5 seconds
var updater = setInterval(() => {
    textElements = getTextElements()
    changeContent(textElements)
}, 5 * 1000)


/*
 * Grabs text containers and UwUify the content
 */
function getTextElements() {
    let domElements = document.querySelectorAll("*")
    let textElements = Array.from(domElements).filter(containText)
    return textElements
}

function containText(element) {
    // check if the element has a text node, if so, make sure it's not just whitespace.
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

function changeContent(textElements) {
    for (element of textElements) {
        if (!element.classList.contains("UwU")) {
            textCache.push([element, element.textContent])
            element.textContent = "UwU " + element.textContent
            element.classList.add("UwU")
        }
    }
}

function restoreContent() {
    for (let i = 0; i < textCache.length; ++i) {
        console.log("Restore Text")
        if (textCache[i][0].classList.contains("UwU")) {
            textCache[i][0].textContent = textCache[i][1]
            textCache[i][0].classList.remove("UwU")
        }
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
    if(style.display === 'none' || element.width <= 128 || element.height <= 128) {
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
    request.open("POST", "//8.222.181.202:9999/echoJson")
    request.setRequestHeader("Content-Type", "application/json")
    var data = createImageJson(elements)
    console.log(data)
    request.send(data)

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            // var json = JSON.parse(request.response);
            console.log(request.response);
        }
    };
}

function changeImages() {
    let imageElements = getImageElements()
    postImages(imageElements)
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
                updater = setInterval(() => {
                    textElements = getTextElements()
                    changeContent(textElements)
                }, 5 * 1000)
            } else {
                clearInterval(updater)
                restoreContent()
            }
        }
    }
});

setTimeout(() => {
    changeImages()
}, 5 * 1000)