function initAutoFillForm() {
    const ext_form = document.getElementById("ext_form");
    if (ext_form.inited === true) return;

    document.querySelectorAll("#pno option").forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.text = option.text;
        document.querySelector("#ext_pno").appendChild(opt);
    })
    ext_form.inited = true;

    const workList = document.querySelectorAll("#ext_pno option");
    const pos = { targ: document.querySelector("#ext_pno"), rel: "afterend" };
    const compare = function (option) {
        try {
            const now = new Date();
            return new Date(option.text.split(/[\s]+/)[1].split("~")[1]).getTime() < new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()).getTime();
        } catch (e) { }

        return false;
    };

    addExpiredBtn(workList, pos, compare);
}



async function addRecords(pno, times) {
    await browser.runtime.sendMessage({ func: "blockWorkDetailPage" });

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
        submitE.disabled = false;
        submitE.click();
    }


    const response = await browser.runtime.sendMessage({ func: "releaseWorkDetailPage" });
    document.getElementById("node_level-1-1").click();
    // console.log(response);

}



function getDateList(startDate, endDate, day, targetM) {
    const firstDateM = new Date(targetM + "-01"); firstDateM.setHours(0);
    const firstDate = startDate.getTime() < firstDateM.getTime() ? firstDateM : startDate;
    const now = new Date();
    const lastDate = endDate.getTime() < now.getTime() ? endDate : now;

    // const lastDayM = new Date(now.getFullYear(), (now.getMonth() + 1), 0);
    let diff = parseInt(day) - firstDate.getDay();
    if (diff < 0) diff += 7;
    firstDate.setDate(firstDate.getDate() + diff)

    const dateList = [];
    for (const date = new Date(firstDate); date.getTime() <= lastDate.getTime(); date.setDate(date.getDate() + 7))
        dateList.push(date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0'));

    return dateList;
}



function addAutoFillForm() {
    const ext_form = document.createElement("form");
    ext_form.id = "ext_form";
    ext_form.required = true;
    ext_form.style.display = 'none';

    const ext_pno = document.createElement("select");
    ext_pno.id = "ext_pno";
    ext_pno.required = true;

    const ext_day = document.createElement("select");
    ext_day.id = "ext_day";
    ext_day.required = true;
    const days = ["一", "二", "三", "四", "五", "六", "日"];
    for (let i = 0; i < days.length; i++) {
        const opt = document.createElement('option');
        opt.text = days[i];
        opt.value = (i + 1) % 7;
        ext_day.appendChild(opt);
    }

    const now = new Date();

    const ext_targetM = document.createElement("input");
    ext_targetM.id = "ext_targetM";
    ext_targetM.required = true;
    ext_targetM.type = "month";
    ext_targetM.placeholder = "yyyy-mm"
    ext_targetM.value = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0');

    const ext_startT = document.createElement("input");
    ext_startT.id = "ext_startT";
    ext_startT.required = true;
    ext_startT.type = "time";
    ext_startT.value = "08:00";

    const ext_period = document.createElement("input");
    ext_period.id = "ext_period";
    ext_period.required = true;
    ext_period.type = "number";
    ext_period.min = "1";
    ext_period.max = "4";
    ext_period.value = "4";


    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = "開始填寫";
    ext_form.appendChild(document.createTextNode("計畫編號"));
    ext_form.appendChild(ext_pno);
    ext_form.appendChild(document.createTextNode("每周"));
    ext_form.appendChild(ext_day);
    ext_form.appendChild(document.createTextNode("開始於"));
    ext_form.appendChild(ext_targetM);
    ext_form.appendChild(ext_startT);
    ext_form.appendChild(document.createTextNode("持續"));
    ext_form.appendChild(ext_period);
    ext_form.appendChild(document.createTextNode("小時"));
    ext_form.appendChild(submit);

    ext_form.addEventListener('submit', function (event) {
        event.preventDefault();
        const pnoE = document.getElementById("ext_pno");
        const projectText = pnoE.options[pnoE.selectedIndex].text;
        const [startDate, endDate] = projectText.split(/\s/)[1].split("~");
        const pno = pnoE.value;
        const day = document.getElementById("ext_day").value;
        const targetM = document.getElementById("ext_targetM").value;
        const startT = document.getElementById("ext_startT").value;
        const startTS = startT.split(":");
        const period = document.getElementById("ext_period").value;

        const dateList = getDateList(new Date(startDate), new Date(endDate), day, targetM);
        const times = [];
        dateList.forEach(function (date) {
            const start = date + " " + startT;
            const end = date + " " + (parseInt(startTS[0]) + parseInt(period)) + ":" + startTS[1];
            times.push([start, end]);
        });

        addRecords(pno, times);

    })

    document.querySelector("#main3").insertAdjacentElement("afterend", ext_form);

}