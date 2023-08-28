/* Text for Interface */
const interfaceText = {"off": {
                        "face": "(:()", 
                        "textbox": "*sobbing*<br>Hooman wants boring website :(",
                        "button": "o Yes to UwU o"
                       },
                       "on": {
                        "face": "o(UwU)o", 
                        "textbox": "*nuzzles*<br>*changes your website cutely*",
                        "button": "no UwU"
                       }}

/* Track if the plugin is active */
var uwuify = true;
var face = document.getElementById("uwu-face");
var textBox = document.getElementById("uwu-dialogue");
var button = document.getElementById("uwu-toggle");

/* Track button toggle */
button.addEventListener("click", function(e) {
    uwuify = !uwuify;
    togglePlugin();
})

function togglePlugin() {
    chrome.storage.sync.set({"active": uwuify});
    sendToScraper();
    chnageInterface();
}

function chnageInterface() {
    let currentText = interfaceText[uwuify? "on" : "off"];
    face.textContent = currentText["face"];
    textBox.innerHTML = currentText["textbox"];
    button.textContent = currentText["button"];

    if (uwuify) {
        textBox.classList.remove("no-uwu");
        button.classList.add("no-uwu");
    } else {
        textBox.classList.add("no-uwu");
        button.classList.remove("no-uwu");
    }
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