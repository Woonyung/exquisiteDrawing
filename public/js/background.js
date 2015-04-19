/*
/* paper js page for the first log in shoot
/* Mar.7, 2015
/*
/* randomly placed stars
*/



var themeList= ['memory', 'happiness', 'weather'];

$(document).ready(function(){
	// console.log(view.bounds.height);
	// draw canvas
	drawCanvasIndex();
	// drawCanvasDetailPage();

	// loop through all themes and load data
	for ( var i = 0; i < themeList.length; i++){
		getData(themeList[i]);
	}

	$('#detail').click(function(){
		// make it happen
	});

});


// make group for seperate for each themes
// but also put group on the random spot

function getData(element){
	// and draw stars
	var theme = document.getElementById(element);

	var name = theme.getAttribute('data-name');
	var isOpen = theme.getAttribute('data-if-is-open');
	var count = theme.getAttribute('data-count');

	// console.log(name + ": " + isOpen + ": " + count);
	

	////////////////////////////////////////////////////
	// DRAW STARS //
	////////////////////////////////////////////////////

	if ( name === element ){
		// console.log("this is matched " + element + " " + isOpen);

		if ( isOpen === 'true'){
			// console.log(count);

			// IF THEME IS CURRENTLY OPENED
			// draw bold stars and link to new drawing

			// Create a symbol, which we will use to place instances of later:
			var star_open = new Path.Circle({
			    center: [0, 0],
			    radius: 8,
			    fillColor: 'red'
			});

			// MAKE GROUP - object? 
			var group1 = new Group();
			var symbol = new Symbol(star_open);

			// Place the instances of the symbol:
			for (var i = 1; i <= count; i++) {
				// first make theme cluster
				var center = Point.random() * view.size / 5; // *o 
				//center += offset;
				var placedSymbol = symbol.place(center);
				placedSymbol.scale(i / count);
				group1.addChild(placedSymbol);
			}

			// for (var j = 1; j <= HowManyClusterYOuWant; j++ ){
			// 	//var offset = Point.random() * view.size;
			// 	for (var i = 1; i <= count; i++) {
			// 	    // first make theme cluster
			// 	    var center = Point.random() * view.size / 5; // *o 
			// 	    //center += offset;
			// 	    var placedSymbol = symbol.place(center);
			// 	    placedSymbol.scale(i / count);
			// 	    group1.addChild(placedSymbol);
			// 	}
			// }

			// move whole group to the center


			var lineGroup = new Group();

			// whenever users hover
			group1.onMouseEnter = function(event){
				// console.log("GROUP 1 - ENTERED");

				console.log(group1._project.symbols[0]._definition.fillColor)
				group1._project.symbols[0]._definition.fillColor.hue = 200; // 0 - 360
				group1._project.symbols[0]._definition.scaling = 1.5;

				// get all position of children
				// for (var i = 0; i < group1.children.length - 1; i++){
				// 	console.log(group1.children[i]);
				// 	// console.log(group1.children[i].position.x);
				// }
			}

			group1.onMouseLeave = function(event){
				// console.log("GROUP 1 - OUT")
			}

			group1.onClick = function(event){
				// console.log("currently " + count + " people were participated: " + isOpen);
				location.href= "/theme/" + name;

				// $("#popup").css('visibility', 'visible');
				// $("#popup").html("");
				// $("#popup").append( "<br><button id='closePopup'>X</button><br>" +
				// 					"currently " + count + 
				// 					" people were participated: " +
				// 					isOpen);
				// $("#closePopup").click(function(){
				// 	console.log("close this one");
				// 	$("#popup").css('visibility', 'hidden');
				// });
			}



		} else {

			// IF THEME IS CLOSED
			// draw opaque one and link to gallery

			// Create a symbol, which we will use to place instances of later:
			var star_closed = new Path.Circle({
			    center: [0, 0],
			    radius: 5,
			    fillColor: 'yellow',
			    opacity: 0.5 // give them opacity
			});

			var group2 = new Group();
			var symbol = new Symbol(star_closed);

			// Place the instances of the symbol:
			for (var i = 1; i <= count; i++) {
			    // first make them cluster
			    var center = Point.random() * view.size / 5;
			    var placedSymbol = symbol.place(center);
			    placedSymbol.scale(i / count);

			    group2.addChild(placedSymbol);
			}

			// move them as well


			// whenever it's clicked
			group2.onClick = function(event){
				// console.log("it's clicked - from group 2");
				$("#popup").css('visibility', 'visible');
				$("#popup").html("");
				$("#popup").append( "<br><button id='closePopup'>X</button><br>" +
									"currently " + count + 
									" people were participated: " +
									isOpen);
				$("#closePopup").click(function(){
					console.log("close this one");
					$("#popup").css('visibility', 'hidden');
				});
			}

		}
	}

}



function drawCanvasIndex(){
	////////////////////////////////////////////////////
	// BACKGROUND //
	////////////////////////////////////////////////////

	var width = view.bounds.width;
	var height = view.bounds.height;

	// get id from canvas and set up
	var canvas = document.getElementById('background1');

	frame = new Path.Rectangle({
	    point: [0,0],
	    size: [width, height ],
	    fillColor: 'black'
	});
}

