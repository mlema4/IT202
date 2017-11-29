  var movieInfo = [];
  
  var mylatitude, mylongitude;
  
             var db = new Dexie('Movie');

        	db.version(1).stores({
        		movies: 'title, location, rating'
        	});
 
        	db.open().catch(function(error) {
        		alert('Uh oh : ' + error);
        	});
        	
        	
        	
    function saveMovie (id) {
      newid = parseInt(id)
      var info = movieInfo[newid];

        db.movies.add({
      		 title: info.title,
      		 location: info.location,
      		 rating: info.rating
      	});
      	
      	console.log("TEST");
    }
    
  $(document).ready(function() {
    $("#screen1").show();
    


    $("#search").on("click", function() {
      
      $("#screen1").hide();
      $("#screen2").show();
      $("#screen2").removeAttr("class");
      $("#search").prop("disabled", false);

      var url = "https://data.cityofchicago.org/resource/cm53-g3up.json";

      parameters = new Object();
      if (Date.parse($("#date").val())) {
        parameters.date = $("#date").val();
      }

      if ($("#title").val().length !== 0)
        parameters.title = $("#title").val();

      parameters.rating = $("#rating").val();
      var parameterString = $.param(parameters);

      var showLocation = false;
      if ($("#location").val()){
showLocation = true;
      }
      $.get(url + "?" + parameterString, function(response) {
        console.log(url + "?" + parameterString);
        /*        console.log(response);
                console.log(url + "?" + parameterString);
                console.log(response[0].location);
                 if (response[0].location){
                    console.log(response[0].location.coordinates[0])
                 }*/

        // $("#screen2").append("Results found: " + response.length);
        var chicago = { lat: 41.8781, lng: -87.6298 };
        var map = new google.maps.Map(document.getElementById('screen2'), {
          zoom: 10,
          center: chicago
        });
        map.addListener(map, 'idle', function() {
          map.trigger(map, 'resize');
        });

        
        var counter = 0;
        $.each(response, function(indx, val) {
          
          //console.log(val);
          /*          var template = $("#template").clone().removeAttr('id').removeClass("hidden");
                    
                    
                    $(".card-title", template).html("<Strong>" + val.dba_name + "</Strong>");
                    $(".card-subtitle", template).text(val.aka_name + " " + val.address);
                    $(".card-text", template).html("Inspection ID:" + val.inspection_id + "<br>" + "Inspection date: "+ val.inspection_date + "<br>" + "Inspection result: " + val.results);
                    $("#screen2").append(template);
                    //$("#template", template).attr('id', "show");*/

          if (val.location) {
            var info = {title:val.title, date: val.date, location:val.location_address, rating:val.rating, park:val.park};
            movieInfo[counter] = info;
            counter++;
            var infoString = val.title + "<br>Date: " + val.date + "<br> Address: " + val.location_address + "<br> Rating: " + val.rating + "<br> Park:" + val.park;
            var buttonCode =   '<a id=" ' +  indx + '"  class="btn btn-primary btn-lg" href="#screen3" role="button" disabled onclick="saveMovie(this.id)">Save</a>' 
            var contentString = '<div id="content">' +
              '<div id="siteNotice">' +
              '</div>' +
              '<h1 id="firstHeading" class="firstHeading">' + val.title + '</h1>' +
              '<div id="bodyContent">' +
              '<p>' +
              infoString +
              '</div>' + buttonCode +
              '</div>';


            //console.log(contentString);
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });

            var latitude = parseFloat(val.location.coordinates[1]);
            var longitude = parseFloat(val.location.coordinates[0]);
            
            console.log(latitude);
            console.log(longitude);
            var location = { lat: latitude, lng: longitude };
            var marker = new google.maps.Marker({
              icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              position: location,
              map: map,
              title: val.title,
              visible:true
            });
            
            marker.addListener('click', function() {
              infowindow.open(map, marker);
            });
          }
        });
                if(showLocation == true){
          geoFindMe();
          var mylocation = {lat: parseFloat(mylatitude), lng: parseFloat(mylongitude)};
        var marker = new google.maps.Marker({
            icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            position: mylocation,
            title:"Your Location",
            visible: true
        });
        marker.setMap(map);
       
        }

      });


      //    id, DBA Name, AKA Name, address, inspection date, result


    });

    $(".link").on("click", function() {
      $(".screen").hide();
      $("#screen2").hide();
      $("#screen1").hide();
      var target = $(this).attr("href");
      console.log(target);
      $(target).show();
     // google.maps.event.trigger(map, 'resize');
    });
    
    $("#showSaved").on("click", function(){
      $(".savedMovies").empty();
        db.quotes
      		.each (function (movie) {
      		  
      		  var template = $("#template").clone().removeAttr('id').removeClass("hidden");
                    
                    
                    $(".card-title", template).html("<Strong>" + movie.title  + "</Strong>");
                    $(".card-text", template).html("Location" + val.location + "<br>" + "Rating "+ val.rating + "<br>" );
                    $("#info").append(template);
                    //$("#template", template).attr('id', "show");*/
      		  
      		  
      		  var clone = $("#listSavedQuotes").clone();
      		  console.log(clone);
      		  clone.text(quote.quote);
      		  clone.attr("id", quote.id);
      		  $("body").append(clone);
      		  
      		  
      		  //$("#savedQuotes").append(quote.quote);
      		});

  
        
       
    });

  });
  
  function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
   mylatitude  = position.coords.latitude;
   mylongitude = position.coords.longitude;

  }

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }



  navigator.geolocation.getCurrentPosition(success, error);
}
  

  