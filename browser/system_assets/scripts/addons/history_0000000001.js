
var history_00000000001 = {
	Load : function(){	
		var HistDiv = document.createElement('div');
		HistDiv.setAttribute("class","HistDiv");
		
		var HistItems = History.List();	
		if (!Array.isArray(HistItems) || !HistItems.length) {
			//no items
			var NoItems = document.createElement('h3');
			NoItems.appendChild(document.createTextNode("No History :("));
			HistDiv.appendChild(NoItems);
		}else{	
			HistItems = HistItems.reverse();		
			var i,len;
			
			var HistDdl = document.createElement('select');
			HistDdl.setAttribute("class","ddl");
			HistDdl.setAttribute("onchange","history_00000000001.SwitchDate(this.value);");
			
			var HistList = document.createElement('div');
			HistList.setAttribute("id","History_0000000001_HistList");
			HistList.setAttribute("class","HistList");
			
			for (i = 0, len = HistItems.length; i < len; i++) {	
				//For each day in history
				var ThisItem = HistItems[i];
				var DayItem = document.createElement('option');
				DayItem.setAttribute("value",ThisItem.date);
				DayItem.appendChild(document.createTextNode(ThisItem.date));
				
				if(i == (HistItems.length -1)){
					//Last items - load this history
					DayItem.setAttribute("selected","selected");
					var b,leb;
					for (var b = 0, leb = ThisItem.items.length; b < leb; b++) {
						var HistItem = ThisItem.items[b];
						HistList.appendChild(history_00000000001.CreateListItem(HistItem.name,HistItem.url,HistItem.time,HistItem.fav));
					}
				}			
				HistDdl.appendChild(DayItem);
			}	
			
			HistDiv.appendChild(HistDdl);
			HistDiv.appendChild(HistList);
		}	
		return HistDiv;
	},
	CreateListItem: function(Name,URL,Time,Fav){
		var days = ["Sunday","Monday","Tuesday","Wedneday","Thursday","Friday","Saturday"]
		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	
		var QuickFav = document.createElement('img');
		var QuickItem = document.createElement('p');
		var QuickLink = document.createElement('a');		
		QuickLink.appendChild(document.createTextNode(Name));
		QuickLink.setAttribute("href","javascript:currenttab.Navigate('"+URL+"');");
	
		QuickFav.src = Fav;
	
		QuickItem.appendChild(document.createTextNode(Time+ " - "));
		QuickItem.appendChild(QuickFav);
		QuickItem.appendChild(QuickLink);

		return QuickItem;
	},
	SwitchDate: function(date){		
		var Items = History.GetItems(date);
		var b,leb;
		var HistList = document.getElementById("History_0000000001_HistList");
		
		while (HistList.firstChild) {
			HistList.removeChild(HistList.firstChild);
		}
		
		for (b = 0, leb = Items.length; b < leb; b++) {
			var HistItem = Items[b];
			HistList.appendChild(history_00000000001.CreateListItem(HistItem.name,HistItem.url,HistItem.time,HistItem.fav));
		}
		
	}
}
