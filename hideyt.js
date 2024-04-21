let thumbnailPath = "#contents #content"
let containerPath = "#contents ytd-rich-item-renderer"
let resumeOverlayPath = ".ytd-thumbnail-overlay-resume-playback-renderer"
let upcomingOverlayPath = "#time-status [aria-label=\"Upcoming\"]"
let shortsXPath = "//div[contains(@class, \"section\") and @id=\"content\" and .//*[contains(text(),\"Shorts\")]]/.."

browser.runtime.onMessage.addListener((request) => {
    // wipe out the shorts rail entirely
    try {
        document.evaluate(shortsXPath, document).iterateNext().remove()
    } catch (error) {
        console.log("Didn't find Shorts reel, continuing as normal")
    }

    let selectorsToRemove = [resumeOverlayPath]
    if (request.hideUpcoming === true) {
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
    let hitRemoved = false
    for (let i = 0; i < videos.length; i++) {
        if (!hitRemoved) {
            // Once we hit the first empty container, we are just backfilling, regardless of existing videos
            hitRemoved = boxes[i].querySelectorAll("#content").length === 0
        }
        if (hitRemoved) {
            console.log("hit removed at index " + i)
            // Remove the existing video from the dom and insert our own
            if (boxes[i].querySelectorAll("#content").length > 0) {
                boxes[i].querySelector("#content").remove()
            }
            boxes[i].insertAdjacentElement("afterbegin", videos[i])
        }
    }
    return Promise.resolve({ response: "success" })
})
