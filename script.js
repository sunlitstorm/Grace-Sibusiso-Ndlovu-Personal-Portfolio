const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    toggle.textContent = "Light mode";
  } else {
    toggle.textContent = "Dark mode";
  }
});
const brailleButton = document.getElementById("brailleToggle");

let brailleMode = false;

// Store original text
document.querySelectorAll(".braille-text, button, a").forEach(el => {
    el.dataset.original = el.innerHTML;
});

const brailleMap = {
    // Letters
    a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑",
    f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
    k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕",
    p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
    u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽",
    z: "⠵",

    // Numbers
    "1": "⠼⠁",
    "2": "⠼⠃",
    "3": "⠼⠉",
    "4": "⠼⠙",
    "5": "⠼⠑",
    "6": "⠼⠋",
    "7": "⠼⠛",
    "8": "⠼⠓",
    "9": "⠼⠊",
    "0": "⠼⠚",

    // Punctuation
    ".": "⠲",
    ",": "⠂",
    "!": "⠖",
    "?": "⠦",
    ":": "⠒",
    ";": "⠆",
    "-": "⠤",
    "'": "⠄",
    "\"": "⠶",
    "&":"⠯",
    "(": "⠶",
    ")": "⠶",
    "/": "⠌",
    

    // Space
    " ": " "
};

function translateNode(node) {

    if (node.nodeType === Node.TEXT_NODE) {

        if (!node.parentElement.dataset.originalText) {
            node.parentElement.dataset.originalText = node.textContent;
        }
        node.textContent = textToBraille(node.parentElement.dataset.originalText);
        return;
    }
    node.childNodes.forEach(child => translateNode(child));
}

function textToBraille(text) {
    return text
        .toLowerCase()
        .split("")
        .map(char => brailleMap[char] || char)
        .join("");
}
function translatePage() {

    document.querySelectorAll(".braille-text, button, a").forEach(el => {

        el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = textToBraille(node.textContent);
            }
        });
    });
}

function restorePage() {

    document.querySelectorAll(".braille-text, button, a").forEach(el => {
        el.innerHTML = el.dataset.original;
    });
}

brailleButton.addEventListener("click", () => {

    brailleMode = !brailleMode;
    document.body.classList.toggle("braille-mode");

    if (brailleMode) {
        translatePage();
        brailleButton.textContent = "English View";
        brailleButton.setAttribute("aria-pressed", "true");
    } else {
        restorePage();
        brailleButton.textContent = "Braille View";
        brailleButton.setAttribute("aria-pressed", "false");
    }
    updateModeText();

});

const indicator = document.getElementById("modeIndicator");

function updateModeText() {
    indicator.textContent = brailleMode
        ? "Braille Mode Active"
        : "English Mode Active";
}


//Age function

const birthDate = new Date(2005, 5, 12);

function calculateAge() {
  const now = new Date();
  return (now - birthDate) / (1000 * 60 * 60 * 24 * 365.2425);
}

function updateAge() {
  const ageEl = document.getElementById("age");

  if (!ageEl) {
    console.log("AGE ELEMENT NOT FOUND");
    return;
  }

  const age = calculateAge();

  console.log("live age:", age);

  ageEl.textContent = age.toFixed(10);
}

updateAge();
setInterval(updateAge, 1000);



let isSpeaking = false;
let utterance;

const speakButton = document.getElementById("speakButton");

speakButton.addEventListener("click", () => {

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        speakButton.textContent = "🔊 Read Page";
        return;
    }

    const text = document.body.innerText;
    utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => {
        isSpeaking = false;
        speakButton.textContent = "🔊 Read Page";
    };

    window.speechSynthesis.speak(utterance);

    isSpeaking = true;
    speakButton.textContent = "⏹ Stop";
});