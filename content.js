// Function to hide difficulty labels and set background color
function styleDifficultyTags() {
    try {
        document.querySelectorAll(
            '.text-olive, .text-yellow, .text-pink, .dark\\:text-dark-olive, .dark\\:text-dark-yellow, .dark\\:text-dark-pink, ' +
            '.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard, ' +
            '.dark\\:text-difficulty-easy, .dark\\:text-difficulty-medium, .dark\\:text-difficulty-hard, ' +
            '.pull-right.label.label-Medium.round' // New selector added here
        ).forEach((el) => {
            el.style.backgroundColor = 'white'; // Change background color to white
            el.style.color = 'transparent'; // Make text invisible
        });
    } catch (e) {
        console.error("Error in styleDifficultyTags:", e);
    }
}

// Debounce function to limit calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to replace the content of the specified count div
function replaceCountDivContent() {
    try {
        const countDivs = document.querySelectorAll('.text-sd-foreground.text-xs.font-medium');

        countDivs.forEach(countDiv => {
            countDiv.innerHTML = 'HIDDEN (DISABLE EXTENSION TO VIEW)';
        });
    } catch (e) {
        console.error("Error in replaceCountDivContent:", e);
    }
}

// Function to replace the content of the specified absolute div
function replaceAbsoluteDivContent() {
    try {
        const absoluteDiv = document.querySelector('.absolute.left-1\\/2.top-1\\/2.h-\\[113%\\].w-\\[113%\\].translate-x-\\[-50%\\].translate-y-\\[-44%\\]');
        if (absoluteDiv) {
            absoluteDiv.innerHTML = 'DISABLE LEETCODE DIFFICULTY HELPER EXTENSION!';
        }
    } catch (e) {
        console.error("Error in replaceAbsoluteDivContent:", e);
    }
}

// Function to wait for the HTML to stabilize
async function waitForStableHTML() {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            try {
                // Check for the presence of the stable elements to determine if the HTML is stable
                const stable1 = document.querySelector('.text-xs.font-medium.text-sd-easy');
                const stable2 = document.querySelector('.question-title.clearfix'); // New stable condition


                if (stable1) { // Using OR condition
                    observer.disconnect();
                    resolve();
                }
            } catch (e) {
                console.error("Error in waitForStableHTML observer:", e);
            }
        });

        // Start observing the document body for changes
        observer.observe(document.body, { childList: true, subtree: true });

        // Optionally, set a timeout to avoid infinite waiting
        setTimeout(() => {
            observer.disconnect();
            resolve(); // Resolve after a timeout, if necessary
        }, 3000); // 3 seconds timeout
    });
}

// Async function to wait and continue
async function waitAndContinue() {
    console.log("Waiting for stable HTML");
    await waitForStableHTML();
    console.log("End");
    
    // Call your functions after the HTML is stable
    try {
        styleDifficultyTags(); // Call the new function to style difficulty tags
        replaceCountDivContent();
        replaceAbsoluteDivContent(); // Call the new function to replace absolute div content
    } catch (e) {
        console.error("Error during initial setup in waitAndContinue:", e);
    }
    
    // Start observing for further changes
    const observer = new MutationObserver(debounce(() => {
        try {
            styleDifficultyTags(); // Call the new function to style difficulty tags
            replaceCountDivContent();
            replaceAbsoluteDivContent(); // Call the new function to replace absolute div content
        } catch (e) {
            console.error("Error during mutation observer callback:", e);
        }
    }));
    
    const targetNode = document.body; // Adjust as necessary
    observer.observe(targetNode, { childList: true, subtree: true });
}

// Call the waitAndContinue function to start the process
waitAndContinue();
