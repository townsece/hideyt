let fallbackSettings = {hideUpcoming: false}
let settings = {}

browser.browserAction.onClicked.addListener(
    (tab) => {
        browser.storage.local.get()
            .then(setSettings, handleError)
            .then((response) => removeWatched(tab, response))
    });

async function setSettings(storedSettings) {
    if (storedSettings !== null) {
        settings = storedSettings
        return Promise.resolve({gotSettings: true})
    }
    return Promise.resolve({gotSettings: false})
}

function removeWatched(tab, result) {
    console.log("Retrieving stored settings")
    let requestSettings
    if (result.gotSettings) {
        if (settings === undefined) {
            console.warn("Expected settings but got undefined, using fallback")
            requestSettings = fallbackSettings
        } else {
            requestSettings = settings
        }
    } else {
        console.log("No settings found in local storage; using defaults")
        requestSettings = fallbackSettings
    }

    console.log("Notifying content script to remove watched from tab")
    browser.tabs.sendMessage(
        tab.id,
        requestSettings
    ).then((response) => {
        console.log("Got: " + response.response)
    }).catch(() => console.warn("Extension not running or not on Youtube tab"))

}

async function handleError(e) {
    console.error(e)
    return Promise.resolve({gotSettings: false})
}
