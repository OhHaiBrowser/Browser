const title = document.getElementById('title'),
	info = document.getElementById('info'),
	moreHelp = document.getElementById('moreHelp'),
	errorDesc = document.getElementById('errorDesc'),
	button = document.getElementById('button');

const urlParams = new URLSearchParams(window.location.search);
const errorCode = urlParams.get('code');
const errorUrl = urlParams.get('url');

var origin = errorUrl.slice(0, errorUrl.length - 1);
        
// strip protocol
if (origin.startsWith('https://')) {
	origin = origin.slice(8);
} else if (origin.startsWith('http://')) {
	origin = origin.slice(7);
}

moreHelp.textContent = '';
errorDesc.textContent = '';

switch (errorCode) {
case -106:
	title.textContent = 'No internet connection';
	info.textContent = '<p>Your computer is not connected to the internet.</p><p>Try:</p><ul><li>Resetting your Wi-Fi connection<li>Checking your router and modem.</li></ul>';
	break;
case -105:
	info.textContent = `<p>Couldn’t resolve the DNS address for <strong>${origin}</strong></p>`;
	break;
case -501:
	title.textContent = 'Your connection is not secure';
	info.textContent = `<p>Beaker cannot establish a secure connection to the server for <strong>${origin}</strong>.</p>`;
	button.href = 'javascript:window.history.back()';
	button.textContent = 'Go back';
	break;
}



