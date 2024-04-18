function saveOptions() {
    let hideUpcoming = document.querySelector("#upcoming").checked
    console.log("Got hide upcoming as: " + hideUpcoming)
    browser.storage.local.set({
        hideUpcoming
    });
}

document.querySelector("form").addEventListener("submit", saveOptions)
