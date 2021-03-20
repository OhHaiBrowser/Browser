import {ResizeWindow} from './components/resize_window.js';
import {FrameControls} from './components/frame_controls.js';
import {BrowserWindow} from './components/browser_win.js'

customElements.define('resize-window', ResizeWindow);
customElements.define('frame-controls', FrameControls);
customElements.define('browser-window', BrowserWindow);

const tc = new NanoTabs('TabList', 'ContentContainer', {showAddBtn: false});

document.getElementById('AddTabBtn').addEventListener('click', () => {
    tc.addTab();
});

tc.on('tab-added', (tab, content) => {

    content.addEventListener('click', () => {
        if(tab.getAttribute('aria-selected') != "true"){
            tc.selectTab(tab.id);
        }
    });
    content.querySelector('browser-window').addEventListener('close', () => {
        tc.removeTab(tab.id);
    });

    content.addEventListener('startDrag', ()=> {
        document.querySelectorAll('browser-window').forEach(el => {
            el.style.pointerEvents = 'none';
        });
    });
    content.addEventListener('endDrag', ()=> {
        document.querySelectorAll('browser-window').forEach(el => {
            el.style.pointerEvents = '';
        });
    });

    setTimeout(()=> {
        content.scrollIntoView({behavior: 'smooth'});
    }, 50);
});

tc.on('tab-selected', (tab, content) => {
    //console.log('tab selected', tab, content);
    content.scrollIntoView({behavior: 'smooth'});
});

document.addEventListener('DOMContentLoaded', (event) => {
    tc.addTab();
});