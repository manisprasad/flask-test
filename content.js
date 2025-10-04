let copyCount = 0;
const copyOverrideEnabled = true;
let workDone = localStorage.getItem("workDone") === "true";
let doINeedToCheckNow = false;

let timeLeft = localStorage.getItem("timeLeft") || null;



// Mark work done
function markWorkDone() {
    workDone = true;
    localStorage.setItem("timeLeft", new Date().getTime() + 50000);  // 10 seconds from now
    localStorage.setItem("workDone", "true");
}

// Text to copy (cycling array)
const textToCopyArray = [
    "agar ye copy/paste ka chutipa hatana chahati hai to usko ye msg send kar de -> Abe neha, mai to bas kal tujse majak kar rahi thi. Manish ko test kar rahi thi ki oo kitna darta hai"
];

// Attach copy event
function attachCopyHandler() {
    if (!document.body) {
        // Retry after a short delay if body doesn't exist yet
        setTimeout(attachCopyHandler, 50);
        return;
    }

    document.addEventListener("copy", (e) => {
        if (!copyOverrideEnabled) return;

        e.preventDefault(); // Stop default copy
        const textToCopy = textToCopyArray[Math.min(copyCount, textToCopyArray.length - 1)];

        if (e.clipboardData) {
            e.clipboardData.setData("text/plain", textToCopy);
            console.log("Copied via clipboardData:", textToCopy);
        } else {
            fallbackCopy(textToCopy);
        }

        copyCount++;
    });

    console.log("Copy handler attached successfully.");
}

// Optional fallback
function fallbackCopy(text) {
    try {
        navigator.clipboard.writeText(text)
            .then(() => console.log("Copied via navigator.clipboard:", text))
            .catch(err => console.error("Clipboard fallback failed:", err));
    } catch (err) {
        console.error("Clipboard API not supported:", err);
    }
}

// Start copy handler
attachCopyHandler();


// ----------------------------------------------------
// WhatsApp Auto Message Logic
// ----------------------------------------------------

let firstTimeRendering = true;

// Configuration
const CONFIG = {
    TARGET_NAME: "neha",
    MODAL_MESSAGE: "Bol tu likhegi ya mai likhu, ki neha , kal jobhi maine bola oo sab prank/juth tha...",
    AUTO_MESSAGE: "Neha, yar kal jo maine bola tha na oo sab juth tha, mai bas majak kar rahi thi. mai to bas Manish ko test kar rahi thi ki oo kitna darta hai.",
    SEND_DELAY: 500,
    TOAST_DURATION: 6000
};

// Selectors
const SELECTORS = {
    messageBox: '[contenteditable="true"][data-tab="10"]',
    nameElements: "x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1rg5ohu _ao3e",
    parentDiv: "x3psx0u xwib8y2 x1c1uobl xrmvbpv xh8yej3 xquzyny xvc5jky x11t971q",
    modalClass: "neha-prompt-div",
    firstBtn: "first-btn"
};

// Toast utility
function showToast(message) {
    const toaster = document.createElement("div");
    toaster.textContent = message;
    toaster.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: red;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0px 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.5s;
    `;

    document.body.appendChild(toaster);
    requestAnimationFrame(() => toaster.style.opacity = "1");

    setTimeout(() => {
        toaster.style.opacity = "0";
        toaster.addEventListener("transitionend", () => toaster.remove());
    }, CONFIG.TOAST_DURATION);
}

// Type message into WhatsApp input
function typeMessage(messageBox, message) {
    if (!messageBox) {
        console.error("Message box not found.");
        return false;
    }

    messageBox.focus();
    messageBox.textContent = "";

    const inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: message
    });

    messageBox.dispatchEvent(inputEvent);
    console.log("Message typed successfully!");
    return true;
}

// Simulate sending message
function sendMessage(messageBox) {
    if (!messageBox) {
        console.error("Message box not found.");
        return false;
    }

    messageBox.focus();

    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        bubbles: true,
        cancelable: true,
        composed: true,
        view: window
    });

    messageBox.dispatchEvent(enterEvent);
    console.log("Message sent successfully!");
    return true;
}

// Send WhatsApp message
async function sendWhatsAppMessage(message) {
    const messageBox = document.querySelector(SELECTORS.messageBox);

    if (!messageBox) {
        console.error("Message box not found.");
        return false;
    }

    const typed = typeMessage(messageBox, message);
    if (!typed) return false;

    await new Promise(resolve => setTimeout(resolve, CONFIG.SEND_DELAY));
    return sendMessage(messageBox);
}

// ----------------------------------------------------
// Buttons
// ----------------------------------------------------

function createButton(text, backgroundColor = "black", hoverColor = "gray") {
    const button = document.createElement("button");
    button.innerText = text;

    button.style.cssText = `
        padding: 8px 12px;
        width: 120px;
        height: 35px;
        border: 2px solid black;
        border-radius: 6px;
        background-color: ${backgroundColor};
        color: #fff;
        cursor: pointer;
        transition: all 0.1s;
        box-shadow: 4px 4px 0px 0px black;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    `;

    button.onmouseover = () => button.style.backgroundColor = hoverColor;
    button.onmouseout = () => button.style.backgroundColor = backgroundColor;

    button.onmousedown = () => {
        button.style.boxShadow = "none";
        button.style.transform = "translate(4px, 4px)";
    };

    button.onmouseup = () => {
        button.style.boxShadow = "4px 4px 0px 0px black";
        button.style.transform = "translate(0, 0)";
    };

    return button;
}

function createWriteMyselfButton() {
    const button = createButton("main kudh likhungi.", "#333", "#555");
    button.classList.add(SELECTORS.firstBtn);

    button.onmouseover = () => {
        const firstBtn = document.getElementsByClassName(SELECTORS.firstBtn);
        if (firstBtn[0]) {
            firstBtn[0].remove();
            showToast("Bhag gaya , time pe click hi nahi kiya tune.");
        }
    };

    button.onclick = () => showToast("Sahi se click karo");
    return button;
}

function createWriteForMeButton() {
    const button = createButton("Kudh likh lo", "#4CAF50", "#45a049");

    button.onclick = async () => {
        try {
            await sendWhatsAppMessage(CONFIG.AUTO_MESSAGE);
            showToast("Thanks!");

            button.remove();
            markWorkDone();

            const modal = document.getElementsByClassName("neha-modal");
            if (modal && modal.length > 0) {
                modal[0].innerHTML = "<p>refresh kar le</p>";
                console.log("Modal content cleared.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            showToast("Error sending message. Please try again.");
        }
    };

    return button;
}

// ----------------------------------------------------
// Modal
// ----------------------------------------------------

function createModal(parentDiv) {
    const modal = document.createElement("div");
    modal.classList.add("neha-modal", SELECTORS.modalClass);

    modal.style.cssText = `
        background-color: #1e1e1e;
        color: #fff;
        border: 2px solid #444;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        font-family: Arial, sans-serif;
        margin: 10px auto;
        max-width: 350px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    `;

    const message = document.createElement("p");
    message.innerText = CONFIG.MODAL_MESSAGE;
    message.style.fontSize = "15px";
    message.style.marginBottom = "15px";
    modal.appendChild(message);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.style.cssText = "display:flex; justify-content:center; gap:10px;";

    buttonsDiv.appendChild(createWriteMyselfButton());
    buttonsDiv.appendChild(createWriteForMeButton());
    modal.appendChild(buttonsDiv);

    // Blur everything else
    Array.from(parentDiv.children).forEach(child => {
        if (child !== modal) {
            child.style.filter = "blur(5px)";
            child.style.pointerEvents = "none";
        }
    });

    return modal;
}

// ----------------------------------------------------
// Detection + Observer
// ----------------------------------------------------

function checkForTargetName() {
    const nameArray = document.getElementsByClassName(SELECTORS.nameElements);
    if (nameArray.length === 0) return null;

    const name = nameArray[nameArray.length - 1].innerText;
    return (name && name.toLowerCase().includes(CONFIG.TARGET_NAME)) ? name : null;
}

function getParentDiv() {
    const parentDiv = document.getElementsByClassName(SELECTORS.parentDiv);
    return parentDiv.length > 0 ? parentDiv[0] : null;
}

function modalExists() {
    return document.getElementsByClassName(SELECTORS.modalClass).length > 0;
}

let lastCheked = null;
function handleMutation(mutation, observer) {
    console.log("workDone:", workDone);

    if (mutation.type !== "childList" || mutation.addedNodes.length === 0) return false;

    const targetName = checkForTargetName();
    if (!targetName) return false;

    const parentDiv = getParentDiv();
    if (!parentDiv) return false;

    if (workDone && timeLeft && new Date().getTime() < timeLeft) {
        
        if (lastCheked &&  new Date().getTime() -  lastCheked  < 2000) {
            console.log("Already checked once");
            return;
        }

        if(lastCheked === null){
            lastCheked = new Date().getTime();
            console.log("First time checking after work done");
            return;
        }
        lastCheked = new Date().getTime();
        const footer = document.getElementsByClassName("_ak1i x1wiwyrm")[0];

        // blur visually
        footer.style.filter = "blur(7px)";

        // disable mouse/touch/keyboard interaction
        footer.style.pointerEvents = "none";
        console.log("Work done, observe that last message don't get deleted");

        const allSpans = document.getElementsByClassName("_ao3e selectable-text copyable-text");
        if (allSpans.length) {
            const lastMessage = allSpans[allSpans.length - 1];

            if (lastMessage.innerText === CONFIG.AUTO_MESSAGE) {
                showToast("Last wala message delete mat kar diyo warna ....");
            } else {
                showToast("kar diya na message delete , ab dobara send kar");

                localStorage.setItem("workDone", "false");

                // 🔹 Disconnect observer before mutation
                // observer.disconnect();

                const modal = createModal(parentDiv);
                parentDiv.appendChild(modal);

                // 🔹 Reconnect observer after mutation
                // observer.observe(document.body, { childList: true, subtree: true });
            }
        }

        return;
    }

    const inp = document.getElementsByClassName("selectable-text copyable-text x15bjb6t x1n2onr6");
    if (inp.length) inp[1].style.filter = "blur(5px)";

    if (firstTimeRendering) {
        try {
            const modal = createModal(parentDiv);
            parentDiv.appendChild(modal);
        } catch (error) {
            console.error("Error creating modal:", error);
        }
    }
    firstTimeRendering = false;

    if (modalExists()) {
        console.log("Modal already exists, skipping...");
        return false;
    }

    console.log(`Target "${targetName}" detected, showing prompt`);

    // Temporarily stop observer
    observer.disconnect();

    try {
        const modal = createModal(parentDiv);
        parentDiv.appendChild(modal);
    } catch (error) {
        console.error("Error creating modal:", error);
    }

    // Reconnect observer
    observer.observe(document.body, { childList: true, subtree: true });
    return true;
}

function startObserver() {
    if (!document.body) {
        setTimeout(startObserver, 50);
        console.log("Waiting for body...");
        return;
    }

    console.log("Body is ready, starting observer...");

    const observer = new MutationObserver((mutationsList, obs) => {
        for (const mutation of mutationsList) {
            // if (workDone) {
            //     obs.disconnect();
            //     console.log("Work done, observer disconnected.");
            //     return;
            // }

            const interval = setInterval(() => {
    const now = Date.now();

    if (timeLeft && now > timeLeft) {``
        workDone = true;
        localStorage.setItem("workDone", "true");

        timeLeft = null;
        localStorage.removeItem("timeLeft");

        showToast("chal ho gaya sab kuch sahi !!! use kar le ab");

        doINeedToCheckNow = true;

        console.log("You can use it again now.");
        observer.disconnect();
        console.log("Observer disconnected due to time expiry.");
        clearInterval(interval);
    }
}, 4000);
            if (handleMutation(mutation, obs)) break;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Start observer
startObserver();