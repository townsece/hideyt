let thumbnailPath = "#contents #content"
let containerPath = "#contents ytd-rich-item-renderer"

browser.runtime.onMessage.addListener((request) => {
    document.body.querySelectorAll(thumbnailPath).forEach(el => {
        if (el.querySelectorAll(".ytd-thumbnail-overlay-resume-playback-renderer").length > 0) {
            el.remove()
        }
    })
    let boxes = document.body.querySelectorAll(containerPath)
    let rawVideos = document.body.querySelectorAll(thumbnailPath)
    let videos = []
    // Remove non-videos like the shorts rail and header
    rawVideos.forEach(el => {
        if (el.checkVisibility() && el.querySelectorAll("div#details").length > 0 && el.querySelectorAll("#menu-container").length === 0) {
            videos.push(el)
        }
    })
    let hitRemoved = false
    for (let i = 0; i < videos.length; i++) {
        if (!hitRemoved) {
            // Once we hit the first empty container, we are just backfilling, regardless of existing videos
            hitRemoved = boxes[i].querySelectorAll("#content").length === 0;
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
    // TODO - stop using the shorts containers
    return Promise.resolve({ response: "success" });
});
