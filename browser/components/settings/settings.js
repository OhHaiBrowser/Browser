var {Settings} = require('../../system_assets/modules/OhHaiBrowser.Data');
var core = require('../../system_assets/modules/OhHaiBrowser.Core');

module.exports = function load(){

	let settingsMenu = core.generateElement(`
		<div class='SettingsList'>
			<p>When browser opens</p>
			<form>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_LoadDefault' name='LoadSettings' value='default'/>
					<label for='Rad_LoadDefault'>Continue where you left off</label>
				</div>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_LoadNew' name='LoadSettings' value='fresh'/>
					<label for='Rad_LoadNew'>Start Fresh</label>
				</div>
			</form>
			<p>Homepage</p>
			<form>
				<input type='text' name='Homepage' class='txtbox' id='Txt_Homepage'/>
				<a class='smalllink' id='A_DefaultHome'>Set default</a>
			</form>
			<p>Search</p>
			<form>
				<select id='Settings_Search' class='ddl'>
				</select>
			</form>
			<!--<p>Block Adverts? (Beta)</p>
			<form>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_AdBlockYes' name='AdBlock' value='true'/>
					<label for='Rad_AdBlockYes'>Yes</label>
				</div>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_AdBlockNo' name='AdBlock' value='false'/>
					<label for='Rad_AdBlockNo'>No</label>
				</div>
			</form>
			<p>Block Trackers? (Beta)</p>
			<form>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_TrackBlockYes' name='TrackBlock' value='true'/>
					<label for='Rad_TrackBlockYes'>Yes</label>
				</div>
				<div class='RadioBtnDiv'>
					<input type='radio' id='Rad_TrackBlockNo' name='TrackBlock' value='false'/>
					<label for='Rad_TrackBlockNo'>No</label>
				</div>
			</form>-->
		</div>
		`);

	// On Load functions
	var IP_LoadDefault = settingsMenu.querySelector('#Rad_LoadDefault');
	IP_LoadDefault.addEventListener('click',()=>{
		Settings.Set('Launch',IP_LoadDefault.value);
	});
	var IP_LoadNew = settingsMenu.querySelector('#Rad_LoadNew');
	IP_LoadNew.addEventListener('click',()=>{
		Settings.Set('Launch',IP_LoadNew.value);
	});

	Settings.Get('Launch').then((item) => {
		if(item.value == 'fresh'){
			IP_LoadNew.setAttribute('checked','checked');
		}else{
			IP_LoadDefault.setAttribute('checked','checked');
		}
	}).catch(() => {
		IP_LoadDefault.setAttribute('checked','checked');
	});

	// Home Page functions
	var Input2_Text = settingsMenu.querySelector('#Txt_Homepage');
	Input2_Text.setAttribute('onchange','Settings.Set(\'Home\',this.value);');
	var SetHome_Default = settingsMenu.querySelector('#A_DefaultHome');
	SetHome_Default.setAttribute('href','javascript:Settings.Set(\'Home\',\'default\');');

	Settings.Get('Home').then((item) => {
		Input2_Text.setAttribute('value',item.value);
	}).catch(() => {
		Input2_Text.setAttribute('value','default');
	});

	// Search functions
	var Search_Input1 = settingsMenu.querySelector('#Settings_Search');
	Search_Input1.addEventListener('change',()=>{
		Settings.Set('Search',Search_Input1.value);
	});

	var Searches =[{Name:'Google' ,URL:'https://www.google.co.uk/search?q='},{Name:'Yahoo',URL:'https://search.yahoo.com/search;?p='},{Name:'Bing',URL:'http://www.bing.com/search?go=Submit&q='},{Name:'Duck duck go',URL:'https://duckduckgo.com/?t=h_&q='}];
	Searches.forEach((item) => {
		let Search_Option = core.generateElement(`
			<option value='${item.URL}'>${item.Name}</option>
		`);
		Settings.Get('Search').then((sitem) => {
			if(item.URL == sitem.value){
				Search_Option.setAttribute('selected','selected');
			}
		});
		Search_Input1.appendChild(Search_Option);
	});
		
	// Adblocker functions
	//var IP_AdBlockYes =	settingsMenu.querySelector('#Rad_AdBlockYes');
	//IP_AdBlockYes.setAttribute('onclick','Settings.Set("adBlock",this.value);');

	//var IP_AdBlockNo = settingsMenu.querySelector('#Rad_AdBlockNo');
	//IP_AdBlockNo.setAttribute('onclick','Settings.Set("adBlock",this.value);');

	//Settings.Get('adBlock',function(item){
	//	if(item != undefined){
	//		if(item.value == 'true'){
	//			IP_AdBlockYes.setAttribute('checked','checked');
	//		}else{
	//			IP_AdBlockNo.setAttribute('checked','checked');
	//		}
	//	}else{
	//		IP_AdBlockNo.setAttribute('checked','checked');
	//	}
	//});

	
	//var IP_TrackBlockYes = settingsMenu.querySelector('#Rad_TrackBlockYes');
	//IP_TrackBlockYes.setAttribute('onclick','Settings.Set("trackBlock",this.value);');
		
	//var IP_TrackBlockNo = settingsMenu.querySelector('#Rad_TrackBlockNo');
	//IP_TrackBlockNo.setAttribute('onclick','Settings.Set("trackBlock",this.value);');

	//Settings.Get("trackBlock",function(item){
	//	if(item != undefined){
	//		if(item.value == "true"){
	//			IP_TrackBlockYes.setAttribute("checked","checked");
	//		}else{
	//			IP_TrackBlockNo.setAttribute("checked","checked");
	//		}
	//	}else{
	//		IP_TrackBlockNo.setAttribute("checked","checked");
	//	}
	//});

	return settingsMenu;
};