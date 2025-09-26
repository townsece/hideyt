function saveOptions() {
    let hideUpcoming = document.querySelector("#upcoming").checked
    console.log("Got hide upcoming as: " + hideUpcoming)
    let requestedColumns = document.querySelector("#thumbnail-row-width").value
    let applyCustomColumns = document.querySelector("#apply-row-width").checked
    console.log("Got custom columns as: " + requestedColumns)
    console.log(`${applyCustomColumns ?? "not "}applying custom columns`)
    browser.storage.local.set({
        hideUpcoming,
        requestedColumns,
        applyCustomColumns
    });
}

function retrieveOptions(optionsFromStorage) {
    document.querySelector("#upcoming").checked = optionsFromStorage.hideUpcoming
    document.querySelector("#thumbnail-row-width").value = optionsFromStorage.requestedColumns
    document.querySelector("#apply-row-width").checked = optionsFromStorage.applyCustomColumns
}

function handleError(e) {
    console.error(e)
}

browser.storage.local.get().then(retrieveOptions, handleError)

document.querySelector("form").addEventListener("submit", saveOptions)
