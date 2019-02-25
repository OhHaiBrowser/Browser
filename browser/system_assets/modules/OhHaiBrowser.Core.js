module.exports = {
    generateId: function(){	
        let uNums = [];
        for(i = 0; i < 7; i++){
            uNums.push(Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
        }
        return `${uNums[0] + uNums[1]}-${uNums[2]}-${uNums[3]}-${uNums[4]}-${uNums[5] + uNums[6]}`;
    },
    generateElement: function(elTemplate){
        var div = document.createElement('div');
          div.innerHTML = elTemplate;
          return div.firstElementChild;
    }
};