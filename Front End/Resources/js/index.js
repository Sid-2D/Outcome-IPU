var display, request;

var tableTemplate = [
    // 0 h3 Name
    {
        "tag": "h3",
        "id": "Name",
        "style": "color: #999; animation: fadeIn 4s",
        "text": ""
    },
    // 1 h4 Sem
    {
        "tag": "h4",
        "id": "Sem",
        "style": "color:#999; animation: fadeIn 7s; text-align: left; margin-left: 5px",
        "text": ""
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
        "style": "color:#999; text-align: left; margin-left: 5px",
        "text": ""
    },
    // 6 hr
    {
        "tag": "hr",
        "style": "margin: 0px; background-color: #999; width: 100%;"
    },
    // 7 div progress
    {
        "tag": "div",
        "class": "progress"
    },
    // 8 div progress bar
    {
        "tag": "div",
        "id": "progressBar",
        "class": "progress-bar",
        "role": "progressbar",
        "aria-valuenow": "0",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        "style": "width: 70%"
    }
];

window.onload = function() {
    display = document.getElementById("Display");
    request = new XMLHttpRequest();
    request.addEventListener("progress", updateProgress);
    request.addEventListener("load", transferComplete);
    request.addEventListener("error", transferFailed);
}

function updateProgress() {
    
}

function transferComplete() {
    // Remove progress bar and add table
}

function transferFailed() {
    
}

function findResult() {
    // Initiate request and add progress bar
}