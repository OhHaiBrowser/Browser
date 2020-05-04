class Observable {
	constructor(initialValue = undefined){
		this.staticValue = initialValue;
		this._listeners = [];
	}
	set next(val) {
		this.staticValue = val;
		this._listeners.forEach((cb) => cb(val));
	}
	/**
     * 
     * @param {void} listener 
     */
	subscribe(listener) {
		this._listeners.push(listener);
	}
	unSubscribe(listener) {
		let listenerIdx = this._listeners.findIndex(cb => cb === listener);
		this._listeners.splice(listenerIdx, 1);
	}
}

module.exports.observable = Observable;