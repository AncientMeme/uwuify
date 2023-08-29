const wave_radius = 5;
const faces = ["(*´▽`*)", "⸜(｡˃ ᵕ ˂ )⸝♡", "o(*>ω<*)o", "( ˶ˆᗜˆ˵ )", "◝(ᵔᵕᵔ)◜"];

/* Keep track of emoticon status */
var isActive = true;
var emoticons = [];
var used_faces = []
setupEmoticon();

/* Get user settings */
chrome.storage.sync.get(["active"]).then((data)=>{
    isActive = data.active;
    toggleEmoticon();
    emoticonAnimation();
})

/* Track if the plugin is active */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request && request.msg == "toggled") {
        isActive = request.data;
        toggleEmoticon();
        emoticonAnimation();
    }
});

function setupEmoticon() {
    createEmoticon(6, 10, 0, -10, randomEmoticon()); // top left
    createEmoticon(78, 80, 180, 10, randomEmoticon()); // bottom right
}


function randomEmoticon() {
    let index = -1;
    while (index < 0 || used_faces.includes(index)) {
        index = Math.floor(Math.random() * faces.length);
    }
    used_faces.push(index);
    return faces[index];
}

function createEmoticon(left, top, angle, rotation, text) {
    let emoticon = document.createElement("div");
    emoticon.classList.add("uwu-ignore");
    emoticon.style.display = "none";
    emoticon.style.transform = `rotate(${rotation}deg)`;
    emoticon.style.fontSize = "54px";
    emoticon.style.position = "fixed";
    emoticon.style.left = left.toString() + "vw";
    emoticon.style.top = top.toString() + "vh";
    emoticon.style.zIndex = "999999";
    emoticon.textContent = text;
    emoticons.push([emoticon, top, angle]);
    console.log("Added Emoticon");

    let body = document.getElementsByTagName("body")[0];
    body.insertBefore(emoticon, body.firstChild);   
}

function toggleEmoticon() {
    for (emoticon of emoticons) {
        emoticon[0].style.display = isActive? "block" : "none";
    }
}

function emoticonAnimation() {
    if (isActive) {
        for (emoticon of emoticons) {
            let top = emoticon[1];
            let angle = emoticon[2] * Math.PI / 180; // sin uses radians
            emoticon[0].style.top = (top + wave_radius * Math.sin(angle)).toString() + "vh";
            emoticon[2] = (emoticon[2] + 3) % 360;
        }
        setTimeout(emoticonAnimation, 33); // 30fps
    }
}