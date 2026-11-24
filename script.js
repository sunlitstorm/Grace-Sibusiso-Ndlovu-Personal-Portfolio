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

if (speakButton) {
    let isSpeaking = false;
    let speechChunks = [];
    let currentChunk = 0;

    function getPageText() {
        const selection = window.getSelection().toString().trim();

        if (selection) {
            return selection;
        }

        const elements = Array.from(
            document.querySelectorAll(".braille-text")
        ).filter(el => !el.parentElement.closest(".braille-text"));

        return elements.map(el => {
            if (el.dataset.original) {
                const temp = document.createElement("div");
                temp.innerHTML = el.dataset.original;
                return temp.textContent;
            }
            return el.textContent;
        }).join(". ").replace(/\s+/g, " ").trim();
    }

    function stopReading() {
        isSpeaking = false;
        window.speechSynthesis.cancel();
        speechChunks = [];
        currentChunk = 0;
        speakButton.textContent = "Read Page";
    }

    function speakNext() {
        if (!isSpeaking) return;

        if (currentChunk >= speechChunks.length) {
            stopReading();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(
            speechChunks[currentChunk]
        );

        utterance.lang = "en-US";
        utterance.rate = 1;

        utterance.onend = () => {
            currentChunk++;
            speakNext();
        };

        utterance.onerror = (event) => {
            if (event.error !== "canceled" &&
                event.error !== "interrupted") {
                console.error("Speech error:", event.error);
                stopReading();
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    speakButton.addEventListener("click", () => {

        if (!("speechSynthesis" in window)) {
            alert("Your browser does not support text-to-speech.");
            return;
        }

        if (isSpeaking) {
            stopReading();
            return;
        }

        const text = getPageText();

        if (!text) {
            console.log("No page text found.");
            return;
        }

        // Break long text into smaller chunks.
        speechChunks = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

        currentChunk = 0;
        isSpeaking = true;

        speakButton.textContent = "Stop Reading";

        window.speechSynthesis.cancel();
        speakNext();
    });
}