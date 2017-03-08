var display, request, progressBar;
var Template = [
    // 0 h3 Name
    {
        "tag": "h3",
        "id": "Name",
        "style": "color: #999; animation: fadeIn 4s"
    },
    // 1 h4 Sem
    {
        "tag": "h4",
        "id": "Sem",
        "style": "color:#999; animation: fadeIn 7s; text-align: left; margin-left: 5px"
    },
    // 2 div-table
    {
        "tag": "div",
        "class": "table-responsive"
    },
    // 3 table
    {
        "tag": "table",
        "class": "table",
        "style": "color: #fff; animation: fadeIn 10s"
    },
    // 4 div resultFooter
    {
        "tag": "div",
        "id": "resultFooter",
        "style": "animation: fadeIn 7s;"
    },
    // 5 h4 Total
    {
        "tag": "h4",
        "id": "Total",
        "style": "color:#999; text-align: left; margin-left: 5px"
    },
    // 6 hr
    {
        "tag": "hr",
        "style": "margin: 0px; background-color: #999; width: 100%;"
    },
    // 7 div progress container
    {
        "tag": "div",
        "class": "load-3",
        "style": "animation: fadeIn 1s; z-index: -1"
    },
    // 8 div progress lines
    {
        "tag": "div",
        "class": "line"
    }
];

window.onload = function() {
    display = document.getElementById("Display");
    request = new XMLHttpRequest();
    request.addEventListener("load", transferComplete);
    request.addEventListener("error", transferFailed);
}

function transferComplete() {
    removeProgressBar(); 
    addNameAndTables();
}

function transferFailed() {
    
}

function findResult() {
    // Initiate request and add progress bar
    var roll = document.getElementById('rollNumber').value;
    addProgressBar();
    request.open('GET', '/' + roll, true);
    request.send();
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

function removeProgressBar() {
    progressBar.style.animation = "fadeOut 1s";
    progressBar.style.opacity = 0;
}

function addNameAndTables() {
    var student = JSON.parse(request.response);
    // Name
    var name = document.createElement(Template[0].tag);
    setHtml(0, name);
    name.innerHTML = student[0].Name;
    display.appendChild(name);
    var tableEntries = ['Name', 'Internal', 'External', 'Total'];
    // Table
    for (let i = 0; i < student.length; i++) {
        // Sem
        var sem = document.createElement(Template[1].tag);
        setHtml(1, sem);
        sem.innerHTML = 'Sem ' + student[i].Semester;
        display.appendChild(sem);
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
        var totalMarks = 0;
        for (let j = 0; j < student[i].Marks.length; j++) {
            tr = document.createElement("tr");
            var th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.innerHTML = j + 1;
            tr.appendChild(th);
            totalMarks += parseInt(student[i].Marks[j].Total);
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
        display.appendChild(tableContainer);
        // If regular, add footer
        if (/regular/gi.test(student[i].Examination)) {
            var footer = document.createElement(Template[4].tag);
            setHtml(4, footer);
            var total = document.createElement(Template[5].tag);
            setHtml(5, total);
            total.innerHTML = "Aggregate: " + totalMarks / student[i].Marks.length;
            footer.appendChild(total);
            var hr = document.createElement(Template[6].tag);
            setHtml(6, hr);
            footer.appendChild(hr);
            display.appendChild(footer);
        }
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
}

function setHtml(i, tag) {
    var keys = Object.keys(Template[i]);
    keys.forEach(function(key) {
        if (key !== 'tag') {
            tag.setAttribute(key, Template[i][key]);
        }
    });
}