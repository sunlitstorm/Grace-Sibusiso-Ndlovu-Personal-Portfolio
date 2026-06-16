const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
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