
function blockWorkDetailPage() {
    return { cancel: true };
}


browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.func === "blockWorkDetailPage")
            browser.webRequest.onBeforeRequest.addListener(blockWorkDetailPage, { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"], tabId: sender.tab.id }, ["blocking"]);
        else if (request.func === "releaseWorkDetailPage")
            browser.webRequest.onBeforeRequest.removeListener(blockWorkDetailPage);
        sendResponse({});
    }
);


browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['worklist.js', 'workLogAutoFill.js']
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/index.php*"] }
);




browser.webRequest.onCompleted.addListener(
    (details) => browser.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
            addWorklistButtons();
            addAutoFillForm();
        }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/index.php*"] }
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
            browser.webRequest.onBeforeRequest.removeListener(blockWorkDetailPage);
            browser.scripting.executeScript({
                target: { tabId: details.tabId },
                func: () => { document.getElementById("ext_form").style.display = 'none'; }
            })
        }
    },
    { urls: ["https://pt-attendance.nycu.edu.tw/*.php*"] }
);