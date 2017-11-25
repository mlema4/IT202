var currentQuote = {};    
    
      var db = new Dexie('Quote');

        	db.version(1).stores({
        		quotes: 'id, category, author, quote'
        	});
 
        	db.open().catch(function(error) {
        		alert('Uh oh : ' + error);
        	});


$("#saveQuote").on("click", function() {
  db.quotes.add({
		id: currentQuote.id, 
		category: currentQuote.category, 
		author: currentQuote.author, 
		quote: currentQuote.quote
	});

});

$("#getQuote").on("click", function() {
  $("#quote").text("");
  
  $.get("https://quotes.rest/qod.json", function(response) {
    currentQuote = response.contents.quotes[0];
    $("#quote").append( response.contents.quotes[0].quote );
  });
});

$("#say").on("click", function() {
  say( $("#quote").text() );
});

function listSavedQuotes () {
  console.log()
  $(".savedQuotes").empty();
  db.quotes
		.each (function (quote) {
		  
		  var clone = $("#listSavedQuotes").clone();
		  console.log(clone);
		  clone.text(quote.quote);
		  clone.attr("id", quote.id);
		  $("body").append(clone);
		  
		  
		  //$("#savedQuotes").append(quote.quote);
		});

  
}

$("#getSavedQuotes").on("click", listSavedQuotes);

function say (strText) {
  var msg = new SpeechSynthesisUtterance(strText);
  window.speechSynthesis.speak(msg);
}
