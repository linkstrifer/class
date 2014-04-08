addSteps();
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
	if(step == 'NaN') {
		app.router.navigate('#/section/0');
	}
	scrollSection(step);
});

Backbone.history.start();

//Functions
function addSteps() {
	var step = 0;
	$('section').each(function() {
		$(this).attr('data-step',step);
		step++;
	});
}
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
	$.scrollTo.window().stop(true);
	var $section = $('section[data-step="' + step + '"]'),
		//offset = ($section.height() + 21 + 63 + 63 + 63) - $(window).height();
		offset = -20;
	//offset = offset / 2;
	$('section').removeClass('show');
	$section.addClass('show');
	$.scrollTo($section, 1 * 1000, {offset: offset});
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
	prettyPrint();
});

//On resize
$(window).resize(function() {
	fixIframe();
});

//On scroll
$(window).scroll(function() {
});
