function Button(options) {
	this.name = options.name;
	this.x = options.x;
	this.y = options.y;
	this.width = options.width;
    this.height = options.height;
    this.clickedCallback;
	this.fontPointSize = Math.trunc(this.height*0.75);
	this.isPressed = false;
	this.isClicked = false;
}

Button.prototype.setCallback = function(callback) {
    this.clickedCallback = callback;
    var x = 1;
}

Button.prototype.render = function () {
	// draw a box
	var tmpFillStyle = ctx.fillStyle;
	if (this.isPressed) {
		ctx.fillStyle = 'black';
	} else {
		ctx.fillStyle = 'white';
	}
	myDrawRect(this);
	// draw name
	if (this.isPressed) {
		ctx.fillStyle = 'white';
	} else {
		ctx.fillStyle = 'black';
	}
	ctx.font = myFontSize(this.fontPointSize) + "px Arial";
	ctx.textAlign = "center";
	ctx.fillText(this.name, 
		translateDrawX(this.x + (this.width/2)), 
		canvas.height - translateDrawY(this.y) - translateDrawY(this.height*0.25)) ;
	ctx.fillStyle = tmpFillStyle;
}

Button.prototype.onTouchStart = function (currentEvent) {
	if (eventXYInRect(currentEvent, this)) {
		this.isPressed = true;
	}
}

Button.prototype.onTouchMove = function (currentEvent) {
	if (pressedDown) {
		if (eventXYInRect(currentEvent, this)) {
			this.isPressed = true;
		} else {
			this.isPressed = false;
		}
	}  
}

Button.prototype.onTouchEnd = function (currentEvent) {
	if(this.isPressed) {
		this.isPressed = false;
        this.isClicked = true;
        this.clickedCallback();
	}	

}

