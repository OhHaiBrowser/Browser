const urlWithoutProtocolTest = /(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
const urlHostNameTest = /:\/\/(www[0-9]?\.)?(.[^/:]+)/i;

module.exports = {
    url: function(testvalue, callback){
        
        let callbackResp = {
            url: testvalue,
            valid: true
        };
        let testUri = function(turi){ return urlWithoutProtocolTest.test(turi) };

        if(testUri(testvalue)){
            testvalue = (testvalue.indexOf('://') == -1) ? 'http://' + testvalue : testvalue;
            callbackResp.url = testvalue;         
        }else{
            callbackResp.valid = false;
        }

        callback(callbackResp);	
    },
    string: function(input){
        return typeof input === 'string' || input instanceof String;
    },
    number: function(input){
        return typeof input === 'number' && isFinite(input);
    },
    hostname: function(url){
        const match = url.match(urlHostNameTest);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        }
        else {
            return null;
        }
    },
    internalpage: function(input){
        const RunDir = decodeURI(process.cwd().toLocaleLowerCase()).replace(/\\/g, "/");
        return input.toLocaleLowerCase().indexOf(RunDir) !=0 -1;
    }
}