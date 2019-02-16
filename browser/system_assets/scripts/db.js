

var db = new Dexie("ohhai_browser_db");

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

db.open().then(function () {}).catch(function (err) {console.warn('database error occured', error)});

//===== Quicklink functions ====================================================
var Quicklinks = {
  List: function(callbackfun){
    db.quicklinks.toArray(callbackfun);
  },
  Add: function(u,t,i,ut,d,callbackfun){
    db.quicklinks.add({url: u, title: t, icon: i,text: ut,desc: d, timestamp: Date.now()}).then(callbackfun);
  },
  Remove: function(i,callbackfun){
    db.quicklinks.where('id').equals(i).delete().then(callbackfun);
  },
  IsBookmarked: function(url,callbackfun){
    db.quicklinks.where('url').equals(url).first(callbackfun);
  }
}

//===== History functions ======================================================
var History = {
  List: function(callbackfun){
    db.history.reverse().toArray(callbackfun);
  },
  ListMostViewed: function(callbackfun){
	  db.history.orderBy('parentSite').limit(9).uniqueKeys(callbackfun);
  },
  GetItemByID: function(id,callbackfun){
    db.history.where('parentSite').equals(id).first(callbackfun);
  },
  Add: function(u,t,i,ps){
    db.history.add({url: u, title: t, icon: i,visitCount: 1,lastVisit: Date.now(),parentSite: ps,extraData:"",timestamp: Date.now() }).then(function(){
      //Complete
    }).catch(function(error){
      //Error
    });
  },
  GetLastItem: function(callbackfun){
    db.history.orderBy('timestamp').last(callbackfun);
  },
  Clear: function(callbackfun){
    db.history.clear().then(callbackfun);
  }
}

//===== Settings functions =====================================================
var Settings = {
  Set: function(n,v,callbackfun){
    db.settings.put({name: n, value: v}).then(callbackfun);
  },
  Get: function(n,callbackfun){
    db.settings.where('name').equals(n).first(callbackfun);
  }
}

//===== Session functions ======================================================
var Sessions = {
  Get: function(callbackfun){
    db.currentsession.toArray(callbackfun);
  },
  Set: function(s,u,t,m,i,callback){
    db.currentsession.put({sessionid: s, url: u, title: t, mode: m, icon: i, timestamp:Date.now()}).then(callback);
  },
  UpdateWebPage: function(s,u,t,i,callback){
    db.currentsession.update(s, {url: u, title: t, icon: i}).then(callback);
  },
  UpdateMode: function(s,m,callback){
    db.currentsession.update(s, {mode: m}).then(callback);
  },
  UpdateParent: function(s,p,callback){
    db.currentsession.update(s, {parent: p}).then(callback);
  },
  Remove: function(i,callbackfun){
    db.currentsession.where('sessionid').equals(i).delete().then(callbackfun);
  }
}

var Groups = {
  Get: function(_callbackfun){
    db.browser_groups.toArray(_callbackfun);
  },
  Upsert: function(_Gid,_Gname,_callbackfun){
    db.browser_groups.put({groupid: _Gid, name: _Gname, timestamp: Date.now()}).then(_callbackfun);
  },
  Remove: function(_Id,_callbackfun){
    db.browser_groups.where('groupid').equals(_Id).delete().then(_callbackfun);
  }
}