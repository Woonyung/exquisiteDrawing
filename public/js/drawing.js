/*
/* Javascript for Drawing page
/* simple drawing
/* Feb.14, 2015
/* 
*/

// Make the paper scope global, by injecting it into window
paper.install(window);

var tool1, tool2;

//canvasWH
var width = 800;
var height = 600;

window.onload = function(){
	// get id from canvas and set up
	var canvas = document.getElementById('myCanvas');
	paper.setup(canvas);

	////////////////////////////////
	// create two drawing tools
	// tool1 = brushline thin
	// tool2 = brushline thick
	// tool3 = weird brush with red head

	var path;

	/////////////////////////////////////////////////
	// white background papers
	var rect = new Path.Rectangle([0,0], [ width, height]);
	rect.fillColor = 'white';


	/////////////////////////////////////////////////
	// TOOL 1 
	tool1 = new Tool();
	tool1.onMouseDown = function(event){
		path = new Path();
		path.strokeColor = 'red';
		path.strokeWidth = 2; // stroke weight
		path.add(event.point);
	}
	tool1.onMouseDrag = function(event){
		path.add(event.point);
	}


	// TOOL 2 
	tool2 = new Tool();
	tool2.onMouseDown = function(event){
		path = new Path();
		path.strokeColor = 'black';
		path.strokeWidth = 10; // stroke weight
		path.add(event.point);
	}

	tool2.onMouseDrag = function(event){
		path.add(event.point);
	}

	// TOOL 3
	tool3 = new Tool();
	tool3.onMouseDown = function(event){
		path = new Path();
		path.strokeColor = "black";
		path.strokeWidth = 1.5;
	}
	tool3.onMouseDrag = function(event){
		path.add(event.point);
	}
	tool3.onMouseUp = function(event){
		var myCircle = new Path.Circle({
			center: event.point,
			strokeWidth: 1.5,
			strokeColor: 'red',
			fillColor: 'red',
			radius: 10
		});
	}


	// Whenever buttons are pressed
	$("#brush1").click(function(){
		tool1.activate();
	});

	$("#brush2").click(function(){
		tool2.activate();
	});

	$("#weird").click(function(){
		tool3.activate();
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
                document.location.href = '/';

            }
		});
	});

}
