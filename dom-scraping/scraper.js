/* Keep track of data */
var isActive = true
var updater = null
var textCache = []
var imageCache = []

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
    // Disregard if the image has no src tag
    if (!element.getAttribute('src') || element.getAttribute('src') === "") {
        return false
    }
    return element.tagName == "IMG"
}

function isNewImage(element) {
    return element.classList.contains("requested") == false
}

function createImageJson(elements) {
    var obj = new Object()
    console.log(elements)
    obj.urls = []
    for (element of elements) {
        if (!element.classList.contains("requested")) {
            obj.urls.push(element.src)
        }
    }
    return JSON.stringify(obj)
}

function postImages(elements) {
    // send packets for new images
    var request = new XMLHttpRequest()
    request.open("POST", "https://wenjunblog.xyz/echoJson")
    request.setRequestHeader("Content-Type", "application/json")

    let newImages = Array.from(elements).filter(isNewImage)
    let data = createImageJson(newImages)
    request.send(data)

    // Receive response
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            let json = JSON.parse(request.response)
            console.log("Got packet", json)
            mapImages(json)
        }
    };
}

function mapImages(json) {
    let images = getImageElements()
    for (image of images) {
        if (!element.classList.contains("requested") && image.getAttribute('src') in json.urls) {
            let newImage = json.urls[image.getAttribute('src')]
            imageCache.push([image, image.getAttribute('src'), newImage])
            element.classList.add("requested")
        }
    }
    console.log("Image Cache:",imageCache)
}


function changeImages(elements, json) {
    var images = json.urls // Dict
    console.log(json.urls)
    for (let i = 0; i < elements.length; ++i) {
        elements[i].src = images[i]
        elements[i].srcset = images[i]
        elements[i].classList.add("has-cat")
    }
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

setInterval(() => {
    let imageElements = getImageElements()
    postImages(imageElements)
}, 3 * 1000)