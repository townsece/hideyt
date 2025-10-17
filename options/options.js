const form = document.querySelector("form");
const button = form.querySelector('button[type="submit"]');

function saveOptions(e) {
    e.preventDefault();

    // UI feedback on press
    button.textContent = 'Saving...';
    button.classList.add('saving');
    button.disabled = true;

    let hideUpcoming = document.querySelector("#upcoming").checked;
    console.log("Got hide upcoming as: " + hideUpcoming);
    let requestedColumns = document.querySelector("#thumbnail-row-width").value;
    let applyCustomColumns = document.querySelector("#apply-row-width").checked;
    console.log("Got custom columns as: " + requestedColumns);
    console.log(`${applyCustomColumns ?? "not "}applying custom columns`);
    browser.storage.local.set({
        hideUpcoming,
        requestedColumns,
        applyCustomColumns
    });

    // UI confirm
    button.classList.remove('saving');
    button.classList.add('saved');
    button.textContent = 'Saved';
    
    // Reset button after 2 seconds
    setTimeout(() => {
        button.classList.remove('saved');
        button.textContent = 'Save';
        button.disabled = false;
    }, 2000);
}

function retrieveOptions(optionsFromStorage) {
    document.querySelector("#upcoming").checked = optionsFromStorage.hideUpcoming;
    document.querySelector("#thumbnail-row-width").value = optionsFromStorage.requestedColumns;
    document.querySelector("#apply-row-width").checked = optionsFromStorage.applyCustomColumns;
}

function handleError(e) {
    console.error(e);
}

browser.storage.local.get().then(retrieveOptions, handleError);

form.addEventListener("submit", async (e) => saveOptions(e));
