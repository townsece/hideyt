const thumbnailPath = "#contents ytd-rich-item-renderer #content"
const containerPath = "#contents ytd-rich-item-renderer"
const resumeOverlayPath = ".ytd-thumbnail-overlay-resume-playback-renderer"
const resumeOverlayPath_new = ".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment"
const upcomingOverlayPath = "#time-status [aria-label=\"Upcoming\"]"
const shortsXPath = "//div[contains(@class, \"section\") and @id=\"content\" and .//*[contains(text(),\"Shorts\")]]/.."

browser.runtime.onMessage.addListener((request) => {
    // wipe out the shorts rail entirely if exists
    document.evaluate(shortsXPath, document).iterateNext()?.remove()

    let selectorsToRemove = [resumeOverlayPath, resumeOverlayPath_new]
    if (request.hideUpcoming) {
        selectorsToRemove.push(upcomingOverlayPath)
    }
    // remove all videos which have the progress bar inlaid
    document.body.querySelectorAll(thumbnailPath).forEach(el => {
        for (let path of selectorsToRemove) {
            if (el.querySelectorAll(path).length > 0) {
                el.remove()
                break
            }
        }
    })
    let boxes = document.body.querySelectorAll(containerPath)
    let rawVideos = document.body.querySelectorAll(thumbnailPath)
    let videos = []
    // ignore non-videos like the shorts rail and header
    rawVideos.forEach(el => {
        if (el.checkVisibility() && el.querySelectorAll("div#details").length > 0 && el.querySelectorAll("#menu-container").length === 0) {
            videos.push(el)
        }
    })

    for (let i = 0; i < videos.length; i++) {
        console.log("hit removed at index " + i)
        // Remove the existing video from the dom and insert our own (which could be the same video)
        if (boxes[i].querySelectorAll("#content").length > 0) {
            boxes[i].querySelector("#content").remove()
        }
        boxes[i].insertAdjacentElement("afterbegin", videos[i])
    }
    return Promise.resolve({response: "success"})
})
