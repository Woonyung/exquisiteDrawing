/*
/* Javascript for Drawing page
/* putting all together
/* Apr.05, 2015
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

    var duration = 700;
    $("#toTheLeft").click(function(){
        $('html, body').animate({
            scrollLeft: $("body").offset().left
        }, duration);        
    });

    $("#toTheRight").click(function(){                    
        $('html, body').animate({
            scrollLeft: $(".right").offset().left
        }, duration);                                        
    });
                

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

                //Send them to the submission page..!
                document.location.href = '/submission';

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