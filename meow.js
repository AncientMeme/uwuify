/* 
 * Track if the plugin is active 
 */
var uwuify = true
var face = document.getElementById("uwu-face")
var textBox = document.getElementById("uwu-dialogue")
var toggle = document.getElementById("uwu-toggle")

toggle.addEventListener("click", function(e) {
    uwuify = !uwuify
    if (uwuify) {
        uwuMode()
    } else {
        boringMode()
    } 
})

function boringMode() {
    face.textContent = "/(0n0)\\"
    textBox.innerHTML = "*sobbing*<br>Hooman wants boring website :("
    toggle.textContent = "o Yes to UwU o"

    textBox.classList.add("no-uwu")
    toggle.classList.remove("no-uwu")
}

function uwuMode() {
    face.textContent = "o(UwU)o"
    textBox.innerHTML = "*nuzzles*<br>*changes your website cutely*"
    toggle.textContent = "no UwU"

    textBox.classList.remove("no-uwu")
    toggle.classList.add("no-uwu")

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage({}, {msg: "Button clicked", data: uwuify}, (response) => {
            if (response) {}
    })
}