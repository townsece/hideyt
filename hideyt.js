let cssPath = "#contents #content"

browser.runtime.onMessage.addListener((request) => {
    document.body.querySelectorAll(cssPath).forEach(el => {
        if (el.querySelectorAll(".ytd-thumbnail-overlay-resume-playback-renderer").length > 0) {
            el.remove()
        }
    })
    return Promise.resolve({ response: "success" });
});
