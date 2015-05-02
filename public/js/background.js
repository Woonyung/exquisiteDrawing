/* Made with love by Woonyung
/* woonyungchoi@gmail.com
/* 
/* Apr.20, 2015
/* randomly placed stars
*/



var themeList= ['itp_thesis', 'happiness','worst_haircut','memory'];
var topMargin = 70;

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
	var question = theme.getAttribute('data-question');
	var isOpen = theme.getAttribute('data-if-is-open');
	var count = theme.getAttribute('data-count');

	// console.log(question);
	// console.log(name + ": " + isOpen + ": " + count);
	
	// show if it is opened or closed project
	var status;
	if ( isOpen === 'true' ){
		status = "this is on-going project";
	} else {
		status = "this is closed project";
	}

	////////////////////////////////////////////////////
	// DRAW STARS //
	////////////////////////////////////////////////////

	if ( name === element ){

		if ( isOpen === 'true'){
			// console.log(count);

			// IF THEME IS CURRENTLY OPENED
			// draw bold stars and link to new drawing

			// Create a symbol, which we will use to place instances of later:
			var star_open = new Path.Circle({
			    center: [0, topMargin],
			    radius: 8,
			    fillColor: 'white'
			});

			// MAKE GROUP - object? 
			var group1 = new Group();
			var symbol = new Symbol(star_open);


			for (var j = 1; j <= themeList.length -1 ; j++ ){ // howmanyCluster you want = number of the themeList
				var offset = Point.random() * view.size;
				for (var i = 1; i <= count; i++) {
				    // first make theme cluster
				    var center = Point.random() * view.size/7;
				    // and add the random offset so that you can randomly place clusters.
				    center += offset;
				    
				    var placedSymbol = symbol.place(center);
				    placedSymbol.scale(i / count);
				    group1.addChild(placedSymbol);
				}
			}

			// var lineGroup = new Group();

			// whenever users hover
			group1.onMouseEnter = function(event){
				// console.log("GROUP 1 - ENTERED");

				// console.log(this._style);
				// console.log(group1._project.symbols[0]._definition.fillColor)
				// group1._project.symbols[0]._definition.fillColor.hue = 100; // 0 - 360
				// group1._project.symbols[0]._definition.scaling = 1.5;

				// get all position of children
				// for (var i = 0; i < group1.children.length - 1; i++){
				// 	console.log(group1.children[i]);
				// 	// console.log(group1.children[i].position.x);
				// }


				
			}

			group1.onMouseLeave = function(event){
				// console.log("GROUP 1 - OUT")
			}

			group1.onMouseDown = function(event){
				console.log("currently " + count + " people were participated: " + isOpen);
				// location.href= "/theme/" + name;
				// console.log(name);	

				$("#popup").fadeIn("slow");
				$("#popup").html("");
				$("#popup").append( "<br><button id='closePopup'>X</button><br>" +
									"currently " + count +  
									" people were participated <br>" +
									question + "<br>" + 
									status + "<br>" +
									"<a href='/theme/" + name + 
									"'>GO TO PAGE</a>");
				$("#closePopup").click(function(){
					$("#popup").fadeOut("slow");
				});
			}



		} else {

			// IF THEME IS CLOSED
			// draw opaque one and link to gallery

			// Create a symbol, which we will use to place instances of later:
			var star_closed = new Path.Circle({
			    center: [0, topMargin],
			    radius: 5,
			    fillColor: 'white',
			    opacity: 0.5 // give them opacity
			});

			var group2 = new Group();
			var symbol = new Symbol(star_closed);

			
			for (var j = 1; j <= themeList.length -1 ; j++ ){ // howmanyCluster you want = number of the themeList
				var offset = Point.random() * view.size;
				for (var i = 1; i <= count; i++) {
				    // first make theme cluster
				    var center = Point.random() * view.size/ 9;
				    // and add the random offset so that you can randomly place clusters.
				    center += offset;
				    
				    var placedSymbol = symbol.place(center);
				    placedSymbol.scale(i / count);
				    group2.addChild(placedSymbol);
				}
			}


			// whenever users hover
			group2.onMouseEnter = function(event){
				// console.log("GROUP 2 ENTERED");

				// console.log(group2._project.symbols[0]._definition.fillColor)
				// group2._project.symbols[0]._definition.fillColor.hue = 350; // 0 - 360
				// group2._project.symbols[0]._definition.scaling = 1.5;

			
			}

			// whenever it's clicked
			group2.onMouseDown = function(event){
				console.log("it's clicked - from group 2");
			
				$("#popup").fadeIn("slow");
				$("#popup").html("");
				$("#popup").append( "<br><a id='closePopup'>X</a><br>" +
									"currently " + count +  
									" people were participated <br>" +
									question + "<br>" + 
									status + "<br>" +
									"<a href='/theme/" + name + 
									"'>GO TO PAGE</a>");
				$("#closePopup").click(function(){
					$("#popup").fadeOut("slow");
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
	var height = view.bounds.height / 1.5;

	// get id from canvas and set up
	var canvas = document.getElementById('background1');

	// frame = new Path.Rectangle({
	//     point: [0, 0],
	//     size: [width, height ],
	//     fillColor: 'blue'
	// });
}

