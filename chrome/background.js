function blockWorkDetailPage(tabId) {
    chrome.declarativeNetRequest.updateSessionRules({
        addRules: [{
            action: { type: "block" },
            condition: {
                urlFilter: "workDetail.php", // block URLs that starts with this
                domains: ["pt-attendance.nycu.edu.tw"], // on this domain
                tabIds: [tabId]
            },
            id: tabId,
            priority: 1
        }],
        removeRuleIds: [tabId], // this removes old rule if any
    }, () => { });
}

function removeBlockWorkDetailPage(tabId) {
    chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [tabId] });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.func === "blockWorkDetailPage")
            blockWorkDetailPage(sender.tab.id);
        else if (request.func === "releaseWorkDetailPage")
            removeBlockWorkDetailPage(sender.tab.id);
        sendResponse({});
    }
);


chrome.webRequest.onCompleted.addListener(
    (details) => chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['worklist.js', 'workLogAutoFill.js']
    }, () => {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: () => {
                addWorklistButtons();
                addAutoFillForm();
            }
        });
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/index.php*"] }
);


chrome.webRequest.onCompleted.addListener(
    (details) => chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
            document.getElementById("ext_form").style.display = '';
            initAutoFillForm();
        }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { workDetail(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workDetail.php*"] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { workingList(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/workingList.php*"] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => { bymonth(); }
    }),
    { urls: ["https://pt-attendance.nycu.edu.tw/bymonth.php*"] }
);

chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (details.url.indexOf("://pt-attendance.nycu.edu.tw/workDetail.php") === -1 && details.url.indexOf("://pt-attendance.nycu.edu.tw/ajaxfunction.php") === -1) {
            removeBlockWorkDetailPage(details.tabId);
            chrome.scripting.executeScript({
                target: { tabId: details.tabId },
                func: () => { try { document.getElementById("ext_form").style.display = 'none'; } catch (e) { } }
            })
        }
    },
    { urls: ["https://pt-attendance.nycu.edu.tw/*.php*"] }
);