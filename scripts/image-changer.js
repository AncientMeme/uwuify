/* Store image data */
var isActive = false;
const imagesPath = "images/"
const imageCount = 12;
var imageCache = [];

/* Image randomizer settings */
const noRepeats = 6;
const lastIndexes = Array(noRepeats);

/* Get user settings */
chrome.storage.sync.get(["active"]).then((data)=>{
    isActive = data.active;
    changeImages();
})

/* Track if the plugin is active */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request && request.msg == "toggled") {
        isActive = request.data;
        isActive? changeImages() : restoreImages();
    }
});


/*
 * Get access to all images on the website
 */
function getImageElements() {
    let domElements = document.querySelectorAll("*");
    let imageElements = Array.from(domElements).filter(isImage);
    return imageElements;
}

function isImage(element) {
    const style = getComputedStyle(element);
    // Disregard hidden elements and images that are too small.
    if(style.display === 'none' || element.width < 64 || element.height < 64) {
        return false;
    }
    // Disregard if the image has no src tag or no link
    if (!element.getAttribute('src') || element.getAttribute('src') === "") {
        return false;
    }
    return element.tagName == "IMG";
}

function changeImages() {
    if (!isActive) {
       return;
    }

    let images = getImageElements();
    images.forEach((element) => {
        if (!element.classList.contains("marked")) {
            imageCache.push([element, element.src, element.srcset]);
            element.classList.add("marked");
        }

        if (!element.classList.contains("changed")) {
            /* fetch url for image */
            let url = getImageURL();
            element.src = url;
            element.srcset = getModifySrcset(element, url);
            element.classList.add("changed");
        }
    });

    setTimeout(changeImages, 3 * 1000);
}

function restoreImages() {
    for (image of imageCache) {
        image[0].src = image[1];
        image[0].srcset = image[2];
        image[0].classList.remove("changed");
    }
}

function getImageURL() {
    // Randomize image index, also prevent frequent repeats
    let imageIndex = -1;
    while (lastIndexes.includes(imageIndex) || imageIndex < 0) {
        imageIndex = 1 + Math.floor(Math.random() * imageCount);
    }
    lastIndexes.shift();
    lastIndexes.push(imageIndex);

    // Output the url of chosen image
    (imageIndex < 10)? imageIndex = "0" + imageIndex.toString() : imageIndex = imageIndex.toString()
    return chrome.runtime.getURL(`${imagesPath}cat-${imageIndex}.png`);
}

/* Due to srcset containing multiple url, we cannot directly set it */
function getModifySrcset(element, url) {
    let srcset = element.srcset;
    let newSrcset = "";
    let data = srcset.split(/(?:\s|,)/);

    // even entries are urls
    for (let i = 0; i < data.length; ++i) {
        if (i % 2 == 0) {
            data[i] = url;
        }

        newSrcset += (i % 2 == 0)? data[i] + " ": data[i] + ",";
    }

    return newSrcset;
}