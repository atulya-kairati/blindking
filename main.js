let twinkleTimeout = null;
let scrollStopTimeout = null;

window.addEventListener("scroll", () => {
    revealPaintingWithScroll();

    if (scrollStopTimeout) {
        clearTimeout(scrollStopTimeout);
    }

    scrollStopTimeout = setTimeout(() => restoreWordBrightness(), 300);

    if (!twinkleTimeout) {
        twinkleTwinkle();
        twinkleTimeout = setTimeout(() => {
            twinkleTimeout = null;
        }, 100);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const year = (new Date(Date.now())).getFullYear();
    document.querySelector("footer").innerText = `© ${year} Manus Chaubey. All rights reserved.`

    const story = document.querySelector("#story");
    wordSpanner(story);
});

function restoreWordBrightness() {
    console.log("restoreWordBrightness");

    const words = document.querySelectorAll(".sparkle");
    words.forEach((word) => {
        word.style.transition = "filter 1s ease";
        word.style.filter = "brightness(1)";
    })
}

function revealPaintingWithScroll() {
    const scrollTop = window.scrollY;

    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const brightness = 0.02 + scrollPercent * (0.3);

    document.querySelector("#bg-image").style.filter =
        `brightness(${brightness})`;
}

function twinkleTwinkle() {
    const words = document.querySelectorAll(".sparkle");
    const baseScroll = window.scrollY;

    words.forEach((word, index) => {

        if (!isInViewport(word)) return;

        const uniqueScrollOffset = baseScroll + index * (28 + 0 * Math.random()); // adjust randomness

        const brightness = 0.4 + Math.abs(Math.sin(uniqueScrollOffset / 40) * 0.6);

        word.style.transition = "filter 0.1s ease"
        word.style.filter = `brightness(${brightness})`;
    });
}

/**
 * Wraps every word with a span
 * @param {*} element 
 */
function wordSpanner(element) {
    const wordWalker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
    );

    const nodes = [];
    while (wordWalker.nextNode()) {
        nodes.push(wordWalker.currentNode);
    }

    nodes.forEach((node) => {
        const fragment = document.createDocumentFragment();

        const words = node.textContent.split(/(\s+)/);

        words.forEach((word) => {
            if (word.trim() === "") {
                // for preserving white space
                fragment.appendChild(document.createTextNode(word));
            }
            else {
                // wrap word with span
                const span = document.createElement("span");
                span.className = "sparkle";
                span.textContent = word;
                fragment.appendChild(span);
            }
        });

        node.parentNode.replaceChild(fragment, node);
    });
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}
