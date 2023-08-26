// Data to store
var textElements = []
var images = []

// Setup DOM observer
// const obs_config = {childList: true, subtree: true}
// const callback = (mutations, observer) => {
//     clearTimeout(time_id)
//     time_id = setTimeout(() => {
//         elements = bfs()
//         images = getImages(elements)
//         console.log(images)
//     }, 3 * 1000)
// }
// const observer = new MutationObserver(callback);
// observer.observe(body, obs_config);

// Get images from elements
function getImages(elements) {
    images = []
    for (element of elements) {
        if (element.tagName === "IMG") {
            images.push(element)
        }
    }
    return images
}

// Get all text containers
function getTextElements() {
    let domElements = document.querySelectorAll("*")
    let textElements = Array.from(domElements).filter(containText)
    return textElements
}

function containText(element) {
    const style = getComputedStyle(element);
    // check if display none, of if one of the height/width elements is < 0 then it wouldn't be visible, so count as hidden.
    if(style.display === 'none' || style.width <= 0 || style.height <= 0) {
        return false
    }
    // check if the element has a text node, if so, make sure it's not just whitespace.
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

// Change text content
function changeText(textElements) {
    for (element of textElements) {
        if (!element.classList.contains("UwU")) {
            element.textContent = "UwU " + element.textContent
            element.classList.add("UwU")
        }
    }
}

textElements = getTextElements()
changeText(textElements)

// Update Every 5 seconds
var updater = setInterval(() => {
    textElements = getTextElements()
    changeText(textElements)
}, 5 * 1000)