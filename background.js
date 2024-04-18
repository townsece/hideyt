let defaultSettings = {hideUpcoming : false}

browser.browserAction.onClicked.addListener(
    (tab) => {
        browser.storage.local.get().then(setSettings, handleError)
        removeWatched(tab, defaultSettings)
    });

function setSettings(storedSettings) {
    let fromStored = storedSettings.hideUpcoming
    console.log("Also removing upcoming videos? " + fromStored)
    defaultSettings.hideUpcoming = fromStored
}

function removeWatched(tab) {
    console.log("Removing watched from tab")
    browser.tabs.sendMessage(
        tab.id,
        { remove_upcoming: defaultSettings.hideUpcoming }
    ).then((response) => {
        console.log("Got: " + response.response);
    }).catch(() => console.warn("Extension not running or not on Youtube tab"));

}

function handleError(e) {
    console.error(e)
}
