const thumbnailPath = "#contents ytd-rich-item-renderer #content";
const containerPath = "#contents ytd-rich-item-renderer";
const resumeOverlayPath = ".ytd-thumbnail-overlay-resume-playback-renderer";
const resumeOverlayPath_new = ".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment";
const upcomingOverlayPath = "#time-status [aria-label=\"Upcoming\"]";
const shortsXPath = "//div[contains(@class, \"section\") and @id=\"content\" and .//*[contains(text(),\"Shorts\")]]/..";

const gridBox = "ytd-rich-grid-renderer";

function orchestrateRemoveWatched(request) {

    // wipe out the shorts rail entirely if exists
    document.evaluate(shortsXPath, document).iterateNext()?.remove();

    let selectorsToRemove = [resumeOverlayPath, resumeOverlayPath_new];
    if (request.hideUpcoming) {
        selectorsToRemove.push(upcomingOverlayPath);
    }

    let removed = [];
    // remove all videos which have the progress bar inlaid
    document.body.querySelectorAll(thumbnailPath).forEach(el => {
        for (let path of selectorsToRemove) {
            if (el.querySelectorAll(path).length > 0) {
                el.remove();
                removed.push(el);
                break;
            }
        }
    })
    let boxes = document.body.querySelectorAll(containerPath);
    let rawVideos = document.body.querySelectorAll(thumbnailPath);
    let videos = [];
    // filter out non-videos like the shorts rail and header
    rawVideos.forEach(el => {
        if (el.checkVisibility() && el.querySelectorAll("#menu-container").length === 0) {
            videos.push(el);
        }
    });

    if (request.applyCustomColumns) {
        console.log(`setting columns to ${request.requestedColumns}`);
        let requestedColumnsString = String(request.requestedColumns);
        let flexStyle = document.querySelector(gridBox).getAttribute("style");
        flexStyle = flexStyle.replaceAll(/([a-zA-Z0-9\-]+): \d;/gi, `$1: ${requestedColumnsString};`);
        document.querySelector(gridBox).setAttribute("style", flexStyle);
        for (let i = 0; i < videos.length; i++) {
            // Remove the existing video from the dom and insert our own (which could be the same video)
            boxes[i].setAttribute("items-per-row", requestedColumnsString);
            if (boxes[i].querySelectorAll("#content").length > 0) {
                boxes[i].querySelector("#content").remove();
            }
            boxes[i].insertAdjacentElement("afterbegin", videos[i]);
        }
        for (let i = videos.length; i < boxes.length; i++) {
            // Set for remaining boxes
            boxes[i].setAttribute("items-per-row", requestedColumnsString);
        }
    } else {
        for (let i = 0; i < videos.length; i++) {
            // Remove the existing video from the dom and insert our own (which could be the same video)
            if (boxes[i].querySelectorAll("#content").length > 0) {
                boxes[i].querySelector("#content").remove();
            }
            boxes[i].insertAdjacentElement("afterbegin", videos[i]);
        }
    }
}

browser.runtime.onMessage.addListener((request) => {
    // Ensure everything has finished loading before firing
    if (document.readyState === 'loading' || document.readyState === 'interactive') {
        document.addEventListener("DOMContentLoaded", () => {
            orchestrateRemoveWatched(request);
        })
    } else {
        orchestrateRemoveWatched(request);
    }
    return Promise.resolve({ response: "success" });
})
