/* Made with love by Woonyung
/* woonyungchoi@gmail.com
/*
/* Javascript for Drawing page
/* putting all together
/* Apr.20, 2015
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

    //// TOOLS
    // TEMPORARY CSS - for toggle on and off
    $("#organicBrush").addClass("on");
    
    $(".drawingTools").click(function(){
        $(".drawingTools").removeClass("on");
        $(this).toggleClass( "on" );
    });

    //// MENUS
    $("#close").click(function(){
        $("#covered").fadeOut('slow'); 
        $("#toTheRight").fadeIn('slow');

        /// start with the organic brush
        organicBrush.activate();
        // add preview of the brushes
        $(".brushPreviews").fadeTo( "fast", 0 );
        $("#organicBrush_prev").fadeTo( "fast", 100 );
    });

    // SCROLLS 
    var duration = 700;
    $("#toTheLeft").click(function(){
        $('html, body').animate({
            scrollLeft: $("body").offset().left
        }, duration);

        $(this).fadeOut('slow');
        $("#toTheRight").fadeIn('slow');
    });

    $("#toTheRight").click(function(){                    
        $('html, body').animate({
            scrollLeft: $(".right").offset().left
        }, duration);

        $(this).fadeOut('slow');
        $("#toTheLeft").fadeIn('slow');
                                  
    });

    
    ///////////////////////////////////////////////
    // MENU FUNCTIONS // 

    // UNDO FUNCTION 
    $("#undo").click(function(){ 
        // delete children one by one
        var pathCount = project.activeLayer.children.length;
        // console.log(project.activeLayer);
        project.activeLayer.removeChildren(pathCount-1,pathCount);
    });   

    // SAVE FUNCTION
    $('#save').click(function(){
        var imageString = canvas.toDataURL();
        // front-end stuffs
        // var currentTheme = document.getElementById("currentTheme").getAttribute("data-theme");
        // console.log(currentTheme);
        // document.getElementById("currentTheme").setAttribute("data-theme", "happiness"); // to change the theme
        
        var currentTheme = $("#save").data('theme');

        console.log(currentTheme);

        var dataToSave = {
            Date: new Date(),
            imageData: imageString,
            theme: currentTheme // front-end
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

//==========================
// drag lines - brushes
//==========================


// ERASER
eraser = new Tool();
eraser.minDistance = 3;
eraser.onMouseDown = function(event){
    path = new Path({
        strokeColor: 'white',
        strokeJoin : 'round',
        strokeCap :'round',
        strokeWidth: 40 // stroke weight  
    });
}

eraser.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}


// Organic brush
organicBrush = new Tool();
organicBrush.minDistance = 2;
organicBrush.maxDistance = 15;
organicBrush.onMouseDown = function(event){

    path = new Path();
    path.fillColor = currentColor;

    path.add(event.point);
}

organicBrush.onMouseDrag = function(event){
    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    // Every drag event, add a segment
    // to the path at the position of the mouse:
    path.add(top);
    path.insert(0, bottom);
    path.smooth();

}

organicBrush.onMouseUp = function(event){
    path.add(event.point);
    path.closed = true;
    path.smooth();
}  



// dashed line
dashedBrush = new Tool();
dashedBrush.minDistance = 7;
dashedBrush.onMouseDown = function(event){
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    // make it as dashed line
    path.dashArray = [10, 12]; // 10pt dash and 12pt gap

}
dashedBrush.onMouseDrag = function(event){
    path.add(event.point);
    path.smooth();
}

// Wave
waveBrush = new Tool();
waveBrush.minDistance = 10;
var values11 = {
    curviness: 0.5,
    distance: waveBrush.minDistance,
    offset: 10,
    mouseOffset: true
};

waveBrush.onMouseDown = function(event){
    path = new Path({
        strokeColor: '#000000',
        strokeWidth: currentWidth
    });    
}

var mul = 1;
waveBrush.onMouseDrag = function(event){ 
    var step = event.delta.rotate(90 * mul);

    if (!values11.mouseOffset)
        step.length = values11.offset;

    path.add({
        point: event.point + step,
        handleIn: -event.delta * values11.curviness,
        handleOut: event.delta * values11.curviness
    });
    mul *= -1;
}


// cloud shape brush
cloudBrush = new Tool();
cloudBrush.minDistance = 20;
cloudBrush.onMouseDown = function(event){
    path = new Path({
        strokeColor : currentColor,
        strokeWidth : currentWidth,
        strokeJoin : 'round',
        strokeCap :'round'
    });

    path.add(event.point);
}
cloudBrush.onMouseDrag = function(event){
    // use the arcTo command to draw cloudy lines
    path.arcTo(event.point);
}


// vertical shapes
verticalBrush = new Tool();
verticalBrush.minDistance = 10;

verticalBrush.onMouseDrag = function(event){ 
    path = new Path({
        strokeColor: currentColor,
        strokeWidth: currentWidth // stroke weight
    });

    var vector = event.delta;
    vector.angle += 90;

    // length of line
    vector.length = 5;
    
    path.add(event.middlePoint + vector);
    path.add(event.middlePoint - vector);
}


// Multi Lines
multiLineBrush = new Tool();
multiLineBrush.fixedDistance = 30;

var values12 = {
    lines: 3,
    size: 30,
    smooth: true
};

var paths;

multiLineBrush.onMouseDown = function(event){ 
    paths = [];
    for (var i = 0; i < values12.lines; i++) {
        var path = new Path();
        path.strokeColor = currentColor;
        path.strokeWidth = 4;
        paths.push(path);
    }
}

multiLineBrush.onMouseDrag = function(event){
    var offset = event.delta;
    offset.angle = offset.angle + 90;
    var lineSize = values12.size / values12.lines;
    for (var i = 0; i < values12.lines; i++) {
        var path = paths[values12.lines - 1 - i];
        offset.length = lineSize * i + lineSize / 2;
        path.add(event.middlePoint + offset);
        path.smooth();
    }
}

//==========================
// click - stamps
//==========================

// LEFT 
// three - triangle stamps..!!
threeTriangles = new Tool();
threeTriangles.onMouseDown = function(event){
    var raster = new Raster('triangles');
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


// small charcoal - line stamp
var lineLists = ['randomLine01', 'randomLine02', 'randomLine03'];
var rand;

smallCharcoal = new Tool();
smallCharcoal.onMouseDown = function(event){
    // pick randdom circle whenever mouse is clicked
    rand = lineLists[Math.floor(Math.random() * lineLists.length)];
    // console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


// large charcoal - 
largeCharcoal = new Tool();
largeCharcoal.onMouseDown = function(event){
    var raster = new Raster('gradation');
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}

// MIDDLE
// RANDOM TRIANGLE STAMPS
var triLists = ['randomTri01', 'randomTri02', 'randomTri03', 'randomTri04'];
var rand;

randomTriangle = new Tool();
randomTriangle.onMouseDown = function(event){
    // pick randdom circle whenever mouse is clicked
    rand = triLists[Math.floor(Math.random() * triLists.length)];
    // console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


// RANDOM RECTS STAMPS
var rectLists = ['randomRect01', 'randomRect02', 'randomRect03', 'randomRect04'];
var rand;

randomRectangle = new Tool();
randomRectangle.onMouseDown = function(event){
    // pick randdom circle whenever mouse is clicked
    rand = rectLists[Math.floor(Math.random() * rectLists.length)];
    // console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


// different look of circles
var ellpseLists = ['randomCircles01', 'randomCircles02', 'randomCircles03','randomCircles04', 'randomCircles05'];
var rand;

randomCircle = new Tool();
randomCircle.onMouseDown = function(event){
    // pick randdom circle whenever mouse is clicked
    rand = ellpseLists[Math.floor(Math.random() * ellpseLists.length)];
    console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


//RIGHT
// RANDOM SPIRAL SHAPES
var spiralList = ['randomSpiral01', 'randomSpiral02', 'randomSpiral03'];
var rand;

randomSpiral = new Tool();
randomSpiral.onMouseDown = function(event){
    console.log("random spiral");
    // pick randdom circle whenever mouse is clicked
    rand = spiralList[Math.floor(Math.random() * spiralList.length)];
    console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}


// RANDOM STAR SHAPES
var starList = ['randomStar01', 'randomStar02', 'randomStar03', 'randomStar04', 'randomStar05'];
var rand;

randomStars = new Tool();
randomStars.onMouseDown = function(event){
    console.log("random spiral");
    // pick randdom circle whenever mouse is clicked
    rand = starList[Math.floor(Math.random() * starList.length)];
    console.log(rand);

    var raster = new Raster(rand);
    raster.scale(0.2);
    raster.position.x = event.event.layerX;
    raster.position.y = event.event.layerY;   
}




//==========================
// drag - enlarging shapes
//==========================
// add something....

// cloud shapes
cloudTube = new Tool();
cloudTube.onMouseDrag = function(event){

    // The radius is the distance between the position
    // where the user clicked and the current position
    // of the mouse.
    var raster = new Raster('cloud');

    raster.position = event.downPoint;
    raster.scale((event.downPoint - event.point).length / 1000);
}


// CUBE shapes
cubeTube = new Tool();
cubeTube.onMouseDrag = function(event){
    console.log("cube");
    // The radius is the distance between the position
    // where the user clicked and the current position
    // of the mouse.
    var raster = new Raster('cube');

    raster.position = event.downPoint;
    raster.scale((event.downPoint - event.point).length / 1000);
}


///////////////////////////////////////
// actiavate tools
function activateTools(elements, tool, preview){
    $(elements).click(function(){
        tool.activate();
        // add preview of the brushes
        $(".brushPreviews").fadeTo( "fast", 0 );
        $(preview).fadeTo( "fast", 100 );
    });
}

// Whenever buttons are pressed
// DRAG - BRUSHES
activateTools("#eraser", eraser);
activateTools("#organicBrush", organicBrush, "#organicBrush_prev");
activateTools("#dashedBrush", dashedBrush, "#dashedBrush_prev");
activateTools("#waveBrush", waveBrush, "#waveBrush_prev");
activateTools("#cloudBrush", cloudBrush, "#cloudBrush_prev");
activateTools("#verticalBrush", verticalBrush, "#verticalBrush_prev");
activateTools("#multiLineBrush", multiLineBrush, "#multiLineBrush_prev");

// CLICK - STAMPS
activateTools("#threeTriangles", threeTriangles, "#threeTriangles_prev");
activateTools("#smallCharcoal", smallCharcoal, "#smallCharcoal_prev");
activateTools("#largeCharcoal", largeCharcoal, "#largeCharcoal_prev");

activateTools("#randomTriangle", randomTriangle, "#randomTriangle_prev");
activateTools("#randomRectangle", randomRectangle, "#randomRectangle_prev");
activateTools("#randomCircle", randomCircle, "#randomCircle_prev");

// RIGHT 
activateTools("#randomSpiral", randomSpiral, "#randomSpiral_prev");
activateTools("#randomStars", randomStars, "#randomStars_prev");

// DRAG - TUBES
// something
activateTools("#cloudTube", cloudTube, "#cloudTube_prev");
activateTools("#cubeTube", cubeTube, "#cubeTube_prev");
