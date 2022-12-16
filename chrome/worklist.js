function modifyWorkList(btn) {
    btn.innerHTML = (window.showExpired !== false) ? "hide expired" : "show expired";

    if (window.showExpired !== false) btn.workList.forEach((work) => work.style.display = '');
    else btn.workList.forEach((work) => { if (btn.compare(work)) work.style.display = 'none' });
}

function addExpiredBtn(workList, pos, compare) {

    const btn = document.createElement("button");
    btn.innerHTML = (window.showExpired !== false) ? "hide expired" : "show expired";
    btn.type = "button";
    btn.className = "expiredBtn";

    btn.workList = workList;
    btn.compare = compare;
    btn.addEventListener('click', function () {
        window.showExpired = (window.showExpired === false);
        const triggers = document.querySelectorAll(".expiredBtn");
        for (let i = 0; i < triggers.length; i++)
            modifyWorkList(triggers[i]);
    });
    pos.targ.insertAdjacentElement(pos.rel, btn);


    modifyWorkList(btn);

}



function workLists() {
    const workList = document.querySelectorAll("#showWorkLists tbody tr");
    const pos = { targ: document.querySelector("#showWorkLists h1"), rel: "afterend" };
    const compare = function (tr) {
        try {
            const now = new Date();
            return new Date(tr.querySelectorAll("td")[7].textContent).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime();
        } catch (e) { }

        return false;
    };


    addExpiredBtn(workList, pos, compare);

}

function bymonth() {

    const workList = document.querySelectorAll("#bugetno option");
    const pos = { targ: document.querySelector("#bugetno"), rel: "afterend" };
    const compare = function (option) {
        try {
            const now = new Date();
            const endDate = option.text.split(/\s/)[1].split("-")[1];
            return new Date(endDate.slice(0, 4), endDate.slice(4), 0).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime();
        } catch (e) { }

        return false;

    };

    addExpiredBtn(workList, pos, compare);
}

function workDetail() {
    const workList = document.querySelectorAll("#pno option");
    const pos = { targ: document.querySelector("#payType"), rel: "beforebegin" };
    const compare = function (option) {
        try {
            const now = new Date();
            return new Date(option.text.split(/\s/)[1].split("~")[1]).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime();
        } catch (e) { }

        return false;

    };

    addExpiredBtn(workList, pos, compare);
}

function workingList() {
    const workList = document.querySelectorAll("#pno option");
    const pos = { targ: document.querySelector("#pno"), rel: "afterend" };
    const compare = function (option) {
        try {
            const now = new Date();
            return new Date(option.text.split(/[\s]+/)[1].split("~")[1]).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime();
        } catch (e) { }

        return false;
    };

    addExpiredBtn(workList, pos, compare);
}


workLists();