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
    var startPos = 0;
    for (let i = 0; i < rankData.Students.length; i++) {
        if (rankData.Students[i].Scores > 100) {
            continue;
        } else {
            startPos = i;
            break;
        }
    }
    // Start populating table
    for (let i = startPos; i <= rankData.Students.length; i += 10) {
        setTimeout(addTen.bind(null, i), 150 + i * 5);
        function addTen(i) {
            for (let j = i; j < i + Math.min(rankData.Students.length - i, 10); j++) {
                tr = document.createElement('tr');
                tr.setAttribute('id', 'roll-' + rankData.Students[j][tableEntries[1]]);
                var th = document.createElement('th');
                th.setAttribute('scope', 'row');
                th.innerHTML = j + 1 - startPos;
                tr.appendChild(th);
                for (let k = 0; k < 3; k++) {
                    var td = document.createElement('td');
                    td.innerHTML = rankData.Students[j][tableEntries[k]];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
                if (j >= rankData.Students.length - 1 - startPos) {
                    document.querySelector('#control-panel #reload').style.display = 'none';
                }
            }
        }
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
    var request = new XMLHttpRequest();
    var rankDisplay = document.querySelector('.overlay-content-list');
    rankDisplay.innerHTML = '';
    // Create rank request
    request.addEventListener("load", rankTransferComplete.bind(null, request));
    request.addEventListener("error", rankTransferFailed.bind(null));
    request.open('POST', '/university-rank', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (body['subject'].length > 6) {
        body['subject'] = body['subject'].substr(6, 3);
    }
    delete body['CollegeCode'];
    request.send(JSON.stringify(body));
    document.querySelector('#control-panel #reload').style.display = '';

    function rankTransferComplete(req) {
        var data = JSON.parse(req.response);
        rankDisplay.appendChild(createRankTable(data));
    }

    function rankTransferFailed() {

    }
}

window.rankListSearch = () => {
    var query = document.getElementById('rankListQuery').value;
    var row = document.querySelector(`#overlay-list #roll-${query}`);
    if (row) {
        // Scroll particular row in view
        row.scrollIntoView();
        var overlayList = document.querySelector(`#overlay-list`);
        if ((overlayList.scrollHeight - overlayList.scrollTop) > (window.innerHeight)) {
            overlayList.scrollTop -= 75;
        }
        row.style.animation = 'flicker 2s';
        setTimeout(() => {
            row.style.animation = '';
        }, 2000);
    } else {
        // Do something
    }
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