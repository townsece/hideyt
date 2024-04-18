function saveOptions() {
    let hideUpcoming = document.querySelector("#upcoming").checked
    console.log("Got hide upcoming as: " + hideUpcoming)
    browser.storage.local.set({
        hideUpcoming
    });
}

function retrieveOptions(optionsFromStorage) {
    document.querySelector("#upcoming").checked = optionsFromStorage.hideUpcoming
}

function handleError(e) {
    console.error(e)
}

browser.storage.local.get().then(retrieveOptions, handleError)

document.querySelector("form").addEventListener("submit", saveOptions)
