/* Made with love by Woonyung
/* woonyungchoi@gmail.com
/* 
/* Apr.20, 2015
/* randomly placed stars
*/



// var themeList= ['itp_thesis', 'happiness'];
var themeList= [  
   {  
      "theme":"itp_thesis",
      "image":"http://p1.pichost.me/640/8/1311384.jpg"
   },
   {  
      "theme":"happiness",
      "image":"http://www.canoefoundation.org.uk/cf/assets/Image/Yellow%20Duck.jpg"
   }
]

var topMargin = 70;

$(document).ready(function(){
	// loop through all themes and load data
	for ( var i = 0; i < themeList.length; i++){
		// console.log(themeList[i]['theme']);
		getData(themeList[i]);
	}

});


// make group for seperate for each themes
// but also put group on the random spot

function getData(element){

	var thumbnails = element['image'];

	// and draw stars
	var theme = document.getElementById(element['theme']);

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

	$("#displayInfo").append("<a href='/theme/" + name + 
							"'><div class='frames'><img class='thumbnails' src='" + 
							thumbnails + "'><br>"+ 
							"Q: " + question + 
							"</div></a>");
}

