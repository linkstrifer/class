//var
var client_id = 'b60a070c60234b1095f4734c017ad39f',
	map,
	marker;

//App object
var App = function() {
	//Object properties
	this.client_id;
	this.tag;

	//client_id set and get functions
	this.setClientId = function(client_id) {
		this.client_id = client_id; //set client_id property
	}

	this.getClientId = function() {
		return this.client_id; //get client_id property
	}

	//tag set and get functions
	this.setTag = function(tag) {
		this.tag = tag; //set tag property
	}

	this.getTag = function() {
		return this.tag; //get tag property
	}

	//getPhotos function
	this.getPhotos = function() {
		var url = 'https://api.instagram.com/v1/tags/' + this.tag + '/media/recent?callback=?&client_id=' + this.client_id; //instagram api url
		$.getJSON(url) //get json from instagram
		.done(this.showPhotos); //success function
	}

	//showPhotos function
	this.showPhotos = function(json) {
		//each data function
		$.each(json.data, function(index, photo) {
			var low_resolution_url = photo.images.low_resolution.url, //instagram low resolution picture url
				lat = (photo.location != null) ? photo.location.latitude : null, //latitude photo
				lng = (photo.location != null) ? photo.location.longitude : null, //longitude photo
				img = '<img src="' + low_resolution_url + '" class="photo" data-lat="' + lat + '" data-lng="' + lng + '" />'; //img element with src, latitude and longitude

			$('#gallery').append(img); //append img to gallery element
		});
	}

	//currentPhoto function
	this.currentPhoto = function() {
		var windowPosition = $(document).scrollTop(); //scroll current position
		//each img element function
		$('img.photo').each(function() {
			var position = $(this).offset().top - windowPosition; //img current position - scroll current position
			if(position > 0) {
				$(this).addClass('active'); //if img current position - scroll current position > 0, add class active
			} else {
				$(this).removeClass('active'); //if img current position - scroll current position <= 0, remove class active
			}
		});
		$('img').removeClass('current'); //remove current class to all img elements
		$('img.active').first().addClass('current'); //add current class to first img element
		var $current = $('.current'); //save img.current in a var
		if($current.attr('data-lat') != 'null') { //if img.current location exist
			var photo_position = new google.maps.LatLng($current.attr('data-lat'), $current.attr('data-lng')); //get photo position from data-lat and data-lng element attributes and convert in a google maps LatLng position
			map.panTo(photo_position); //move center of map to photo position
			marker.setMap(map); //set marker map if is null
			marker.setPosition(photo_position); //set marker position to photo position
			$('#not-map').removeClass('show'); //hide not-map message
		} else { //if img.current location not exist
			marker.setMap(null); //set marker map to null to remove it
			$('#not-map').addClass('show'); //shot not-map message
		}
	}

	//loadMap function
	this.loadMap = function() {
		var center = new google.maps.LatLng(8.7432252, -75.8754903); //define google maps LatLng coordinates 8.7432252, -75.8754903
		//define map options
	  var mapOptions = {
	    zoom: 16, //define map zoom
	    center: center, //define center of map
	    mapTypeId: google.maps.MapTypeId.ROADMAP //define map type
	  };
	  
	  //instantiate map
	  map = new google.maps.Map(document.getElementById('map-canvas'), //set map in #map-canvas div
	      mapOptions); //set map options
	  
	  //instantiate marker
	  marker = new google.maps.Marker({
	    position: center, //set marker position
	    map: map, //set marker map
	    title:"Droides" //set marker title
		});
	}
}


var stormtrooper = new App(); //instanciate object
stormtrooper.setClientId(client_id); //set client_id
stormtrooper.setTag('droids'); //set tag
stormtrooper.getPhotos(); //call getPhotos function

$(window).load(function() { //on window load
	stormtrooper.loadMap(); //call loadMap function
	stormtrooper.currentPhoto(); //call currentPhoto function
});

$(window).scroll(function() { //on every window scroll
	stormtrooper.currentPhoto(); //call currentPhoto function
});