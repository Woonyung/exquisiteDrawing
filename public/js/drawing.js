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
var currentWidth = 4; // default is 4


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

    $("#clear").click(function(){
        project.activeLayer.removeChildren();
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

var tool0, tool1, tool2, tool3, tool4, 
    tool5, tool6, tool7, tool8,
    tool9, tool10, tool11, tool12;

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


//////
// TOOL 1 = brushline thin
tool1 = new Tool();

// The minimum distance the mouse has to drag
// before firing the onMouseDrag event,
// since the last onMouseDrag event.
tool1.minDistance = 10;
tool1.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    path.add(event.point);
}
tool1.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// TOOL 2 = brushline thick
tool2 = new Tool();
tool2.minDistance = 3;
tool2.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: 15 // stroke weight  
    });
}

tool2.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// TOOL 3 = dashed line
tool3 = new Tool();
tool3.minDistance = 7;
tool3.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    // make it as dashed line
    path.dashArray = [10, 12]; // 10pt dash and 12pt gap

}

tool3.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}




//////////////////////////////////
// Whenever buttons are pressed
activateTools("#tool0", tool0);
activateTools("#tool1", tool1);
activateTools("#tool2", tool2);
activateTools("#tool3", tool3);


// WIDTH
activateWidth("#thin", 2);
activateWidth("#medium", 4);
activateWidth("#thick", 6);

function activateTools(elements, tool){
    $(elements).click(function(){
        tool.activate();
    });
}


function activateWidth(element, width){
    $(element).click(function(){
        currentWidth = width;
    });
}