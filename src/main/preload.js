// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
//const thisWindow = require('@electron/remote').getCurrentWindow()
const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {

  setupFrameControls();

});

function setupFrameControls(){
  const frameControl = document.getElementById('frameControls');

  ipcRenderer.send('isMaximized', '');
  ipcRenderer.on('isMaximized', (event, arg) => {
    frameControl.windowMaximised = arg;
  });

  frameControl.addEventListener('minimise', () => {
    ipcRenderer.send('minimize', true);
  });
  frameControl.addEventListener('restore', () => {
    ipcRenderer.send('restore', true);
  });
  frameControl.addEventListener('maximise', () => {
    ipcRenderer.send('maximize', true);
  });
  frameControl.addEventListener('close', () => {
    ipcRenderer.send('close', true);
  });
}