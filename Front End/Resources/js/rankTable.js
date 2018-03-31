var Template = require('./template.js');

function createRankTable(rankData) {
    var container = document.createElement('div');

    // Make fixed banner
    var banner = document.createElement(Template[0].tag);
    setHtml(0, banner);
    banner.style.animation = 'initial';
    banner.style.fontSize = '24px';
    banner.innerHTML = `Batch ${rankData._id.Batch}, Sem ${rankData._id.Semester}`;
    container.appendChild(banner);

    var tableEntries = ['Name', 'EnrollmentNumber', 'Scores'];
    // Table
    var tableContainer = document.createElement(Template[2].tag);
    setHtml(2, tableContainer);
    // tableContainer.style.backgroundColor = '#111';
    var table = document.createElement(Template[3].tag);
    setHtml(3, table);
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    setHeaders();
    // Start populating table
    for (let j = 0; j < rankData.Students.length; j++) {
        tr = document.createElement('tr');
        var th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerHTML = j + 1;
        tr.appendChild(th);
        for (let k = 0; k < 3; k++) {
            var td = document.createElement('td');
            td.innerHTML = rankData.Students[j][tableEntries[k]];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    // Add table to current container
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);

    // Class Average
    // var total = document.createElement(Template[5].tag);
    // setHtml(5, total);
    // total.innerHTML = "Class Average: " + (rankData.Aggregate / rankData.Students.length).toFixed(2);
    // container.appendChild(total);

    return container;

    function setHeaders() {
        var headers = ["#", "Name", "Roll Number", "Score"];
        for (let i = 0; i < headers.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = headers[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
    }
}

function fillRankData(body) {
    var rankDisplay = document.querySelector('.overlay-content-list');
    rankDisplay.appendChild(createRankTable(data));
}

module.exports = fillRankData

/* ----------------Helpers--------------- */

function setHtml(i, tag) {
    var keys = Object.keys(Template[i]);
    keys.forEach(function(key) {
        if (key !== 'tag') {
            tag.setAttribute(key, Template[i][key]);
        }
    });
}