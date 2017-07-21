var Template = require('./template.js');

function makeCompTable(response, sem, master) {
    var student = JSON.parse(response);
    for (var i = 0; i < student.length; i++) {
        if (student[i].Semester === '0' + sem) {
            student = student[i];
            break;
        }
    }
    var div = document.createElement("div");
    var tableEntries = ['Internal', 'External', 'Total'];
    // Table
    var tableContainer = document.createElement(Template[2].tag);
    setHtml(2, tableContainer);
    var table = document.createElement(Template[18].tag);
    setHtml(18, table);
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var tr = document.createElement("tr");
    setHeaders();
    // Start populating table
    for (let j = 0; j < student.Marks.length; j++) {
        tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("scope", "row");
        td.innerHTML = student.Marks[j]['Name'];
        td.style.maxWidth = "150px";
        td.style.wordWrap = 'break-word';
        tr.appendChild(td);
        for (let k = 0; k < tableEntries.length; k++) {
            td = document.createElement("td");
            td.innerHTML = student.Marks[j][tableEntries[k]];
            td.innerHTML += ' ';
            var diff = parseInt(master[j][tableEntries[k]]) - parseInt(student.Marks[j][tableEntries[k]]);
            if (!diff) {
                diff = parseInt(master[j][tableEntries[k]]);
                if (!diff) {
                    diff = -1 * parseInt(student.Marks[j][tableEntries[k]]);
                }
            }
            // Handle absent condition
            if (diff >= 0) {
                // insert up chevron
                var up = document.createElement(Template[19].tag);
                setHtml(19, up);
                up.innerHTML = Math.abs(diff);
                td.appendChild(up);
            } else {
                // insert down chevron
                var down = document.createElement(Template[20].tag);
                setHtml(20, down);
                down.innerHTML = Math.abs(diff);
                td.appendChild(down);
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    // Add table to display
    tableContainer.appendChild(table);
    div.appendChild(tableContainer);
    // Add footer
    var footer = document.createElement(Template[4].tag);
    setHtml(4, footer);
    var total = document.createElement(Template[5].tag);
    setHtml(5, total);
    var difference = Number(master[master.length - 1]) - Number(student.Score); 
    var chevron;
    if (difference >= 0) {
        // Up chevron and limit decimal
        chevron = document.createElement(Template[19].tag);
        setHtml(19, chevron);
    } else {
        // down chevron and limit decimal
        chevron = document.createElement(Template[20].tag);
        setHtml(20, chevron);
    }
    chevron.style.fontSize = "20px";
    chevron.innerHTML = Math.abs(difference.toFixed(2));
    total.innerHTML = "Aggregate: " + student.Score + " ";
    total.appendChild(chevron);
    footer.appendChild(total);
    div.appendChild(footer);
    return div;
    function setHeaders() {
        var headers = ["Subject", "Internal", "External", "Total"];
        for (let i = 0; i < headers.length; i++) {
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

module.exports = makeCompTable;