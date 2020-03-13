var Popup_webview = document.getElementById('popupwebview');
var Btn_Refresh = document.getElementById('Refresh');
var Txt_URL = document.getElementById('URLBar');
var Pan_Cert = document.getElementById('SecureCheck');

var RunDir = decodeURI('file://' + __dirname).replace(/\\/g, '/');


var Page2Load = getParameterByName('url',window.location.href);
Popup_webview.setAttribute('src',Page2Load);

Btn_Refresh.addEventListener('click', function() {
	Popup_webview.reload();
});


Popup_webview.addEventListener('did-start-loading', function() {
	Pan_Cert.classList.add('Loading');
});

Popup_webview.addEventListener('did-stop-loading', function() {
	domloaded(Popup_webview);
});


Popup_webview.addEventListener('dom-ready', function() {
	domloaded(Popup_webview);

	var webviewcontent = Popup_webview.getWebContents();	
	webviewcontent.on('context-menu', (e, params) => {
		e.preventDefault();
		var WbMen = WebView_menu(Popup_webview,webviewcontent,params);
		WbMen.popup(remote.getCurrentWindow());
	});
});


function domloaded(webview){

	var CurrentURL = decodeURI(webview.getURL());
	var isInternalPage = CurrentURL.indexOf(RunDir) !== -1;
	if (!isInternalPage){
		ProtcolCheck(webview);
		Txt_URL.value = webview.getURL();
	}else{
		Pan_Cert.className = 'DoubleURLBtn Internal';
		Txt_URL.value = '';
	}

	Pan_Cert.classList.remove('Loading');
}


function ProtcolCheck(webview){
	var webviewcontent = webview.getWebContents();	
	var CurrentURL = decodeURI(webview.getURL());

	if(CurrentURL.includes('http://')){
		Pan_Cert.className = 'DoubleURLBtn Http';
	}else if(CurrentURL.includes('https://')){
		Pan_Cert.className = 'DoubleURLBtn Https';
	}else{
		Pan_Cert.className = 'DoubleURLBtn';
	}

	webviewcontent.on('certificate-error', (e, url,error,cert) => {
		Pan_Cert.className = 'DoubleURLBtn CirtError';
	});


}




function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}