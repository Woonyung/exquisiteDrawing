/* Made with love by Woonyung
/* woonyungchoi@gmail.com
/*
/* Javascript for first index page
/* Mar.7, 2015
/*
*/


$(document).ready(function(){
	// console.log(view.bounds.height);
	// draw canvas
	drawCanvasIndex();
});



function drawCanvasIndex(){
	////////////////////////////////////////////////////
	// BACKGROUND //
	////////////////////////////////////////////////////

	var width = view.bounds.width;
	var height = view.bounds.height;

	// get id from canvas and set up
	var canvas = document.getElementById('backgroundCanvas');


	///// draw stars
	// number of stars that I am going to make
	var count = 150;

	// star symbol
	var path = new Path.Circle({
		radius: 4,
		fillColor: 'white',
	});
	var star = new Symbol(path);

	// Distribute
	for ( var i = 0; i < count; i++){
        // The center position is a random point in the view:
        var center = Point.random() * view.size;
        var placedSymbol = star.place(center);
        placedSymbol.scale(i / count);
	}
}

