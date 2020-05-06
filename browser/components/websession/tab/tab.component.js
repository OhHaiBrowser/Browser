
class tabItem extends HTMLElement{  
	/**
     * 
     * @param {Object} opts
     * @param {string} opts.id 
     * @param {String} opts.mode
     * @param {String} opts.title
     * @param {String} opts.icon
     * @param {Boolean} opts.selected
     */
	constructor(opts = {}){
		super();
		const shadowEl = this.attachShadow({mode: 'open'});
		shadowEl.innerHTML = `
            <link rel='stylesheet' href='${__dirname}/tab.component.css' />
            <div class='ohhai-tab ${opts.mode ? opts.mode : 'default'} ${opts.selected ? 'selected' : ''}'>
                <a class='tab-mediabtn hidden'></a>
                <img src='${opts.icon ? opts.icon : 'assets/imgs/favicon_default.png'}' class='tab-favicon'/>
                <span class='tab-title'>${opts.title ? opts.title : 'New Tab'}</span>
                <a class='tab-close'></a>
            </div>
        `;

		this.tab_outer = shadowEl.querySelector('.ohhai-tab');
		this.btn_Media = shadowEl.querySelector('.tab-mediabtn');
		this.img_FavIco = shadowEl.querySelector('.tab-favicon');
		this.lbl_Title = shadowEl.querySelector('.tab-title');
		this.btn_Close = shadowEl.querySelector('.tab-close');

		this.tab_outer.addEventListener('click',() => {
			this.selected = true;
		});

		this.tab_outer.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			this.dispatchEvent(new Event('contextClick', {bubbles: true, composed: true, detail: this}));
		});

		this.btn_Media.addEventListener('click', (e) => {
			e.stopPropagation();
			var value = '';
			//Toggle play pause
			if(this.btn_Media.classList.contains('playing')){
				this.btn_Media.classList.remove('playing');
				this.btn_Media.classList.add('paused');
				value = 'paused';
			}else{
				this.btn_Media.classList.remove('paused');
				this.btn_Media.classList.add('playing');
				value = 'playing';
			}
			this.dispatchEvent(new Event('mediaClick', {bubbles: true, composed: true, detail: value}));
		});

		this.btn_Close.addEventListener('click', (e) => {
			e.stopPropagation();
			this.close();
		});
	}

	get mode(){
		return this.tab_outer.classList.contains('incog') ? 'incog' : this.tab_outer.classList.contains('pinned') ? 'pinned' : 'default';
	}
	set mode(value){
		this.tab_outer.classList.remove('default','incog','pinned');
		this.tab_outer.classList.add(value);
		this.dispatchEvent(new Event('modeChange', {bubbles: true, composed: true}));
	}
 
	set icon(value){
		this.img_FavIco.src = value;
	}
 
	get title(){
		return this.lbl_Title.textContent;
	}
	set title(value){
		this.lbl_Title.textContent = value;
		this.dispatchEvent(new Event('titleChange', {bubbles: true, composed: true, detail: value}));
	}

	get selected(){
		return this.tab_outer.classList.contains('selected');
	}
	set selected(value){
		if(value){
			this.tab_outer.classList.add('selected');
			this.dispatchEvent(new Event('selected', {bubbles: true, composed: true, detail: this}));
		}else{
			this.tab_outer.classList.remove('selected');
		}
	}

	set mediaControl(value) {
		this.btn_Media.classList.remove('hidden', 'tabMute', 'tabPlaying');
		switch (value) {
		case 'play': 
			this.btn_Media.classList.add('tabPlaying');
			break;
		case 'mute':
			this.btn_Media.classList.add('tabMute');
			break;
		case 'hide' :
		default :
			this.btn_Media.classList.add('hidden');
			break;
		}
	}
	get mediaControl() {
		return this.btn_Media.classList.contains('hidden') ? 'hide' : this.btn_Media.classList.contains('tabMute') ? 'mute' : 'play';
	}

	close(){
		this.tab_outer.remove();
		this.dispatchEvent(new Event('close', {bubbles: true, composed: true}));
	}
}

module.exports.tabItem = tabItem;