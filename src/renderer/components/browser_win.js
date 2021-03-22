
export class BrowserWindow extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="assets/iconmonstr-iconic/css/iconmonstr-iconic-font.min.css"/>
            <style>
                .win_outer {
                    display:flex;
                    flex-direction:column;
                    height: 100%;
                }
                .navbar {
                    width: 100%;
                    height: 30px;
                    padding: 3px;
                    background: #15427D;
                    border-radius: 2px 2px 0 0;
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                }
                    .navbar > .btn {
                        width: 24px;
                        height: 24px;
                        border: none;
                        background: transparent;
                        transition: background 0.25s;
                        outline: none;
                        color: #fff;
                        box-sizing: border-box;
                        border-radius:8px;
                    }
                        .navbar > .btn > i {
                            font-size: 12px;
                        }
                        .navbar > .btn:not(.hidden):hover{
                            background: rgb(255 255 255 / 35%);
                        }      
                    .navbar > .center {
                        flex: auto;
                    }
                        .navbar > .center > .url_outer {
                            max-width: 700px;
                            min-width: 300px;
                            width: 60%;
                            height: 24px;
                            margin: auto;
                            background: rgb(255 255 255 / 25%);
                            border-radius:8px;
                            display:flex;
                            flex-direction:row;
                        }
                            .url_outer > button {
                                width:24px;
                                border:none;
                            }
                            .url_outer > #urlTxt {
                                flex:auto;
                                background:transparent;
                                border:none;
                            }
    
                .view {
                    flex: auto;
                }
            </style>
            <div class='win_outer'>
                <div class="navbar">
                    <button id="back" class="btn back"><i class="im im-angle-left"></i></button>
                    <button id="refresh" class="btn refresh"><i class="im im-redo"></i></button>
                    <button id="forward" class="btn forward"><i class="im im-angle-right"></i></button>
                    <div class="center">
                        <div class='url_outer'>
                            <button></button>
                            <input type='text' id='urlTxt'/>
                            <button></button>
                        </div>
                    </div>
                    <button class="btn hidden"></button>
                    <button class="btn hidden"></button>
                    <button id="close" class="btn close"><i class="im im-x-mark"></i></button>
                </div>
                <webview class="view" src="https://www.google.com/">
                </webview>
            </div>
        `;
        this.webview = this.shadowRoot.querySelector('webview');

        this.shadowRoot.querySelector('#back').addEventListener('click', () => {
            this.webview.goBack();
        });
        this.shadowRoot.querySelector('#refresh').addEventListener('click', () => {
            this.webview.reload();
        });
        this.shadowRoot.querySelector('#forward').addEventListener('click', () => {
            this.webview.goForward();
        });

        this.shadowRoot.querySelector('#close').addEventListener('click', () => {

            this.dispatchEvent(new CustomEvent('close'));
        });

        this.webview.addEventListener('focus', () => {
            this.dispatchEvent(new CustomEvent('focused'));
        });
    }

}