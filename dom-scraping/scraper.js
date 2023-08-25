
function get_elements() {

}

function get_images() {
    images = []
    return images
}

// Get all content containers
function bfs() {
    let body = document.querySelector("body")
    if (!body) {
        return
    }

    let queue = [body]
    let output = [body]
    while (queue) {
        let element = queue.pop()
        console.log(element)
        let children = element.children
        for (child of children) {
            queue.push(child)
            output.push(child)
        }
    }

    return output
}

bfs()