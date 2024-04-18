async function saveOptions(e) {
    e.preventDefault()
    let hideUpcoming = document.querySelector("#upcoming").checked
    console.log("Got hide upcoming as: " + hideUpcoming)
}

document.querySelector("form").addEventListener("submit", saveOptions)
