let cssPath = "#contents #content"

document.body.querySelectorAll(cssPath).forEach(el => {
    if (el.querySelectorAll(".ytd-thumbnail-overlay-resume-playback-renderer").length > 0) {
        el.remove()
    }
})