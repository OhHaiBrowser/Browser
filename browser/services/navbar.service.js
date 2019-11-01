let searchProvider = OhHaiBrowser.settings.search;

class urlAutoComplete{
	constructor(url) {
		let urlbarValid = {};
		OhHaiBrowser.validate.url(url,function(isurl){ urlbarValid = isurl; })

		this.valid = urlbarValid.valid;
		this.output = this.valid ? urlbarValid.url : searchProvider + urlbarValid.url;;
		this.type = this.valid ? 'url' : 'search';
		this.results = [];
	}
}
module.exports.AutoComplete = (value,callback) => { callback(new urlAutoComplete(value)); };

