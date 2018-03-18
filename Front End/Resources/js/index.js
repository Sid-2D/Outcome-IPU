var Template = require('./template.js');
var makeCompTable = require('./compTable.js');
var makeSummary = require('./summary.js');
var semReport = require('./report.js').semReport;
Object.assign(window, require('./menu.js'));

var display, request, progressBar, rankContainers = {}, rankData = {}, currentRollNumber, latestResult = '-', currentSem, marksList = [];

window.onload = function() {
    display = document.getElementById("Display");
    request = new XMLHttpRequest();
    request.addEventListener("load", resultTransferComplete);
    request.addEventListener("error", resultTransferFailed);
    addIntros();
}

function addIntros() {
    for (let i = 1; i <= 4; i++) {
        setTimeout(() => {
            let div = document.getElementById('intro' + i);
            div.style.animation = 'fadeIn 2s';
            div.style.opacity = '1';
        }, i * 1000);
    }
}

window.findResult = function() {
    // Initiate request and add progress bar
    var roll = document.getElementById('rollNumber').value.replace(/ /g, '');
    addProgressBar();
    if (/^\d{11}$/.test(roll)) {
        request.open('GET', '/find/' + roll, true);
        request.send();
    } else {
        removeProgressBar();
        var msg = document.createElement(Template[0].tag);
        setHtml(0, msg);
        msg.innerHTML = "Please enter valid roll number.";
        display.appendChild(msg);
    }
}

window.sampleResult = function() {
    document.getElementById('rollNumber').value = '00210102714';
    findResult();
}

function resultTransferComplete() {
    removeProgressBar();
    addNameAndTables();
    addSummary();
    // Implemented in menu
    fixResultHistory(currentRollNumber);
}

function resultTransferFailed() {
    removeProgressBar();
    var msg = document.createElement(Template[0].tag);
    setHtml(0, msg);
    console.log(request.response);
    msg.innerHTML = "An error occured.";
    display.appendChild(msg);
}

function addProgressBar() {
    var progressLines = [];
    progressBar = document.createElement(Template[7].tag);
    setHtml(7, progressBar);
    for (let i = 0; i < 3; i++) {
        progressLines.push(document.createElement(Template[8].tag));
        setHtml(8, progressLines[i]);
        progressBar.appendChild(progressLines[i]);
    }
    display.innerHTML = "";
    display.appendChild(progressBar);
}

function addDropDownMenu(list) {
    var dropContainer = document.createElement('div');
    dropContainer.setAttribute("class", "btn-group");
    dropContainer.style.animation = "fadeIn 3s";
    var dropButton = document.createElement(Template[11].tag);
    setHtml(11, dropButton);
    dropButton.innerHTML = "Semester";
    dropContainer.appendChild(dropButton);

    // Summary button
    var summaryButton = document.createElement(Template[21].tag);
    setHtml(21, summaryButton);
    summaryButton.innerHTML = '&nbsp;&nbsp;Overall&nbsp;&nbsp;';
    summaryButton.onclick = summaryAction;
    dropContainer.appendChild(summaryButton);

    var menu = document.createElement(Template[12].tag);
    setHtml(12, menu);
    var re = false, semNumbers = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].Score === '-') {
            re = true;
            continue;
        }
        marksList[parseInt(list[i].Semester)] = Object.assign([], list[i].Marks);
        marksList[parseInt(list[i].Semester)].push(list[i].Credit);
        marksList[parseInt(list[i].Semester)].push(list[i].Score);
        semNumbers[parseInt(list[i].Semester)] = true;
    }
    for (let i = 1; i < 9; i++) {
        if (semNumbers[i]) {
            latestResult = i;
            let menuItem = document.createElement(Template[13].tag);
            setHtml(13, menuItem);
            menuItem.innerHTML = "Sem 0" + i;
            menuItem.onclick = dropMenuAction.bind(null, i);
            menu.appendChild(menuItem);
        }
    }
    if (re) {
        let menuItem = document.createElement(Template[13].tag);
        setHtml(13, menuItem);
        menuItem.innerHTML = "Reappear";
        menuItem.onclick = dropMenuAction.bind(null, '-');
        menu.appendChild(menuItem);
    }
    dropContainer.appendChild(menu);
    display.appendChild(dropContainer);
    // Space after menu
    var space = document.createElement('div');
    space.style.minHeight = '15px';
    display.appendChild(space);
}

var currentActive;
function dropMenuAction(sem) {
    if (currentActive && currentActive !== div) {
        currentActive.style.display = 'none';
    }
    currentSem = sem;
    var div = document.getElementById('sem' + sem);
    div.style.display = '';
    currentActive = div;
    // Change color
    document.getElementById('DropdownButton').style.backgroundColor = '#43a047';
    document.getElementById('DropdownButton').style.color = '#fff';
    document.getElementById('SummaryButton').style.backgroundColor = '#fff';
    document.getElementById('SummaryButton').style.color = '#333';
}

function summaryAction() {
    if (currentActive) {
        currentActive.style.display = 'none';
    }
    currentActive = document.getElementById('SummaryContainer');
    currentActive.style.display = '';
    // Change color
    document.getElementById('DropdownButton').style.backgroundColor = '#fff';
    document.getElementById('DropdownButton').style.color = '#333';
    document.getElementById('SummaryButton').style.backgroundColor = '#43a047';
    document.getElementById('SummaryButton').style.color = '#fff';
}

function addRankProgressBar(parent) {
    var progressLines = [];
    progressBar = document.createElement(Template[7].tag);
    setHtml(7, progressBar);
    for (let i = 0; i < 3; i++) {
        progressLines.push(document.createElement(Template[8].tag));
        setHtml(8, progressLines[i]);
        progressBar.appendChild(progressLines[i]);
    }
    parent.appendChild(progressBar);
}

function removeProgressBar() {
    progressBar.style.animation = "fadeOut 1s";
    progressBar.style.opacity = 0;
}

window.getList = function(Sem) {
    Sem = '0' + Sem;
    rankContainers[Sem].childNodes[0].style.animation = "fadeOut 1s";
    rankContainers[Sem].childNodes[0].style.opacity = 0;
    rankContainers[Sem].childNodes[0].onclick = "";
    addRankProgressBar(rankContainers[Sem]);
    var rankRequest = new XMLHttpRequest();
    rankRequest.addEventListener("load", rankTransferComplete.bind(null, Sem, rankRequest));
    rankRequest.addEventListener("error", rankTransferFailed.bind(null, Sem));
    rankRequest.open('POST', '/rank', true);
    rankRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    rankRequest.send(JSON.stringify(rankData[Sem]));
}

function rankTransferComplete(Sem, rankRequest) {
    var node = rankContainers[Sem];
    node.childNodes[1].style.animation = "fadeOut 1s";
    node.childNodes[1].style.opacity = 0;
    try {
        var res = JSON.parse(rankRequest.response);
        // Make table
        var banner = document.createElement(Template[0].tag);
        setHtml(0, banner);
        banner.innerHTML = 'Sem ' + rankData[Sem].Semester + ' Rank List'; 
        node.appendChild(banner);
        var tableEntries = ['Name', 'EnrollmentNumber', 'Scores'];
        // Table
        var tableContainer = document.createElement(Template[2].tag);
        setHtml(2, tableContainer);
        var table = document.createElement(Template[3].tag);
        setHtml(3, table);
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        setHeaders();
        // Start populating table
        for (let j = 0; j < res.Students.length; j++) {
            tr = document.createElement('tr');
            tr.setAttribute('data-toggle', 'collapse');
            tr.setAttribute('class', 'accordion-toggle');
            tr.setAttribute('data-target', '#comp' + parseInt(j + 1) + 'sem' + currentSem);
            if (res.Students[j].EnrollmentNumber === currentRollNumber) {
                tr.style.background = "#999";
                tr.setAttribute('data-target', '');
            }
            var th = document.createElement('th');
            th.setAttribute('scope', 'row');
            th.innerHTML = j + 1;
            tr.appendChild(th);
            var td = document.createElement('td');
            var iTag = document.createElement(Template[14].tag);
            iTag.setAttribute('id', 'compBtn' + parseInt(j + 1) + 'sem' + currentSem);
            setHtml(14, iTag);
            // Change fa class on click
            td.appendChild(iTag);
            tr.appendChild(td);
            for (let k = 0; k < 3; k++) {
                var td = document.createElement('td');
                td.innerHTML = res.Students[j][tableEntries[k]];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            var trComp = document.createElement('tr');
            var tdComp = document.createElement('td');
            setHtml(15, tdComp);
            var divComp = document.createElement('div')
            setHtml(16, divComp);
            divComp.setAttribute('id', 'comp' + parseInt(j + 1) + 'sem' + currentSem);
            tdComp.appendChild(divComp);
            trComp.appendChild(tdComp);
            tbody.appendChild(trComp);
        }
        table.appendChild(tbody);
        // Add table to current node
        tableContainer.appendChild(table);
        node.style.background = "#343f41";
        node.appendChild(tableContainer);
        // Class Average
        var total = document.createElement(Template[5].tag);
        setHtml(5, total);
        total.innerHTML = "Class Average: " + (res.Aggregate / res.Students.length).toFixed(2);
        node.appendChild(total);
        // Add Event listeners on row collapse
        for (var comp = 1; comp <= res.Students.length; comp++) {
            window.jQuery(`#comp${comp}sem${currentSem}`).on('hide.bs.collapse', compEventListener.bind(null, 'hide', res.Students[comp - 1].EnrollmentNumber, comp));
            window.jQuery(`#comp${comp}sem${currentSem}`).on('show.bs.collapse', compEventListener.bind(null, 'show', res.Students[comp - 1].EnrollmentNumber, comp));
        }
    } catch (e) {
        console.log(e);
        var msg = document.createElement(Template[0].tag);
        setHtml(0, msg);
        msg.innerHTML = "An error occured.";
        node.appendChild(msg);
    }
    function setHeaders() {
        var headers = ["#", 'Compare', "Name", "Roll Number", "Aggregate"];
        for (let i = 0; i < headers.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = headers[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
    }
}

function rankTransferFailed(Sem) {
    var node = rankContainers[Sem];
    node.childNodes[1].style.animation = "fadeOut 1s";
    node.childNodes[1].style.opacity = 0;
    // Show error message
    var msg = document.createElement(Template[0].tag);
    setHtml(0, msg);
    msg.innerHTML = "An error occured.";
    node.appendChild(msg);
}

function addNameAndTables() {
    try {
        var student = JSON.parse(request.response);
        if (student.length === 0) {
            var msg = document.createElement(Template[0].tag);
            setHtml(0, msg);
            msg.innerHTML = "Sorry, no result found.";
            display.appendChild(msg);
            return;
        }
        currentRollNumber = student[0].EnrollmentNumber;

        // Name
        var name = document.createElement(Template[0].tag);
        setHtml(0, name);
        name.innerHTML = student[0].Name;
        display.appendChild(name);
        var tableEntries = ['Name', 'Internal', 'External', 'Total'];
        // Insert Dropdown
        var reContainer;
        addDropDownMenu(student);

        // Table
        for (let i = 0; i < student.length; i++) {
            // Container
            var div, id;
            if (student[i].Score !== '-') {
                div = document.createElement('div');
                id = 'sem' + parseInt(student[i].Semester);
            } else if (!reContainer) {
                reContainer = document.createElement('div');
                div = reContainer;
                div.style.display = "none";
                id = 'sem-';
                div.setAttribute("id", id);
            } else {
                let nextDiv = document.createElement('div');
                reContainer.appendChild(nextDiv);
                div = nextDiv;
                id = 'sem-';
            }
            if (id !== 'sem-') {
                div.setAttribute("id", id);
                div.style.display = "none";
            }
            // Sem
            var sem = document.createElement(Template[1].tag);
            setHtml(1, sem);
            sem.innerHTML = 'Sem ' + student[i].Semester;
            div.appendChild(sem);
            var reportButton = document.createElement(Template[25].tag);
            reportButton.setAttribute('id', 'reportButton' + student[i].Semester);
            setHtml(25, reportButton);
            reportButton.innerHTML = 'Report <i class="fa fa-download"></i>';
            reportButton.onclick = (e) => {
                semReport.call(null, request.response, student[i].Semester);
                e.srcElement.style.backgroundColor = '#d9534f';
                e.srcElement.style.color = '#fff';
            }
            div.appendChild(reportButton);

            // Table
            var tableContainer = document.createElement(Template[2].tag);
            setHtml(2, tableContainer);
            var table = document.createElement(Template[3].tag);
            setHtml(3, table);
            var thead = document.createElement("thead");
            var tbody = document.createElement("tbody");
            var tr = document.createElement("tr");
            setHeaders();
            // Start populating table
            for (let j = 0; j < student[i].Marks.length; j++) {
                tr = document.createElement("tr");
                var th = document.createElement("th");
                th.setAttribute("scope", "row");
                th.innerHTML = j + 1;
                tr.appendChild(th);
                for (let k = 0; k < 4; k++) {
                    var td = document.createElement("td");
                    td.innerHTML = student[i].Marks[j][tableEntries[k]];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            table.appendChild(tbody);
            // Add table to display
            tableContainer.appendChild(table);
            div.appendChild(tableContainer);
            // If regular, add footer
            if (student[i].Score !== '-') {
                var footer = document.createElement(Template[4].tag);
                setHtml(4, footer);
                var total = document.createElement(Template[5].tag);
                setHtml(5, total);
                total.innerHTML = "Aggregate: " + student[i].Score;
                footer.appendChild(total);
                var cgpa = document.createElement(Template[5].tag);
                setHtml(5, cgpa);
                cgpa.innerHTML = "Credit Percentage: " + student[i].Credit;
                footer.appendChild(cgpa);
                var hr = document.createElement(Template[6].tag);
                setHtml(6, hr);
                footer.appendChild(hr);
                div.appendChild(footer);
                // Insert rank container
                rankContainers[student[i].Semester] = document.createElement(Template[9].tag);
                rankData[student[i].Semester] = getRankData(i);
                setHtml(9, rankContainers[student[i].Semester]);
                var button = document.createElement(Template[10].tag);
                setHtml(10, button);
                button.innerHTML = "Class List";
                button.setAttribute("onclick", (function(Sem){return "getList("+Sem+")";})(student[i].Semester));
                rankContainers[student[i].Semester].appendChild(button);
                div.appendChild(rankContainers[student[i].Semester]);
            }
            div.appendChild(document.createElement("br"));
            div.appendChild(document.createElement("br"));
            if (id !== 'sem-') {
                display.appendChild(div);
            }
        }
        if (reContainer) {
            display.appendChild(reContainer);
        }
        dropMenuAction(latestResult);
    } catch (e) {
        console.log(e);
        var msg = document.createElement(Template[0].tag);
        setHtml(0, msg);
        msg.innerHTML = "An error occured.";
        display.appendChild(msg);
    }
    function setHeaders() {
        var headers = ["#", "Subject", "Internal", "External", "Total"];
        for (let i = 0; i < 5; i++) {
            var th = document.createElement("th");
            th.innerHTML = headers[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
    }
    function getRankData(i) {
        return {
            "Examination" : student[i].Examination,
            "Semester" : student[i].Semester,
            "Programme" : student[i].Programme,
            "Batch" : student[i].Batch,
            "CollegeCode" : student[i].CollegeCode
        }
    }
}

function addSummary() {
    var summary = makeSummary(request.response);
    display.appendChild(summary);
}

function setHtml(i, tag) {
    var keys = Object.keys(Template[i]);
    keys.forEach(function(key) {
        if (key !== 'tag') {
            tag.setAttribute(key, Template[i][key]);
        }
    });
}

function compEventListener(type, enrollmentNumber,  tagNum) {
    var tag = document.getElementById("compBtn" + tagNum + 'sem' + currentSem);
    if (type === 'show') {
        tag.setAttribute("class", "fa fa-minus-square");
        processComparison(tagNum, enrollmentNumber);
    } else {
        tag.setAttribute("class", "fa fa-plus-square");
    } 
}

function processComparison(tagNum, enrollmentNumber) {
    var div = document.getElementById('comp' + tagNum + 'sem' + currentSem);
    if (div.childNodes.length === 0) {
        // add progress bar
        addCompProgressBar(div);
        // fetch result
        createCompRequest(tagNum, enrollmentNumber);
    }
}

function createCompRequest(tagNum, enrollmentNumber) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", compTransferSuccess.bind(null, tagNum));
    request.addEventListener("error", compTransferFailed.bind(null, tagNum));
    request.open('GET', '/find/' + enrollmentNumber, true);
    request.send();
    function compTransferSuccess(tagNum) {
        // remove progress bar
        var compDiv = document.getElementById(`comp${tagNum}sem${currentSem}`); 
        var faCog = compDiv.childNodes[0];
        faCog.style.animation = 'fadeOut 1s';
        faCog.style.opacity = 0;        

        // Create table here
        var compTable = makeCompTable(request.response, currentSem, marksList[currentSem]);
        compTable.setAttribute("style", "animation: fadeIn 2s");
        // ---------------------------------------------

        setTimeout(function() {
            compDiv.insertBefore(compTable, faCog);
            compDiv.removeChild(faCog);
        }, 1000);
    }
    function compTransferFailed(tagNum) {
        // Implement comp fall
        console.log('Comp not successful!', tagNum);
    }
}

function addCompProgressBar(div) {
    var iTag = document.createElement(Template[17].tag);
    setHtml(17, iTag);
    div.appendChild(iTag);
}