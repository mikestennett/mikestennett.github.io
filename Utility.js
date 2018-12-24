/**
 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
 * @param {integer} refCoordX The reference coordinate x.
 * @return {integer} Returns the x value in the current canvas reference frame
 */
function translateDrawX(refCoordX) {
	ratio = canvas.width / BASE_WIDTH;
	newX = refCoordX * ratio;
	//console.log('newX =' + newX + ' ratio ' + ratio);
	return (newX);
}

/**
 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
 * @param {integer} refCoordX The reference coordinate y.
 * @return {integer} Returns the y value in the current canvas reference frame
 */
function translateDrawY(refCoordY) {
	ratio = canvas.height / BASE_HEIGHT;
	newY = refCoordY * ratio;
	//console.log('y ' + refCoordY + ' newY =' + newY + 'canvas height ' + canvas.height + ' ratio ' + ratio);
	return (newY);
}

function myFontSize(fontPointSize) {
	var newFontPointSize = Math.trunc(translateDrawY(fontPointSize));
	//console.log("New Font Size = %i", newFontPointSize)
	return(newFontPointSize);
}



/**
 * Does a draw image but changes the fourth quadrant to first quadrant for the coordinates.
 */
function myDrawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
	ctx.drawImage(image,
		sx,
		sy,
		sWidth,
		sHeight,
		translateDrawX(dx), // Translating for window size from BASE coordinates
		canvas.height - translateDrawY(dy) - translateDrawY(dHeight), // translating so zero is at the bottom of the screen
		translateDrawX(dWidth), // Translating for window size from BASE coordinates
		translateDrawY(dHeight) // Translating for window size from BASE coordinates
	);

}

function myDrawRect(aRect) {
	var x = translateDrawX(aRect.x);
	var	y = canvas.height - translateDrawY(aRect.y) - translateDrawY(aRect.height);
	var	width = translateDrawX(aRect.width);
	var	height = translateDrawY(aRect.height);
	ctx.rect(x, y, width, height);
	ctx.fillRect(x, y, width, height);
	ctx.stroke();
}



function isIntercecting(obj1, obj2) {

	if (obj1.x < obj2.x + obj2.width && obj2.x < obj1.x + obj1.width && obj1.y < obj2.y + obj2.height) {
		//    	console.log("Hit function");
		return obj2.y < obj1.y + obj1.height;
	} else
		return false;
}

//var eventXYInRect = function(currentEvent, aRect) {
function eventXYInRect(currentEvent, aRect) {
	var translatedX = currentEvent.x;
	var translatedY = canvas.height - currentEvent.y;
	//console.log("x = " + translatedX + " y = " + translatedY);
	if ((translatedX > translateDrawX(aRect.x)) &&
		(translatedY > translateDrawY(aRect.y)) &&
		(translatedX < translateDrawX(aRect.x + aRect.width)) &&
		(translatedY < translateDrawY(aRect.y + aRect.height))) {
		return true;
	} else {
		return false;
	}

}

// this doesn't seem to work that greate but it's the best I've found so far
function determineFontHeight(fontStyle) {
	var body = document.getElementsByTagName("body")[0];
	var dummy = document.createElement("div");
	var dummyText = document.createTextNode("MgR");
	dummy.appendChild(dummyText);
	dummy.setAttribute("style", fontStyle);
	body.appendChild(dummy);
	var result = dummy.offsetHeight;
	body.removeChild(dummy);
	return result + 5;
};

function determineFontHeight2(fontStyle) {
	var emHeight = parseInt(ctx.font.split(' ')[0].replace('px', '')); //parsing string
	return emHeight;
};

function textLineHeight() {
	//	console.log("font = " + ctx.font);
	var myheight = determineFontHeight2(ctx.font);
	//	console.log("textLineHeight = " + myheight);
	return myheight;
}

//var setCanvasSize = function () {

function setCanvasSize() {
	var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		width = w.innerWidth,
		height = w.innerHeight;
	//alert('window ' + w.innerWidth + ' × ' + w.innerHeight + ' element ' + + e.clientWidth + ' × ' + e.clientHeight + ' body ' + + g.clientWidth + ' × ' + g.clientHeight);
	var calculatedHeight = width/16*9;
	var calculatedWidth = height/9*16;
	
	if (calculatedHeight < height) {
		canvas.width = width;
		canvas.height = calculatedHeight;
	} else {
		canvas.width = calculatedWidth;
		canvas.height = height;
	}
	//canvas.width = width;
	//canvas.height = height;

}

