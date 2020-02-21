class ObservableData {
	constructor(initialVal) {
		this.next(initialVal);
	}
	next(n) {
		if (this.ondata) {
			this.ondata(n);
		}
	}
	asObservable() {
		return new Observable((observer) => {
			const safeObserver = new SafeObserver(observer);
			this.ondata = (e) => safeObserver.next(e);
			this.onerror = (err) => safeObserver.error(err);
			this.oncomplete = () => safeObserver.complete();
        
			safeObserver.unsub = () => {
			};
        
			return safeObserver.unsubscribe.bind(safeObserver);
		});
	}
}
class SafeObserver {
	constructor(destination) {
		this.destination = destination;
	}
    
	next(value) {
		// only try to next if you're subscribed have a handler
		if (!this.isUnsubscribed && this.destination.next) {
			try {
				this.destination.next(value);
			} catch (err) {
				// if the provided handler errors, teardown resources, then throw
				this.unsubscribe();
				throw err;
			}
		}
	}
    
	error(err) {
		// only try to emit error if you're subscribed and have a handler
		if (!this.isUnsubscribed && this.destination.error) {
			try {
				this.destination.error(err);
			} catch (e2) {
				// if the provided handler errors, teardown resources, then throw
				this.unsubscribe();
				throw e2;
			}
			this.unsubscribe();
		}
	}
  
	complete() {
		// only try to emit completion if you're subscribed and have a handler
		if (!this.isUnsubscribed && this.destination.complete) {
			try {
				this.destination.complete();
			} catch (err) {
				// if the provided handler errors, teardown resources, then throw
				this.unsubscribe();
				throw err;
			}
			this.unsubscribe();
		}
	}
    
	unsubscribe() {
		this.isUnsubscribed = true;
		if (this.unsub) {
			this.unsub();
		}
	}
}
class Observable {
	constructor(_subscribe) {
		this._subscribe = _subscribe;
	}
    
	subscribe(observer) {
		const safeObserver = new SafeObserver(observer);
		return this._subscribe(safeObserver);
	}
}

module.exports.ObservableData = ObservableData;