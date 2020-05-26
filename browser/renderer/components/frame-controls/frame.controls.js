// Window frame controls
class FrameControls extends HTMLElement {
	constructor(){
		super();
		this.windowMaximised = false;
		this.attachShadow({mode: 'open'});
        
		const uA = window.navigator.userAgent.toLowerCase();
		if(uA.indexOf('mac') !== -1){
			this.setupMacControls();
		} else if (uA.indexOf('x11') !== -1 || uA.indexOf('linux') !== -1) {
			this.setupLinuxControls();
		} else {
			this.setupWindowsControls();
		}
	}
	setupWindowsControls() {
		this.shadowRoot.innerHTML = `
            <style>
                @font-face {
                    font-family: Segoe MDL2 Assets;
                    src: url("../../assets/fonts/SegMDL2.ttf");
                }

                #window-controls {
                    display: grid;
                    grid-template-columns: repeat(3, 46px);
                    height: 30px;
                    font-size: 10px;
                    color: #e4e4e4;
                    position: absolute;
                    top: 0;
                    right: 0;
                    -webkit-app-region: no-drag;
                }
                    .button {
                        grid-row: 1 / span 1;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        user-select: none;
                        cursor: default;
                        font-family: "Segoe MDL2 Assets";
                    }

                    #left-button {
                        grid-column: 1;
                    }
                    #center-button {
                        grid-column: 2;
                    }
                    #right-button {
                        grid-column: 3;
                    }
                
                    .button:hover {
                        background: rgba(255,255,255,0.1);
                    }
                    .button:active {
                        background: rgba(255,255,255,0.2);
                    }
                
                    #right-button:hover {
                        background: #E81123 !important;
                    }
                    #right-button:active {
                        background: #f1707a !important;
                        color: #000;
                    }
            </style>
            <div id="window-controls">
                <div class="button" id="left-button">&#xE921;</div>
                <div class="button" id="center-button">&#xE922;</div>
                <div class="button" id="right-button">&#xE8BB;</div>
            </div>
        `;
		this.shadowRoot.getElementById('left-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('minimise', {bubbles: true, composed: true}));
		});
		const centerBtn = this.shadowRoot.getElementById('center-button');
		centerBtn.addEventListener('click', () => {
			if(this.windowMaximised){
				this.dispatchEvent(new Event('restore', {bubbles: true, composed: true}));
				centerBtn.innerHTML = '&#xE922;';
				this.windowMaximised = false;
			}else{
				this.dispatchEvent(new Event('maximise', {bubbles: true, composed: true}));
				centerBtn.innerHTML = '&#xE923;';
				this.windowMaximised = true;
			}
		});
		this.shadowRoot.getElementById('right-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('close', {bubbles: true, composed: true}));
		});
	}
	setupMacControls() {
		this.shadowRoot.innerHTML = `
        <style>
            #window-controls {
                display: grid;
                grid-template-columns: repeat(3, 25px);
                height: 30px;
                font-size: 10px;
                color: #e4e4e4;
                position: absolute;
                top: 0;
                left: 0;
                -webkit-app-region: no-drag;
            }
                .button {
                    grid-row: 1 / span 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 12px;
                    height: 12px;
                    border-radius: 6px;
                    user-select: none;
                    cursor: default;
                    margin: 8px;
                    font-family: "Segoe MDL2 Assets";
                }

                #left-button {
                    grid-column: 1;
                    background-color: #ff6159;
                }
                #center-button {
                    grid-column: 2;
                    background-color: #ffbd2e;
                }
                #right-button {
                    grid-column: 3;
                    background-color: #28c941;
                }
        </style>
        <div id="window-controls">
            <div class="button" id="left-button"></div>
            <div class="button" id="center-button"></div>
            <div class="button" id="right-button"></div>
        </div>
    `;
		this.shadowRoot.getElementById('left-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('close', {bubbles: true, composed: true}));
		});
		const centerBtn = this.shadowRoot.getElementById('center-button');
		centerBtn.addEventListener('click', () => {
			if(this.windowMaximised){
				this.dispatchEvent(new Event('restore', {bubbles: true, composed: true}));
				this.windowMaximised = false;
			}else{
				this.dispatchEvent(new Event('maximise', {bubbles: true, composed: true}));
				this.windowMaximised = true;
			}
		});
		this.shadowRoot.getElementById('right-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('minimise', {bubbles: true, composed: true}));       
		});
	}
	setupLinuxControls() {
		this.shadowRoot.innerHTML = `
        <style>
            #window-controls {
                display: grid;
                grid-template-columns: repeat(3, 46px);
                height: 30px;
                font-size: 10px;
                color: #e4e4e4;
                position: absolute;
                top: 0;
                right: 0;
                -webkit-app-region: no-drag;
            }
                .button {
                    grid-row: 1 / span 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    user-select: none;
                    cursor: default;
                    font-family: "Segoe MDL2 Assets";
                }

                #left-button {
                    grid-column: 1;
                }
                #center-button {
                    grid-column: 2;
                }
                #right-button {
                    grid-column: 3;
                }
            
                .button:hover {
                    background: rgba(255,255,255,0.1);
                }
                .button:active {
                    background: rgba(255,255,255,0.2);
                }
            
                #right-button:hover {
                    background: #E81123 !important;
                }
                #right-button:active {
                    background: #f1707a !important;
                    color: #000;
                }
        </style>
        <div id="window-controls">
            <div class="button" id="left-button">&#xE921;</div>
            <div class="button" id="center-button">&#xE922;</div>
            <div class="button" id="right-button">&#xE8BB;</div>
        </div>
    `;
		this.shadowRoot.getElementById('left-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('minimise', {bubbles: true, composed: true}));
		});
		const centerBtn = this.shadowRoot.getElementById('center-button');
		centerBtn.addEventListener('click', () => {
			if(this.windowMaximised){
				this.dispatchEvent(new Event('restore', {bubbles: true, composed: true}));
				centerBtn.innerHTML = '&#xE922;';
				this.windowMaximised = false;
			}else{
				this.dispatchEvent(new Event('maximise', {bubbles: true, composed: true}));
				centerBtn.innerHTML = '&#xE923;';
				this.windowMaximised = true;
			}
		});
		this.shadowRoot.getElementById('right-button').addEventListener('click', () => {
			this.dispatchEvent(new Event('close', {bubbles: true, composed: true}));
		});
	}
}

module.exports.frameControls = FrameControls;