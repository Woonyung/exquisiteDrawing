/* Made with love by Woonyung
/* woonyungchoi@gmail.com
/* 
/* Apr.20, 2015
/* changed display
*/

var themeList= [  
   {  
      "theme":"itp_thesis",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"itp_firstday",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"worst_haircut",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"spontaneous",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"roadTrip",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"postCard",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"laugh",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"pararell_World",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"smell",
      "image":"/thumbs/image_01.png"
   }, 
	//
   {  
      "theme":"paint",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"joy",
      "image":"/thumbs/image_01.png"
   },
   {  
      "theme":"weekends",
      "image":"/thumbs/image_01.png"
   }
]

var topMargin = 70;

$(document).ready(function(){
	// loop through all themes and load data
	for ( var i = 0; i < themeList.length; i++){
		// console.log(themeList[i]['theme']);
		getData(themeList[i]);
	}

	$(".thumbnails").hover(function(){
		console.log("hover");
	});
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
		// later change with image
		status = "on-going project"; 
	} else {
		status = "finished project";
	}

	// grid view
	// $("#polaroids").append("<li><a href='/theme/" + name + 
	// 						"'><div class='frames'><img class='thumbnails' src='" + 
	// 						thumbnails + "'><br>"+ 
	// 						"<span class='captions'>" + name + "</span>" +
	// 						"</div></a></li>");

	$("#polaroids").append("<li><a href='/theme/" + name + 
							"'><img class='thumbnails' src='" + 
							thumbnails + "'></a></li>");
	
}

