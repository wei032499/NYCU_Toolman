function init() {
    document.querySelectorAll("#pno option").forEach((option) => {
        try {
            const now = new Date();
            if (!(new Date(option.text.split(" ")[1].split("~")[0]).getTime() > new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime() ||
                new Date(option.text.split(" ")[1].split("~")[1]).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime())) {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.text = option.text;
                document.querySelector("#ext_pno").appendChild(opt);
            }
        } catch (e) { }

    })


    document.getElementById("ext_form").addEventListener('submit', function (event) {
        event.preventDefault();
        const pno = document.getElementById("ext_pno").value;
        const day = document.getElementById("ext_day").value;
        const startT = document.getElementById("ext_startT").value;
        const startTS = startT.split(":");
        const period = document.getElementById("ext_period").value;

        const dateList = getDateList(day);
        const times = [];
        dateList.forEach(function (date) {
            const start = date + " " + startT;
            const end = date + " " + (parseInt(startTS[0]) + parseInt(period)) + ":" + startTS[1];
            times.push([start, end]);
        });

        addRecords(pno, times);

    })

}



async function addRecords(pno, times) {
    await chrome.runtime.sendMessage({ func: "blockWorkDetailPage" });

    for (let i = 0; i < times.length; i++) {
        // await new Promise(r => setTimeout(r, 300));
        const pnoE = document.querySelector("#pno");
        const workSE = document.querySelector("input[name='workS']");
        const workEE = document.querySelector("input[name='workE']");
        const submitE = document.querySelector("input[name='btnSubmit']");

        pnoE.value = pno;
        workSE.value = times[i][0];
        workEE.value = times[i][1];
        pnoE.dispatchEvent(new Event("change"));
        await new Promise(r => setTimeout(r, 300));
        submitE.click();
    }


    const response = await chrome.runtime.sendMessage({ func: "releaseWorkDetailPage" });
    document.getElementById("node_level-1-1").click();
    // console.log(response);

}



function getDateList(day) {
    const now = new Date();
    const firstDayM = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-01");
    const lastDayM = new Date(now.getFullYear(), (now.getMonth() + 1), 0);
    let diff = parseInt(day) - firstDayM.getDay();
    if (diff < 0) diff += 7;

    const dateList = [];
    for (let i = 1 + diff; i <= lastDayM.getDate(); i += 7) {
        dateList.push(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + i.toString().padStart(2, '0'));
    }

    return dateList;
}



