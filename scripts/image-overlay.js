
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
    console.log("new images:", newImages.length)
    if (newImages.length > 0) {
        let data = createImageJson(newImages)
        request.send(data)

        // Receive response
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                let json = JSON.parse(request.response)
                console.log("Got packet", json)
                mapImages(json)
            }
        }
    }
}

function mapImages(json) {
    let images = getImageElements()
    for (image of images) {
        if (!image.classList.contains("requested") && image.getAttribute('src') in json.urls) {
            let newImage = json.urls[image.getAttribute('src')]
            imageCache.push([image, image.getAttribute('src'), newImage])
            image.classList.add("requested")
        }
    }
    console.log("Image Cache:",imageCache)
}

function changeImages() {
    console.log("change image owo")
    if (isActive) {
        for (image of imageCache) {
            if (!image[0].classList.contains("has-cat")) {
                image[0].src = image[2]
                image[0].srcset = image[2]
                image[0].classList.add("has-cat")
            }
        }

        setTimeout(() => {changeImages()}, 3 * 1000)
    }
}

function restoreImages() {
    for (image of imageCache) {
        if (image[0].classList.contains("has-cat")) {
            image[0].src = image[1]
            image[0].srcset = image[1]
            image[0].classList.remove("has-cat")
        }
    }
}

// setInterval(() => {
//     let imageElements = getImageElements()
//     postImages(imageElements)
// }, 3 * 1000)