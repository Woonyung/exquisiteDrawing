var friendsEmail;

$(document).ready(function(){
	$("#pingMe").click(function(){
		// calculate the date...

		// then send the email
		// pingMe();
	});

	// $("#addInputs").click(function(){
	// 	console.log("added");
	// 	$("#friendsArea").append("<input type='text' class='inputs'><br>");
	// });

	$("#invite").click(function(){
		friendsEmail = $(".inputs").val();
		console.log(friendsEmail);

		// email validation
		var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		if (friendsEmail == '' || !friendsEmail.match(regex)){
			// console.log("Type correctly");
		} else {
			sendEmail("woonyungchoi@gmail.com", friendsEmail);
		}
		
		// multiple email..
		// append "TO" array
	});

});

function sendEmail( _from, _to){
	var from = _from;
	var to = _to;

	$.ajax({
	  type: "POST",
	  url: "https://mandrillapp.com/api/1.0/messages/send.json",
	  data: {
	    'key': 'HzB5epBh9JoISy2kb9wAvA',
	    'message': {
	      'from_email': from,
	      'to': [
	          {
	            'email': to,
	            'name': 'RECIPIENT NAME (OPTIONAL)',
	            'type': 'to'
	          }
	        ],
	      'autotext': 'true',
	      'subject': 'Would you join this drawing projet?',
	      'html': '----------it will be contents-------'
	    }
	  }
	}).done(function(response) {
		console.log(response); // if you're into that sorta thing
	});
}
