if (window.loadphotoswipejs) {
	console.log("You've loaded load-photoswipe.js twice. See https://github.com/liwenyip/hugo-easy-gallery/issues/6")
} 
var loadphotoswipejs = 1;

var verboseLogging = true;

/* TODO: Make the share function work */
/* TODO differentiate between thumbnails and full image */

if (document.readyState != 'loading') {
	OnDocumentReady();
} else {
	document.addEventListener('DOMContentLoaded', OnDocumentReady);
}

function OnDocumentReady() {

	var items = []; // array of slide objects that will be passed to PhotoSwipe()

	var figures = document.querySelectorAll("figure");        
	Array.prototype.forEach.call(figures, function (figure, i) { 

		if(figure.classList.contains('no-photoswipe')) return true; // ignore any figures where class="no-photoswipe"

		// get properties from child a/img/figcaption elements,
		var a 		= figure.querySelector("a"),
			img 	= figure.querySelector("img"),
			src   	= a.getAttribute("href"),
			title   = img.getAttribute("alt"),
			msrc	= img.getAttribute("src");
		
		if (img.getAttribute('imgH')) {
			var height 	= img.getAttribute('imgH');
			var width 	= img.getAttribute('imgW');
			var item = {
				src		: src,
				w		: width,
				h 		: height,
				title 	: title,
				msrc	: msrc
			};
			log("Using pre-defined dimensions for " + src + "(" + width + "x" + height + ")");
		
		} else {
			// if not, set temp default size then load the image to check actual size
			var item = {
				src		: src,
				w		: 800, // temp default size
				h 		: 600, // temp default size
				title 	: title,
				msrc	: msrc
			};
			log("Using default dimensions for " + src);
			// load the image to check its dimensions
			// update the item as soon as w and h are known (check every 30ms)
			var img = new Image(); 
			img.src = src;
			var wait = setInterval(function() {
				var w = img.naturalWidth,
					h = img.naturalHeight;
				if (w && h) {
					clearInterval(wait);
					item.w = w;
					item.h = h;
					log("Got actual dimensions for " + img.src);
				}
			}, 30);
			}
			
		// Save the index of this image then add it to the array
		var index = items.length;
		items.push(item);

		// Event handler for click on a figure
		figure.addEventListener('click', function(event) {
			event.preventDefault(); // prevent the normal behaviour i.e. load the <a> hyperlink
			// Get the PSWP element and initialise it with the desired options
			var pswp = document.querySelector('.pswp');
			var options = {
				index: index, 
				bgOpacity: 0.8,
				showHideOpacity: true
			}
			new PhotoSwipe(pswp, PhotoSwipeUI_Default, items, options).init();
		});	
	});
}

function log(text) {
	if(verboseLogging) {
		console.log(text);
	}
}