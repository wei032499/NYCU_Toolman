browser.action.onClicked.addListener((tab) => {
    browser.tabs.create({
        url: 'https://pt-attendance.nycu.edu.tw/index.php'
    });
});

function blockWorkDetailPageListener() {
    return { cancel: true };
}

function blockWorkDetailPage(tabId) {
    browser.webRequest.onBeforeRequest.addListener(blockWorkDetailPage, { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"], tabId: tabId }, ["blocking"]);
}

function removeBlockWorkDetailPage() {
    browser.webRequest.onBeforeRequest.removeListener(blockWorkDetailPage);
}


browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.func === "blockWorkDetailPage")
            blockWorkDetailPage(sender.tab.id);
        else if (request.func === "releaseWorkDetailPage")
            removeBlockWorkDetailPage();
        sendResponse({});
    }
);


browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['worklist.js', 'workLogAutoFill.js']
    }, () => {
        browser.scripting.executeScript({
            target: { tabId: details.tabId },
            func: () => {
                addWorklistButtons();
                addAutoFillForm();
            }
        });
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/", "https://pt-attendance.nycu.edu.tw/?*", "https://pt-attendance.nycu.edu.tw/index.php*"] }
);

browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
            document.getElementById("ext_form").style.display = '';
            initAutoFillForm();
        }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"] }
);

browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { workDetail(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"] }
);

browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { workingList(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workingList.php*"] }
);

browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { bymonth(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/bymonth.php*"] }
);

browser.webRequest.onCompleted.addListener(
    (details) => {
        if (details.url.indexOf("://pt-attendance.nycu.edu.tw/workDetail.php") === -1 && details.url.indexOf("://pt-attendance.nycu.edu.tw/ajaxfunction.php") === -1) {
            removeBlockWorkDetailPage();
            browser.scripting.executeScript({
                target: { tabId: details.tabId },
                func: () => { try { document.getElementById("ext_form").style.display = 'none'; } catch (e) { } }
            })
        }
    },
    { urls: ["https://pt-attendance.nycu.edu.tw/*.php*"] }
);