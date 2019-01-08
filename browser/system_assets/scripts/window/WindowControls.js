//-------------------------------------------------------------------------
//This controls the native window button controls...Minimise, Maximise/Restore, Exit.
//-------------------------------------------------------------------------
const ThisWindow = remote.getCurrentWindow();




$("#Min_Win").click(function(){
    ThisWindow.minimize();
});

$("#Max_Win").click(function(){
    if (!ThisWindow.isMaximized()) { 
		document.getElementById("Max_Win").className = "";
		document.getElementById("Max_Win").className = "Restore_Win";	
        ThisWindow.maximize(); 
    } else { 
		document.getElementById("Max_Win").className = "";
		document.getElementById("Max_Win").className = "Maximise_Win";
        ThisWindow.restore(); 
    } 
});

$("#Clo_Win").click(function(){
    ThisWindow.close(); 
});

ThisWindow.addEventListener("maximize",function(){
    document.getElementById("Max_Win").className = "";
    document.getElementById("Max_Win").className = "Restore_Win";	
});

ThisWindow.addEventListener("unmaximize",function(){
    document.getElementById("Max_Win").className = "";
    document.getElementById("Max_Win").className = "Maximise_Win";
});

