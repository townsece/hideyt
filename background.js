browser.browserAction.onClicked.addListener(
    (tab) => {
        console.log("Removing watched from tab")
        browser.tabs.sendMessage(
            tab.id,
            { request: "Init remove" }
        )
    });
