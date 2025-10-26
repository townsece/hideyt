let fallbackSettings = { hideUpcoming: false, requestedColumns: 3, applyCustomColumns: false, autoFire: false };
let settings = {};

// Listener for clicks
browser.browserAction.onClicked.addListener(
    (tab) => {
        browser.storage.local.get()
            .then(setSettings, handleError)
            .then((response) => removeWatched(tab.id, response));
    });

// Listener for autofire
browser.webNavigation.onCompleted.addListener(
    (details) => {
        browser.storage.local.get()
            .then(setSettings, handleError)
            .then((response) => {
                if (settings.autoFire) {
                    removeWatched(details.tabId, response);
                }
            });
    },
    { url: [{ pathContains: "subscriptions" }] }
);

async function setSettings(storedSettings) {
    if (storedSettings !== null) {
        settings = storedSettings;
        return Promise.resolve({ gotSettings: true });
    } else {
        return Promise.resolve({ gotSettings: false });
    }
}

function removeWatched(tabId, result) {
    console.log("Retrieving stored settings");
    let requestSettings;
    if (result.gotSettings) {
        if (settings === undefined) {
            console.warn("Expected settings but got undefined, using fallback");
            requestSettings = fallbackSettings;
        } else {
            requestSettings = settings;
        }
    } else {
        console.log("No settings found in local storage; using defaults");
        requestSettings = fallbackSettings;
    }

    console.log("Notifying content script to remove watched from tab");
    browser.tabs.sendMessage(
        tabId,
        requestSettings
    ).then((response) => {
        console.log("Got: " + response.response);
    }).catch(() => console.warn("Extension not running or not on Youtube tab"));
}

async function handleError(e) {
    console.error(e);
    return Promise.resolve({ gotSettings: false });
}

// TODO - disable infinite scroll after removal - or handle pop-in
