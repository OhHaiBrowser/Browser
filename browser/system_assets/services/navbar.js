let searchProvider = OhHaiBrowser.settings.search;

module.exports = (value,callback) => {
    console.log(searchProvider);
    let urlbarValid = {};
    OhHaiBrowser.validate.url(value,function(isurl){ urlbarValid = isurl });
    responceStub.valid = urlbarValid.valid;
    responceStub.output = responceStub.valid ? urlbarValid.url : searchProvider + urlbarValid.url;
    responceStub.type = responceStub.valid ? 'url' : 'search';
    
    callback(responceStub);
};

let responceStub = {
    output:'',
    valid: false,
    type: '',
    results: []
};