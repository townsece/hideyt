browser.browserAction.onClicked.addListener(
    (tab) => {
        console.log("Removing watched from tab")
        browser.tabs.sendMessage(
            tab.id,
            {request: "Init remove"}
        ).then((response) => {
            console.log("Got: " + response.response);
        }).catch(() => console.warn("Extension not running or not on Youtube tab"));
    });
