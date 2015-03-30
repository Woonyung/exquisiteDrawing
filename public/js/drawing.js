/*
/* Javascript for Drawing page
/* Change into paperscript !
/* Feb.28, 2015
/* 
*/

//canvasWH
var width = 640;
var height = 540;

var path;
var frame;

var currentColor = 'black'; // default is black

// load the blank paper
$(document).ready(function(){
    // draw the blank canvas
    drawCanvas();

    $("#undo").click(function(){ 
        // delete children one by one
        var pathCount = project.activeLayer.children.length;
        // console.log(project.activeLayer);
        project.activeLayer.removeChildren(pathCount-1,pathCount);
    });   


    ///////////////////////////////////////////////
    // SAVE FUNCTION
    $('#save').click(function(){
        var imageString = canvas.toDataURL();
        // front-end stuffs
        // var currentTheme = document.getElementById("currentTheme").getAttribute("data-theme");
        // console.log(currentTheme);
        // document.getElementById("currentTheme").setAttribute("data-theme", "happiness"); // to change the theme
        
        var dataToSave = {
            Date: new Date(),
            imageData: imageString
            // theme: currentTheme // front-end
        }


        $.ajax({
            url:'/submitDrawing',
            contentType: 'application/json',
            type: "POST",
            data: JSON.stringify(dataToSave),
            error: function(data){
                console.log(data.status);
            },
            success: function(data){
                //JSON.parse(data);
                console.log(data);

                // clear the canvas
                // paper.project.activeLayer.removeChildren();

                //Send them to the gallery
                document.location.href = '/newDRAWING';

            }
        }); // end of ajax
    }); // end of save function
});






////////////////////////////////////////////////////
// BACKGROUND //
////////////////////////////////////////////////////

// get id from canvas and set up
var canvas = document.getElementById('myCanvas');
function drawCanvas(){
    frame = new Path.Rectangle({
        point: [0,0],
        size: [width, height ],
        fillColor: 'white'
    });
}


////////////////////////////////////////////////////
// TOOLS //
////////////////////////////////////////////////////

var tool0, tool1;

// Create drawing tools

// ERASER
tool0 = new Tool();
tool0.minDistance = 3;
tool0.onMouseDown = function(event){
    path = new Path({
        strokeColor: 'white',
        strokeJoin : 'round',
        strokeCap :'round',
        strokeWidth: 40 // stroke weight  
    });
}

tool0.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// TOOL 3 = dashed line
tool1 = new Tool();
tool1.minDistance = 7;
tool1.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: 4
    });

    // make it as dashed line
    path.dashArray = [10, 12]; // 10pt dash and 12pt gap

}

tool1.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}



//////////////////////////////////
// Whenever buttons are pressed
activateTools("#tool0", tool0);
activateTools("#tool1", tool1); 


function activateTools(elements, tool){
    $(elements).click(function(){
        tool.activate();
    });
}
