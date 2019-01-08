
var settings_0000000001 = {
	Load: function(){
		//Main Outer
		var outer_div = document.createElement('div');
		outer_div.setAttribute("class","SettingsList");

		//Themes settings
		//var Themes_Header = document.createElement('p');
		//Themes_Header.appendChild(document.createTextNode("Themes"));

		//var Themes_Form =document.createElement('form');
		//var Themes_Select =document.createElement('select');
		//Themes_Select.setAttribute('class',"ddl");
		//Themes_Select.setAttribute('onchange',"Themes.Load(this.value)");

		//var ThemesList = Themes.List();
		//var c,leg;
		//for (c = 0, leg = ThemesList.length; c < leg; c++) {
		//	var ThisTheme = ThemesList[c];
		//	var ThemeItem = document.createElement('option');
		//	ThemeItem.setAttribute('value',ThisTheme.src);
			//ThemeItem.setAttribute('style','backgroundColor:'+ThisTheme.basecolour);
		//	ThemeItem.appendChild(document.createTextNode(ThisTheme.name));
		//	if(ThisTheme.src == UserPref.GetTheme()){ThemeItem.setAttribute('selected','selected');}

		//	Themes_Select.appendChild(ThemeItem);
		//}
		//Themes_Form.appendChild(Themes_Select);

		//On Load
		var Load_Header = document.createElement('p');
		Load_Header.appendChild(document.createTextNode("When browser opens"));

		var Load_Form =document.createElement('form');

		var Div_LoadDefault = document.createElement('div');
		Div_LoadDefault.setAttribute('class','RadioBtnDiv');
		var IP_LoadDefault = document.createElement('input');
		IP_LoadDefault.setAttribute('type','radio');
		IP_LoadDefault.setAttribute('id','Rad_LoadDefault');
		IP_LoadDefault.setAttribute('name','LoadSettings');
		IP_LoadDefault.setAttribute('value','default');
		IP_LoadDefault.setAttribute('onclick','Settings.Set("Launch",this.value,function(){});');
		var Lbl_LoadDefault = document.createElement('label');
		var Sp_Default = document.createElement('span');
		Lbl_LoadDefault.setAttribute('for','Rad_LoadDefault');
		Lbl_LoadDefault.appendChild(Sp_Default);
		Lbl_LoadDefault.appendChild(document.createTextNode("Continue where you left off"));

		Div_LoadDefault.appendChild(IP_LoadDefault);
		Div_LoadDefault.appendChild(Lbl_LoadDefault);

		var Div_LoadNew = document.createElement('div');
		Div_LoadNew.setAttribute('class','RadioBtnDiv');
		var IP_LoadNew = document.createElement('input');
		IP_LoadNew.setAttribute('type','radio');
		IP_LoadNew.setAttribute('id','Rad_LoadNew');
		IP_LoadNew.setAttribute('name','LoadSettings');
		IP_LoadNew.setAttribute('value','fresh');
		IP_LoadNew.setAttribute('onclick','Settings.Set("Launch",this.value,function(){});');
		var Lbl_LoadNew = document.createElement('label');
		var Sp_New = document.createElement('span');
		Lbl_LoadNew.appendChild(Sp_New);
		Lbl_LoadNew.appendChild(document.createTextNode("Start Fresh"));
		Lbl_LoadNew.setAttribute('for','Rad_LoadNew');
		Div_LoadNew.appendChild(IP_LoadNew);
		Div_LoadNew.appendChild(Lbl_LoadNew);

		Settings.Get("Launch",function(item){
			if(item != undefined){
				if(item.value == "fresh"){
					IP_LoadNew.setAttribute("checked","checked");
				}else{
					IP_LoadDefault.setAttribute("checked","checked");
				}
			}else{
				IP_LoadDefault.setAttribute("checked","checked");
			}
		});

		Load_Form.appendChild(Div_LoadDefault);
		Load_Form.appendChild(Div_LoadNew);

		//Home Page Settings
		var Home_Header = document.createElement('p');
		Home_Header.appendChild(document.createTextNode("Homepage"));

		var Home_Form =document.createElement('form');

		var Input2_Text = document.createElement('input');
		Input2_Text.setAttribute('type',"text");
		Input2_Text.setAttribute('name',"HomePage");
		Settings.Get("Home",function(item){
			if(item != undefined){
				Input2_Text.setAttribute('value',item.value);
			}else{
				Input2_Text.setAttribute('value','default');
			}
		});
		Input2_Text.setAttribute('class',"txtbox");
		Input2_Text.setAttribute('onchange',"Settings.Set('Home',this.value,function(){});");

		var SetHome_Default = document.createElement('a');
		SetHome_Default.setAttribute('class',"smalllink");
		SetHome_Default.setAttribute('href',"javascript:Settings.Set('Home','default',function(){});");
		SetHome_Default.appendChild(document.createTextNode("Set default"));

		//Home Page Form Creation
		Home_Form.appendChild(Input2_Text);
		Home_Form.appendChild(SetHome_Default);

		//Search Settings
		var Settings_Header = document.createElement('p');
		Settings_Header.appendChild(document.createTextNode("Search"));

		var Settings_Form =document.createElement('form');

		var Search_Input1 =document.createElement('select');
		Search_Input1.setAttribute('id',"Settings_Search");
		Search_Input1.setAttribute('class',"ddl");
		Search_Input1.setAttribute('onchange',"Settings.Set('Search',this.value,function(){})");

		var Searches =[{Name:'Google' ,URL:'https://www.google.co.uk/search?q='},{Name:'Yahoo',URL:'https://search.yahoo.com/search;?p='},{Name:'Bing',URL:'http://www.bing.com/search?go=Submit&q='},{Name:'Duck duck go',URL:'https://duckduckgo.com/?t=h_&q='}];
		var i,len;
		for (i = 0, len = Searches.length; i < len; i++) {
			var SOption = Searches[i];
			var Search_Option =document.createElement('option');
			Search_Option.setAttribute('value',SOption.URL);
			Search_Option.appendChild(document.createTextNode(SOption.Name));
			Settings.Get("Search",function(item){
				if(item != undefined){
					if(SOption.URL == item.value){
						Search_Option.setAttribute('selected','selected');
					}
				}
			});
			Search_Input1.appendChild(Search_Option);
		}

		Settings_Form.appendChild(Search_Input1);

		//Final Assembly
		//Themes
		//outer_div.appendChild(Themes_Header);
		//outer_div.appendChild(Themes_Form);

		//Onload setting
		outer_div.appendChild(Load_Header);
		outer_div.appendChild(Load_Form);

		//Home Page
		outer_div.appendChild(Home_Header);
		outer_div.appendChild(Home_Form);

		//Search
		outer_div.appendChild(Settings_Header);
		outer_div.appendChild(Settings_Form);


		return outer_div;
	}
}
