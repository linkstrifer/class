//App vars
var app = [];

//Router
var Router = Backbone.Router.extend({
	routes: {
		'section/:step': 'sectionRoute',
		'*actions': 'indexRoute',
	},
	current: function () {
	  var fragment = Backbone.history.fragment,
		  routes = _.pairs(this.routes),
		  route,
		  name,
		  found;

	  found = _.find(routes, function (namedRoute) {
		route = namedRoute[0];
		name = namedRoute[1];

		if (!_.isRegExp(route)) {
		  route = this._routeToRegExp(route);
		}

		return route.test(fragment);
	  }, this);

	  if (found) {
		return {
		  name: name,
		  params: this._extractParameters(route, fragment),
		  fragment: fragment
		};
	  }
	}
});

app.router = new Router;

//Routes actions
app.router.on('route:indexRoute', function() {
	app.router.navigate('#/section/0');
});

app.router.on('route:sectionRoute', function(step) {
	scrollSection(step);
});

Backbone.history.start();

//Functions
function nextSection() {
	var step = app.router.current().params[0];
	step++;
	app.router.navigate('#/section/' + step);
}

function prevSection() {
	var step = app.router.current().params[0];
	if(step > 0) {
		step--;
	}
	app.router.navigate('#/section/' + step);
}

function fixIframe() {
}

function scrollSection(step) {
	var $section = $('section[data-step="' + step + '"]'),
		offset = $(window).height() - $section.height();
	offset = offset/2;
	offset -= 105;
	$('section').removeClass('show');
	$section.addClass('show');
	$.scrollTo($section, 1 * 1000, {offset: -offset});
}

//On key press
$(document).keydown(function(event) {
	if(event.keyCode == 37) {
		prevSection();
	}
	if(event.keyCode == 39) {
		nextSection();
	}

});
//On ready
$(document).ready(function() {
	fixIframe();
});

//On resize
$(window).resize(function() {
	fixIframe();
});

//On scroll
$(window).scroll(function() {
});