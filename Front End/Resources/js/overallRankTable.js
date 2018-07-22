var Template = require('./template.js');

function overallRankTable(data, roll, cb) {
	data = sortAndFilterData(data);

	var container = document.createElement('div');
	container.style.background = '#343F41';
	container.innerHTML = "<br>"
    // Make fixed banner
    var banner = document.createElement(Template[0].tag);
    setHtml(0, banner);
    banner.style.color = '#999';
    banner.style.fontSize = '24px';
    banner.innerHTML = `&nbsp;Batch ${data._id.Batch}`;
    container.appendChild(banner);

	var tableEntries = ['Name', 'EnrollmentNumber', 'Average'];
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
	for (let i = 0; i < data.Students.length; i++) {
	    if (data.Students[i].Scores > 100) {
	        continue;
	    } else {
	        startPos = i;
	        break;
	    }
	}
	// Start populating table
	for (let i = 0; i < data.Students.length; i++) {
        tr = document.createElement('tr');
        var th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerHTML = i + 1;
        tr.appendChild(th);
        for (let k = 0; k < 3; k++) {
            var td = document.createElement('td');
            if (k == 2) {
            	let average = data.Students[i][tableEntries[k]];
            	td.innerHTML = average.toFixed(2);	
            } else  {
	            td.innerHTML = data.Students[i][tableEntries[k]];
            }
            if (data.Students[i]['EnrollmentNumber'] === roll) {
            	tr.style.background = '#999';
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	// Add table to current container
	tableContainer.appendChild(table);
	container.appendChild(tableContainer);
	cb(container);

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

module.exports = overallRankTable;

// ---------------------------------------
function setHtml(i, tag) {
    var keys = Object.keys(Template[i]);
    keys.forEach(function(key) {
        if (key !== 'tag') {           
        	tag.setAttribute(key, Template[i][key]);
        }
    });
}

function sortAndFilterData(data) {
	data = JSON.parse(data);
	data.Students.sort((x, y) => y.Average - x.Average);
	let maxSems = 0;
	for (let i = 0; i < data.Students.length; i++) {
		if (data.Students[i].Semesters > maxSems) {
			maxSems = data.Students[i].Semesters;
		}
	}
	data.Students = data.Students.filter(student => {
		if (student.Semesters < maxSems - 2) {
			return false;
		}
		return true;
	});
	return data;
}