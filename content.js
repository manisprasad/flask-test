let copyCount = 0;
const copyOverrideEnabled = true;
let workDone = localStorage.getItem("workDone") === "true";
let resetTimestamp = localStorage.getItem("resetTimestamp");
let isReset = localStorage.getItem("isReset") === "true";

// Check if 5 minutes have passed since work was done
function checkAndResetTimer() {
    if (resetTimestamp) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(resetTimestamp);
        const fiveMinutes = 5 * 60 * 1000;

        if (elapsedTime >= fiveMinutes) {
            // Reset everything
            localStorage.removeItem("workDone");
            localStorage.removeItem("resetTimestamp");
            workDone = false;
            resetTimestamp = null;
            localStorage.setItem("isReset", "true");


            // Remove all blurs and restore normal functionality
            restoreNormalWhatsApp();
            showToast("⏰ Timer expired! WhatsApp is back to normal.", "#4CAF50");
            return true;
        }
    }
    return false;
}

// Restore WhatsApp to normal state with smooth animation
function restoreNormalWhatsApp() {
    // Smoothly remove all blurs
    document.querySelectorAll('[style*="blur"]').forEach(el => {
        el.style.transition = "filter 0.5s ease, opacity 0.5s ease";
        el.style.filter = "";
        el.style.pointerEvents = "";
        el.style.opacity = "1";
    });

    // Remove modal with fade-out animation
    const modal = document.querySelector("." + SELECTORS.modalClass);
    if (modal) {
        modal.style.animation = "slideOutUp 0.5s ease";
        setTimeout(() => modal.remove(), 500);
    }

    // Remove blur from footer
    const footer = document.querySelector("._ak1i.x1wiwyrm");
    if (footer) {
        footer.style.transition = "filter 0.5s ease";
        footer.style.filter = "";
        footer.style.pointerEvents = "";
    }

    // Remove countdown toast
    const countdownToast = document.getElementById("countdown-toast");
    if (countdownToast) {
        countdownToast.style.animation = "slideOutRight 0.5s ease";
        setTimeout(() => countdownToast.remove(), 500);
    }

    showToast("bahut badiya, just one refresh and everything will be back to normal", "green");
    setTimeout(() => {
        window.location.reload();
    }, 3000);
}

// Mark work done and start timer
function markWorkDone() {
    workDone = true;
    const timestamp = Date.now();
    localStorage.setItem("workDone", "true");
    localStorage.setItem("resetTimestamp", timestamp.toString());
    resetTimestamp = timestamp.toString();

    // Celebrate with confetti effect
    createConfetti();

    // Show countdown toast
    showCountdownToast();
}

// Confetti celebration effect
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation styles
function addAnimationStyles() {
    if (document.getElementById('whatsapp-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'whatsapp-animation-styles';
    style.textContent = `
        @keyframes confettiFall {
            to {
                top: 100vh;
                opacity: 0;
                transform: rotate(${Math.random() * 720}deg);
            }
        }
        
        @keyframes slideInDown {
            from {
                transform: translate(-50%, -100%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
        }
        
        @keyframes slideOutUp {
            from {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -150%);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes glow {
            0%, 100% {
                box-shadow: 0 0 5px rgba(76, 175, 80, 0.5), 0 0 10px rgba(76, 175, 80, 0.3);
            }
            50% {
                box-shadow: 0 0 20px rgba(76, 175, 80, 0.8), 0 0 30px rgba(76, 175, 80, 0.6);
            }
        }
        
        @keyframes typing {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced countdown toast with progress bar
function showCountdownToast() {
    if (!document.body) {
        setTimeout(showCountdownToast, 100);
        return;
    }

    const existingToast = document.getElementById("countdown-toast");
    if (existingToast) existingToast.remove();

    const toaster = document.createElement("div");
    toaster.id = "countdown-toast";
    toaster.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: pink;
        color: black;
        padding: 7px 15px;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 16px;
        animation: slideInRight 0.5s ease, glow 2s ease-in-out infinite;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.2);
        min-width: 200px;
    `;

    const timeDisplay = document.createElement('div');
    timeDisplay.style.cssText = `
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 8px;
        font-family: 'Courier New', monospace;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        width: 100%;
        height: 6px;
        background: rgba(255,255,255,0.3);
        border-radius: 3px;
        overflow: hidden;
        margin-top: 8px;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        background: linear-gradient(90deg, #00ff88, #00cc66);
        border-radius: 3px;
        transition: width 0.3s ease;
    `;
    progressBar.appendChild(progressFill);

    toaster.appendChild(timeDisplay);
    toaster.appendChild(progressBar);
    document.body.appendChild(toaster);

    const interval = setInterval(() => {
        if (!resetTimestamp) {
            clearInterval(interval);
            toaster.style.animation = "slideOutRight 0.5s ease";
            setTimeout(() => toaster.remove(), 500);
            return;
        }

        const currentTime = Date.now();
        const elapsedTime = currentTime - parseInt(resetTimestamp);
        const fiveMinutes = 5 * 60 * 1000;
        const remainingTime = fiveMinutes - elapsedTime;

        if (remainingTime <= 0 || checkAndResetTimer()) {
            clearInterval(interval);
            toaster.style.animation = "slideOutRight 0.5s ease";
            setTimeout(() => toaster.remove(), 500);
            return;
        }

        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        timeDisplay.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;

        const progress = (remainingTime / fiveMinutes) * 100;
        progressFill.style.width = `${progress}%`;

        if (remainingTime < 30000) {
            toaster.style.background = "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)";
            if (remainingTime % 2000 < 1000) {
                toaster.style.animation = "shake 0.5s ease, glow 2s ease-in-out infinite";
            }
        }
    }, 1000);
}

// Text to copy (cycling array)
const textToCopyArray = [
    "waise tune galat kiya kal, [ek baar aur copy/paste kar]",
    "ab oo kya sochegi meri baare me , kis muh se baat karu ab usse.",
    "beta agar usne bahiya ko bata diya na, phir...",
    "Yar, Kanishka usko tu ye bol de ki ye sab juth tha. PLEASEEE...!!! 🙏",
    "agar ye copy/paste ka chutipa hatana chahati hai to usko ye msg send kar de -> Abe neha, mai to bas kal tujse majak kar rahi thi. Manish ko test kar rahi thi ki oo kitna darta hai"
];

document.addEventListener("copy", (e) => {
    if (!copyOverrideEnabled) return;

    e.preventDefault();
    const textToCopy = textToCopyArray[Math.min(copyCount, textToCopyArray.length - 1)];

    if (e.clipboardData) {
        e.clipboardData.setData("text/plain", textToCopy);
    } else {
        navigator.clipboard.writeText(textToCopy).catch(err => console.error("Clipboard failed:", err));
    }

    copyCount++;
    showToast("📋 Text copied!", "#9b59b6");
});

// Configuration
const CONFIG = {
    TARGET_NAME: "neha",
    MODAL_MESSAGE: "Bol tu likhegi ya mai likhu, ki neha , uss din maine jo bola tha na oo sab juth/prank tha.",
    AUTO_MESSAGE: "Neha, yar uss din jo maine bola tha na oo sab juth tha, mai bas majak kar rahi thi. mai to bas Manish ko test kar rahi thi ki oo kitna darta hai.",
    SEND_DELAY: 500,
    TOAST_DURATION: 4000,
    DEBOUNCE_DELAY: 300
};

const SELECTORS = {
    messageBox: '[contenteditable="true"][data-tab="10"]',
    nameElements: "x1iyjqo2 x6ikm8r x10wlt62 x1n2onr6 xlyipyv xuxw1ft x1rg5ohu _ao3e",
    parentDiv: "x3psx0u xwib8y2 x1c1uobl xrmvbpv xh8yej3 xquzyny xvc5jky x11t971q",
    modalClass: "neha-prompt-div"
};

// Enhanced toast with icons and animations
function showToast(message, backgroundColor = "#e74c3c") {
    const toaster = document.createElement("div");
    toaster.innerHTML = message;
    toaster.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: ${backgroundColor};
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        z-index: 10000;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.2);
        font-weight: 500;
    `;

    document.body.appendChild(toaster);

    requestAnimationFrame(() => {
        toaster.style.opacity = "1";
        toaster.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
        toaster.style.opacity = "0";
        toaster.style.transform = "translateX(-50%) translateY(-100px)";
        setTimeout(() => toaster.remove(), 500);
    }, CONFIG.TOAST_DURATION);
}

// Human-like typing with more realistic patterns
function getRandomDelay(min = 300, max = 500) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTypo(char) {
    const keyboard = {
        'a': ['s', 'q', 'z'], 'b': ['v', 'g', 'n'], 'c': ['x', 'd', 'v'],
        'd': ['s', 'f', 'e', 'c'], 'e': ['w', 'r', 'd'], 'f': ['d', 'g', 'r', 'v'],
        'g': ['f', 'h', 't', 'b'], 'h': ['g', 'j', 'y', 'n'], 'i': ['u', 'o', 'k'],
        'j': ['h', 'k', 'u', 'm'], 'k': ['j', 'l', 'i', 'm'], 'l': ['k', 'o'],
        'm': ['n', 'j', 'k'], 'n': ['b', 'm', 'h', 'j'], 'o': ['i', 'p', 'l'],
        'p': ['o', 'l'], 'q': ['w', 'a'], 'r': ['e', 't', 'f'],
        's': ['a', 'd', 'w', 'z'], 't': ['r', 'y', 'g'], 'u': ['y', 'i', 'j'],
        'v': ['c', 'f', 'b'], 'w': ['q', 'e', 's'], 'x': ['z', 'c', 's'],
        'y': ['t', 'u', 'h'], 'z': ['a', 's', 'x']
    };

    const lowerChar = char.toLowerCase();
    if (keyboard[lowerChar]?.length > 0) {
        return keyboard[lowerChar][Math.floor(Math.random() * keyboard[lowerChar].length)];
    }
    return char;
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        z-index: 9999;
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    indicator.innerHTML = `
        <span>✍️ Typing</span>
        <div style="display: flex; gap: 4px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; animation: typing 1.4s ease-in-out infinite;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; animation: typing 1.4s ease-in-out 0.2s infinite;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; animation: typing 1.4s ease-in-out 0.4s infinite;"></div>
        </div>
    `;

    document.body.appendChild(indicator);
    return indicator;
}

async function typeMessageHumanLike(messageBox, message) {
    if (!messageBox) return false;

    const typingIndicator = showTypingIndicator();
    messageBox.focus();

    messageBox.innerHTML = "";
    messageBox.textContent = "";

    const clearEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "deleteContentBackward"
    });
    messageBox.dispatchEvent(clearEvent);

    await new Promise(resolve => setTimeout(resolve, 100));

    const words = message.split(' ');

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const shouldMakeTypo = Math.random() < 0.7;
        const typoPosition = shouldMakeTypo ? Math.floor(Math.random() * word.length) : -1;

        for (let j = 0; j < word.length; j++) {
            const char = word[j];

            if (j === typoPosition) {
                const typoChar = getRandomTypo(char);
                const typoRange = document.createRange();
                const typoSel = window.getSelection();
                typoRange.selectNodeContents(messageBox);
                typoRange.collapse(false);
                typoSel.removeAllRanges();
                typoSel.addRange(typoRange);

                document.execCommand('insertText', false, typoChar);
                await new Promise(resolve => setTimeout(resolve, getRandomDelay(80, 180)));

                document.execCommand('delete', false, null);
                await new Promise(resolve => setTimeout(resolve, getRandomDelay(60, 120)));
            }

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(messageBox);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);

            document.execCommand('insertText', false, char);
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(50, 150)));
        }

        if (i < words.length - 1) {
            const spaceRange = document.createRange();
            const spaceSel = window.getSelection();
            spaceRange.selectNodeContents(messageBox);
            spaceRange.collapse(false);
            spaceSel.removeAllRanges();
            spaceSel.addRange(spaceRange);

            document.execCommand('insertText', false, ' ');
            await new Promise(resolve => setTimeout(resolve, getRandomDelay(100, 250)));
        }
    }

    typingIndicator.remove();
    return true;
}

async function sendWhatsAppMessage(message) {
    const messageBox = document.querySelector(SELECTORS.messageBox);
    if (!messageBox) {
        console.error("Message box not found");
        return false;
    }

    console.log("Starting to type message...");
    const typed = await typeMessageHumanLike(messageBox, message);
    if (!typed) {
        console.error("Typing failed");
        return false;
    }

    console.log("Message typed, waiting before sending...");
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(300, 600)));

    console.log("Attempting to send message...");
    messageBox.focus();

    const enterEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
    });

    messageBox.dispatchEvent(enterEvent);
    console.log("Message sent!");
    return true;
}

// Enhanced buttons with better animations
function createButton(text, backgroundColor = "black", hoverColor = "gray", emoji = "") {
    const button = document.createElement("button");
    button.innerHTML = `${emoji} ${text}`;

    button.style.cssText = `
        padding: 12px 20px;
        min-width: 150px;
        height: 45px;
        border: 3px solid #333;
        border-radius: 12px;
        background: ${backgroundColor};
        color: #fff;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 6px 0 #333, 0 8px 20px rgba(0,0,0,0.3);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 600;
        font-family: 'Segoe UI', Arial, sans-serif;
    `;

    button.onmouseover = () => {
        button.style.background = hoverColor;
        button.style.transform = "translateY(-2px)";
        button.style.boxShadow = "0 8px 0 #333, 0 12px 25px rgba(0,0,0,0.4)";
    };

    button.onmouseout = () => {
        button.style.background = backgroundColor;
        button.style.transform = "translateY(0)";
        button.style.boxShadow = "0 6px 0 #333, 0 8px 20px rgba(0,0,0,0.3)";
    };

    button.onmousedown = () => {
        button.style.boxShadow = "0 0 0 #333";
        button.style.transform = "translateY(6px)";
    };

    button.onmouseup = () => {
        button.style.boxShadow = "0 6px 0 #333, 0 8px 20px rgba(0,0,0,0.3)";
        button.style.transform = "translateY(0)";
    };

    return button;
}

function createWriteMyselfButton() {
    const button = createButton("main kudh likhungi", "#e74c3c", "#c0392b", "✍️");

    button.onmouseover = () => {
        button.style.animation = "shake 0.5s ease";
        setTimeout(() => {
            button.style.opacity = "0";
            button.style.transform = "scale(0) rotate(180deg)";
            setTimeout(() => {
                button.remove();
                showToast("😅 Bhag gaya, time pe click hi nahi kiya tune!", "#e74c3c");
            }, 300);
        }, 100);
    };

    return button;
}
let isTyping = false;
function createWriteForMeButton() {
    const button = createButton("Kudh likh lo", "#27ae60", "#229954", "🤖");

    button.onclick = async () => {
        try {
            isTyping = true;
            button.disabled = true;
            button.innerHTML = "⏳ Typing...";
            button.style.opacity = "0.6";
            button.style.animation = "pulse 1s ease infinite";
            const modal = document.querySelector("." + SELECTORS.modalClass);
            modal.remove();

            const success = await sendWhatsAppMessage(CONFIG.AUTO_MESSAGE);

            if (success) {
                button.style.background = "#27ae60";
                button.innerHTML = "✅ Done!";
                button.style.animation = "none";
                showToast("🎉 Thanks! Message sent successfully!", "#27ae60");

                setTimeout(() => {
                    button.style.transform = "scale(0)";
                    button.style.opacity = "0";
                    setTimeout(() => button.remove(), 300);
                }, 1000);

                markWorkDone();

                const modal = document.querySelector("." + SELECTORS.modalClass);
                if (modal) {
                    modal.style.animation = "slideOutUp 0.5s ease";
                    setTimeout(() => {
                        modal.innerHTML = "<p style='font-size: 20px;'>🔄 Refresh kar le</p>";
                        modal.remove();
                    }, 500);
                }
            } else {
                button.disabled = false;
                button.innerHTML = "🤖 Kudh likh lo";
                button.style.opacity = "1";
                button.style.animation = "shake 0.5s ease";
                showToast("❌ Failed! Try again.", "#e74c3c");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            button.disabled = false;
            button.innerHTML = "🤖 Kudh likh lo";
            button.style.opacity = "1";
            button.style.animation = "shake 0.5s ease";
            showToast("⚠️ Error sending message. Please try again.", "#e74c3c");
        }
        isTyping = false;
    };

    return button;
}

// Enhanced modal with glassmorphism effect
function createModal(parentDiv) {
    const modal = document.createElement("div");
    modal.classList.add("neha-modal", SELECTORS.modalClass);

    modal.style.cssText = `
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
        backdrop-filter: blur(20px);
        color: #fff;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 30px;
        text-align: center;
        font-family: 'Segoe UI', Arial, sans-serif;
        margin: 10px auto;
        max-width: 500px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        width: 600px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
        animation: slideInDown 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    const message = document.createElement("p");
    message.innerText = CONFIG.MODAL_MESSAGE;
    message.style.cssText = `
        font-size: 17px;
        margin-bottom: 25px;
        line-height: 1.6;
        color: #e0e0e0;
    `;
    modal.appendChild(message);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.style.cssText = "display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;";

    buttonsDiv.appendChild(createWriteMyselfButton());
    buttonsDiv.appendChild(createWriteForMeButton());
    modal.appendChild(buttonsDiv);

    return modal;
}

// Detection + Observer
function checkForTargetName() {
    const nameElements = document.getElementsByClassName(SELECTORS.nameElements);
    if (nameElements.length === 0) return null;

    const name = nameElements[nameElements.length - 1].innerText;
    return (name && name.toLowerCase().includes(CONFIG.TARGET_NAME)) ? name : null;
}

function getParentDiv() {
    const parentDiv = document.getElementsByClassName(SELECTORS.parentDiv);
    return parentDiv.length > 0 ? parentDiv[0] : null;
}

function modalExists() {
    return document.querySelector("." + SELECTORS.modalClass) !== null;
}

let lastChecked = null;
let debounceTimer = null;
let lastWalaMessageShown = false;
let prevName = null;

function handleMutation() {
    if (checkAndResetTimer()) return;

    if (isReset) return;

    if (isTyping) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const parentDiv = getParentDiv();
        if (!parentDiv) return;

        const targetName = checkForTargetName();
        if (!targetName) {
            const nameElements = document.getElementsByClassName(SELECTORS.nameElements);
            if (nameElements.length === 0) return null;

            const name = nameElements[nameElements.length - 1].innerText;
            if (!prevName || name !== prevName) {
                console.log(`Target name "${CONFIG.TARGET_NAME}" not found. Current name: "${name}"`);
                showToast(`"${name}" ko message nahi karna ${CONFIG.TARGET_NAME} ko message kar`, "#95a5a6");
                prevName = name;
                return;
            }

        
            // showToast(`"${CONFIG.TARGET_NAME}" naam ka contact nahi mila`, "#95a5a6");
            const footer = document.querySelector("._ak1i.x1wiwyrm");
            if (footer) {
                console.log("bluring the foooter as no target name found");
                footer.style.filter = "blur(5px)";
                footer.style.pointerEvents = "none";
            }
            return;
        }

        if (workDone) {
            const now = Date.now();
            if (lastChecked && now - lastChecked < 2000) return;

            lastChecked = now;
            const footer = document.querySelector("._ak1i.x1wiwyrm");
            const modal = document.querySelector("." + SELECTORS.modalClass);

            Array.from(parentDiv.children).forEach(child => {
                if (child !== modal) {
                    child.style.transition = "filter 0.5s ease";
                    child.style.filter = "none";
                    child.style.pointerEvents = "auto";
                }
            });

            if (footer) {
                footer.style.transition = "filter 0.5s ease";
                footer.style.filter = "blur(7px)";
                footer.style.pointerEvents = "none";
            }

            const allSpans = document.getElementsByClassName("_ao3e selectable-text copyable-text");
            if (allSpans.length) {
                const lastMessage = allSpans[allSpans.length - 1];

                if (lastMessage.innerText === CONFIG.AUTO_MESSAGE) {
                    if (lastWalaMessageShown) return;
                    lastWalaMessageShown = true;
                    setTimeout(() => {
                        lastWalaMessageShown = false;
                    }, 10000)
                    showToast("⚠️ Last wala message timer se pehle delete mat kar diyo warna ....", "#f39c12");
                } else {
                    showToast("😱 kar diya na message delete, ab dobara send kar", "#e74c3c");
                    localStorage.removeItem("workDone");
                    localStorage.removeItem("resetTimestamp");
                    workDone = false;
                    resetTimestamp = null;

                    // Remove countdown toast if exists
                    const countdownToast = document.getElementById("countdown-toast");
                    if (countdownToast) {
                        countdownToast.style.animation = "slideOutRight 0.5s ease";
                        setTimeout(() => countdownToast.remove(), 500);
                    }

                    const modal = createModal(parentDiv);
                    parentDiv.appendChild(modal);

                    if (footer) {
                        footer.style.transition = "filter 0.5s ease";
                        footer.style.filter = "none";
                        footer.style.pointerEvents = "auto";
                    }
                }
            }
            return;
        }

        let modal;
        if (!modalExists()) {
            try {
                modal = createModal(parentDiv);
                parentDiv.appendChild(modal);
            } catch (error) {
                console.error("Error creating modal:", error);
            }
        } else {
            modal = document.querySelector("." + SELECTORS.modalClass);
        }

        Array.from(parentDiv.children).forEach(child => {
            if (child !== modal) {
                child.style.transition = "filter 0.5s ease, opacity 0.5s ease";
                child.style.filter = "blur(5px)";
                child.style.pointerEvents = "none";
                child.style.opacity = "0.6";
            }
        });
    }, CONFIG.DEBOUNCE_DELAY);
}

function startObserver() {
    if (!document.body) {
        setTimeout(startObserver, 50);
        return;
    }

    const observer = new MutationObserver(() => {
        handleMutation();
    });

    const chatContainer = document.querySelector("#main") || document.body;
    observer.observe(chatContainer, {
        childList: true,
        subtree: true
    });
}

// Initialize on page load
function initialize() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
        return;
    }

    // Add animation styles
    addAnimationStyles();

    // Check timer on load and reset if expired
    const timerExpired = checkAndResetTimer();

    if (!timerExpired && workDone && resetTimestamp) {
        setTimeout(() => {
            showCountdownToast();
        }, 500);
    }

    // Start observer
    startObserver();

    console.log("🚀 WhatsApp Enhanced Script Initialized!");
}

// Start initialization
initialize();
