class Easel {
	// 16:9 aspect ratio is what is needed for standard high def televsion
	static get BASE_WIDTH() { return 608; } // 16*38 = 608
	static get BASE_HEIGHT() { return 342; } // 9*38 = 342	

	constructor(basic2DContext) {
		this.basicContext = basic2DContext;
	}

	get context() {
		return this.basicContext;
	}

	get canvas() {
		return this.basicContext.canvas;
	}

	/**
	 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
	 * @param {integer} refCoordX The reference coordinate x.
	 * @return {integer} Returns the x value in the current canvas reference frame
	 */
	translateDrawX(refCoordX) {
		var ratio = this.canvas.width / Easel.BASE_WIDTH;
		var newX = refCoordX * ratio;
		//console.log('newX =' + newX + ' ratio ' + ratio);
		return (newX);
	}

	/**
	 * Translates from the reference window size defined by BASE_WIDTH by BASE_HEIGHT.
	 * @param {integer} refCoordX The reference coordinate y.
	 * @return {integer} Returns the y value in the current canvas reference frame
	 */
	translateDrawY(refCoordY) {
		var ratio = this.canvas.height / Easel.BASE_HEIGHT;
		var newY = refCoordY * ratio;
		//console.log('y ' + refCoordY + ' newY =' + newY + 'canvas height ' + canvas.height + ' ratio ' + ratio);
		return (newY);
	}

	/**
	 * Does a draw image but changes the fourth quadrant to first quadrant for the coordinates.
	 */
	myDrawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
		this.context.drawImage(image,
			sx,
			sy,
			sWidth,
			sHeight,
			this.translateDrawX(dx), // Translating for window size from BASE coordinates
			this.canvas.height - this.translateDrawY(dy) - this.translateDrawY(dHeight), // translating so zero is at the bottom of the screen
			this.translateDrawX(dWidth), // Translating for window size from BASE coordinates
			this.translateDrawY(dHeight) // Translating for window size from BASE coordinates
		);

	}

	myDrawRect(aRect) {
		var x = this.translateDrawX(aRect.x);
		var y = this.canvas.height - this.translateDrawY(aRect.y) - this.translateDrawY(aRect.height);
		var width = this.translateDrawX(aRect.width);
		var height = this.translateDrawY(aRect.height);
		this.context.rect(x, y, width, height);
		this.context.fillRect(x, y, width, height);
		this.context.stroke();
	}

	eventXYInRect(currentEvent, aRect) {
		var translatedX = currentEvent.x;
		var translatedY = this.canvas.height - currentEvent.y;
		//console.log("x = " + translatedX + " y = " + translatedY);
		if ((translatedX > this.translateDrawX(aRect.x)) &&
			(translatedY > this.translateDrawY(aRect.y)) &&
			(translatedX < this.translateDrawX(aRect.x + aRect.width)) &&
			(translatedY < this.translateDrawY(aRect.y + aRect.height))) {
			return true;
		} else {
			return false;
		}
	
	}

	setCanvasSize() {
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			width = w.innerWidth,
			height = w.innerHeight;
		//alert('window ' + w.innerWidth + ' × ' + w.innerHeight + ' element ' + + e.clientWidth + ' × ' + e.clientHeight + ' body ' + + g.clientWidth + ' × ' + g.clientHeight);
		var calculatedHeight = width / 16 * 9;
		var calculatedWidth = height / 9 * 16;
	
		if (calculatedHeight < height) {
			this.canvas.width = width;
			this.canvas.height = calculatedHeight;
		} else {
			this.canvas.width = calculatedWidth;
			this.canvas.height = height;
		}
		//canvas.width = width;
		//canvas.height = height;
	
	}
	
	myFontSize(fontPointSize) {
		var newFontPointSize = Math.trunc(this.translateDrawY(fontPointSize));
		//console.log("New Font Size = %i", newFontPointSize)
		return (newFontPointSize);
	}
	
	
}


function isIntercecting(obj1, obj2) {

	if (obj1.x < obj2.x + obj2.width && obj2.x < obj1.x + obj1.width && obj1.y < obj2.y + obj2.height) {
		//    	console.log("Hit function");
		return obj2.y < obj1.y + obj1.height;
	} else
		return false;
}

////////////////////////////////////////////////////////////////////////



// OLD And NOT currently used

// this doesn't seem to work that great but it's the best I've found so far
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



