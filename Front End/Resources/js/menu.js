window.addEventListener('popstate', e => {
	// console.log(e.state)
	if (e.state === null) {
		reloadIntros();
	} else if (e.state.type === 'overlay') {
	    // console.log(JSON.stringify(e.state));
	    // console.log(`overlay-${e.state.name}`);
	    document.getElementById(`overlay-${e.state.name}`).style.width = "0%";
	} else if (e.state.type === 'menu') {
		document.getElementById('sidebar-menu').style.width = '0';
	}
    window.ga('set', 'page', location.pathname);
    window.ga('send', 'pageview');
});

function overlayIn(option, mini) {
    var stateObj = { name: option, type: 'overlay' };
    window.history.replaceState(stateObj, { home: true }, null);
	if (mini) {
		// console.log(Math.max(parseInt(window.innerWidth * 0.6), 250) + 'px')
	    document.getElementById(`overlay-${option}`).style.width = Math.max(parseInt(window.innerWidth * 0.6), 250) + 'px';
	    window.history.pushState(stateObj, { home: false }, /menu/ + option);
	    window.ga('set', 'page', '/menu/' + option);
	    window.ga('send', 'pageview');
	} else {
	    document.getElementById(`overlay-${option}`).style.width = "100%";
	    window.history.pushState(stateObj, { home: false }, option);
	    window.ga('set', 'page', '/' + option);
	    window.ga('send', 'pageview');
	}
}

function overlayOut(option) {
    window.history.back();
}

let once = true
function fixResultHistory(roll) {
	if (once) {
	    window.history.replaceState(null, { home: true }, '');
	    window.history.pushState({ type: 'result' }, { home: false }, 'result');
		window.ga('set', 'page', '/result');
	    window.ga('send', 'pageview');
		once = false;
	}
}

function setRankHistory() {
    window.history.replaceState({ type: 'result' }, { home: false }, 'rank');
	window.ga('set', 'page', '/rank');
    window.ga('send', 'pageview');
}

function openSideBar() {
	document.getElementById('sidebar-menu').style.width = '250px';
	var stateObj = { type: 'menu' };
    window.history.replaceState(stateObj, { home: true }, null);
    window.history.pushState(stateObj, { home: false }, 'menu');
    window.ga('set', 'page', '/menu');
    window.ga('send', 'pageview');
}

function closeSideBar() {
    window.history.back();
}

module.exports = {fixResultHistory, overlayIn, overlayOut, closeSideBar, setRankHistory, openSideBar};

// -----------------Helpers---------------------

function reloadIntros() {
	document.getElementById('Display').innerHTML = require('./intro.js');
	once = true;
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