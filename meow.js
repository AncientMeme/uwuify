/* 
 * Track if the plugin is active 
 */
var uwuify = true
var face = document.getElementById("uwu-face")
var textBox = document.getElementById("uwu-dialogue")
var toggle = document.getElementById("uwu-toggle")

/* Track button toggle */
toggle.addEventListener("click", function(e) {
    uwuify = !uwuify
    togglePlugin()
})

function togglePlugin() {
    if (uwuify) {
        uwuMode()
    } else {
        boringMode()
    } 
    sendToScraper()
    chrome.storage.sync.set({"active": uwuify})
}

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
    
}

/* Update the scraper if the plugin is active */
function sendToScraper() {
    chrome.tabs.query({}, (tabs) => {
        for (var i=0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, {msg: "toggled", data: uwuify})
        }
    })
}

/* Get user settings */
chrome.storage.sync.get(["active"], function(data) {
    uwuify = data.active
    togglePlugin()
})