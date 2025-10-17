const thumbnailPath = "#contents ytd-rich-item-renderer #content";
const containerPath = "#contents ytd-rich-item-renderer";
const resumeOverlayPath = ".ytd-thumbnail-overlay-resume-playback-renderer";
const resumeOverlayPath_new = ".ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment";
const upcomingOverlayPath = "#time-status [aria-label=\"Upcoming\"]";
const shortsXPath = "//div[contains(@class, \"section\") and @id=\"content\" and .//*[contains(text(),\"Shorts\")]]/..";

const gridBoxPath = "ytd-rich-grid-renderer";

function orchestrateRemoveWatched(request) {

    // wipe out the shorts rail entirely if exists
    document.evaluate(shortsXPath, document).iterateNext()?.remove();

    let selectorsToRemove = [resumeOverlayPath, resumeOverlayPath_new];
    if (request.hideUpcoming) {
        selectorsToRemove.push(upcomingOverlayPath);
    }

    // get all visible containers
    let allContainers = Array.from(document.body.querySelectorAll(containerPath));
    let visibleContainers = allContainers.filter(box => {
        return box.checkVisibility() && box.offsetParent !== null;
    });

    // Remove watched videos and collect remaining ones
    let remainingVideos = [];
    visibleContainers.forEach(container => {
        let video = container.querySelector("#content");
        if (video) {
            let shouldRemove = false;
            for (let path of selectorsToRemove) {
                if (video.querySelectorAll(path).length > 0) {
                    shouldRemove = true;
                    break;
                }
            }
            
            if (!shouldRemove) {
                // filter out non-videos like the shorts rail and header
                if (video.querySelectorAll("#menu-container").length === 0) {
                    remainingVideos.push(video);
                }
            }
        }
    });

    if (request.applyCustomColumns) {
        console.log(`setting columns to ${request.requestedColumns}`);
        let requestedColumnsString = String(request.requestedColumns);
        let gridBox = document.querySelector(gridBoxPath);
        if (gridBox) {
            let flexStyle = gridBox.getAttribute("style");
            flexStyle = flexStyle.replaceAll(/([a-zA-Z0-9\-]+): \d;/gi, `$1: ${requestedColumnsString};`);
            gridBox.setAttribute("style", flexStyle);
        }
        
        visibleContainers.forEach((box, i) => {
            box.setAttribute("items-per-row", requestedColumnsString);
            // clear existing vid
            let existingContent = box.querySelector("#content");
            if (existingContent) {
                existingContent.remove();
            }
            // Add new video if we have one
            if (i < remainingVideos.length) {
                box.insertAdjacentElement("afterbegin", remainingVideos[i]);
            }
        });
    } else {
        visibleContainers.forEach((box, i) => {
            // clear existing vid
            let existingContent = box.querySelector("#content");
            if (existingContent) {
                existingContent.remove();
            }
            // Add new video if we have one
            if (i < remainingVideos.length) {
                box.insertAdjacentElement("afterbegin", remainingVideos[i]);
            }
        });
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
});
