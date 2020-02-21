var Dexie = require('dexie');
const db = new Dexie('ohhai_browser_db');
//Version 1
db.version(1).stores({
	quicklinks: '++id,&url, title, icon, text, desc, timestamp',
	history: '++id,url, title, icon, visitCount, lastVisit,parentSite, extraData,timestamp',
	settings: '&name,value',
	firstrun: 'run,timestamp',
	currentsession: '&sessionid,url,title,mode,parent,timestamp',
	browser_groups: '&groupid,name,timestamp'
});
//Version 2
db.version(2).stores({
	currentsession: '&sessionid, url, icon, title, mode, parent, timestamp',
	firstrun: null
});
db.open().then(function () {}).catch(function (err) { console.warn('database error occured', err); });

//===== Quicklink functions ====================================================
module.exports.Quicklinks = {
	List: () => {
		return new Promise((resolve) => {
			db.quicklinks.toArray((arry) => {
				resolve(arry);
			});
		});
	},
	Add: (u, t, i, ut, d) => {
		return new Promise((resolve, reject) => {
			db.quicklinks.add({url: u, title: t, icon: i,text: ut,desc: d, timestamp: Date.now()}).then((newqlink) => {
				var ReturnVal = ((newqlink != 0 || -1) ? newqlink : null);
				if (ReturnVal != null) {
					resolve(ReturnVal);
				} else {
					reject('error');
				}
			});
		});
	},
	Remove: (i) => {
		return new Promise((resolve, reject) => {
			db.quicklinks.where('id').equals(i).delete().then((recordsdeleted) => {
				if (recordsdeleted != 0 || undefined) {
					resolve();
				} else {
					reject(false);
				}
			});
		});
		
	},
	IsBookmarked: (url) => {
		return new Promise((resolve, reject) => {
			db.quicklinks.where('url').equals(url).first((item) => {
				if (item != undefined) {
					resolve(item.id);
				} else {
					reject('no item');
				}
			});
		});
	}
};
  
//===== History functions ======================================================
module.exports.History = {
	List: () => {
		return new Promise((resolve) => {
			db.history.reverse().toArray((arry) => {
				resolve(arry);
			});
		});
	},
	ListMostViewed: () => {
		return new Promise((resolve) => {
			db.history.orderBy('parentSite').limit(9).uniqueKeys((items) => {
				resolve(items);
			});
		});
	},
	GetItemByID: (id) => {
		return new Promise((resolve) => {
			db.history.where('parentSite').equals(id).first((item) => {
				resolve(item);
			});
		});
	},
	Add: function(u,t,i,ps){
		return new Promise((resolve, reject) => {
			db.history.add({url: u, title: t, icon: i,visitCount: 1,lastVisit: Date.now(),parentSite: ps,extraData:'',timestamp: Date.now() }).then(function(){
				resolve();
			}).catch(function(error){
				reject(error);
			});
		});
	},
	GetLastItem: () => {
		return new Promise((resolve, reject) => {
			db.history.orderBy('timestamp').last((lastitem) => {
				if(lastitem != undefined){
					resolve(lastitem);
				} else {
					reject('no item found');
				}
			});
		});
	},
	Clear: () => {
		return new Promise((resolve) => {
			db.history.clear().then(() => {
				resolve();
			});
		});
	}
};
  
//===== Settings functions =====================================================
module.exports.Settings = {
	Set: (n,v) => {
		return new Promise((resolve) => {
			db.settings.put({name: n, value: v}).then((id) => {
				resolve(id);
			});
		});
	},
	Get: (n) => {
		return new Promise((resolve, reject) => {
			db.settings.where('name').equalsIgnoreCase(n).first((item) => {
				if (item !== undefined) {
					resolve(item);
				} else {
					reject('No item found');
				}
			});
		});
	}
};

//===== Session functions ======================================================
module.exports.Sessions = {
	Get: () => {
		return new Promise((resolve) => {
			db.currentsession.toArray((list) => {
				resolve(list);
			});
		});
	},
	Set: (s, u, t, m, i) => {
		return new Promise((resolve, reject) => {
			db.currentsession.put({sessionid: s, url: u, title: t, mode: m, icon: i, timestamp:Date.now()}).then((id) => {
				if (id != null) {
					resolve();
				} else {
					reject();
				}
			});
		});
	},
	UpdateWebPage: (s,u,t,i) => {
		return new Promise((resolve) => {
			db.currentsession.update(s, {url: u, title: t, icon: i}).then((id) => {
				resolve(id);
			});
		});
	},
	UpdateMode: (s,m) => {
		return new Promise((resolve) => {
			db.currentsession.update(s, {mode: m}).then((id) => {
				resolve(id);
			});
		});
	},
	UpdateParent: (s,p) => {
		return new Promise((resolve) => {
			db.currentsession.update(s, {parent: p}).then((id) => {
				resolve(id);
			});
		});
	},
	Remove: (i) => {
		return new Promise((resolve) => {
			db.currentsession.where('sessionid').equals(i).delete().then((result) => {
				resolve(result);
			});
		});
	}
};

module.exports.Groups = {
	Get: () => {
		return new Promise((responce) => {
			db.browser_groups.toArray((arry) => {
				responce(arry);
			});
		});
	},
	Upsert: (_Gid,_Gname) => {
		return new Promise((resolve) => {
			db.browser_groups.put({groupid: _Gid, name: _Gname, timestamp: Date.now()}).then((id) => {
				resolve(id);
			});
		});
	},
	Remove: (_Id) => {
		return new Promise((resolve) => {
			db.browser_groups.where('groupid').equals(_Id).delete().then((result) => {
				resolve(result);
			});
		});
	}
};