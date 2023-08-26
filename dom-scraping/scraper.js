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

function changeTextElements() {
    let textElements = getTextElements()
    changeContent(textElements)
}

function changeContent(textElements) {
    for (element of textElements) {
        if (!element.classList.contains("UwU")) {
            element.textContent = "UwU " + element.textContent
            element.classList.add("UwU")
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

function changeImages() {
    let imageElements = getImageElements()
    console.log(imageElements)
}


// Update Every 5 seconds
var updater = setInterval(() => {
    changeImages()
}, 5 * 1000)
