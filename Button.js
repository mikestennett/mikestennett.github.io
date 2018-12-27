

class Button {
	constructor(options) {
		this.name = options.name;
		this.x = options.x;
		this.y = options.y;
		this.width = options.width;
		this.height = options.height;
		this.gameScreen = options.gameScreen || undefined;
		this.clickedCallback;
		this.fontPointSize = Math.trunc(this.height*0.75);
		this.isPressed = false;
		this.isClicked = false;
	}
	
	setCallback(callback) {
		this.clickedCallback = callback;
		var x = 1;
	}
	
	render() {
		// draw a box
		var ctx = this.gameScreen.context;
		var easel = this.gameScreen.easel;
		var tmpFillStyle = ctx.fillStyle;
		if (this.isPressed) {
			ctx.fillStyle = 'black';
		} else {
			ctx.fillStyle = 'white';
		}
		easel.myDrawRect(this);
		// draw name
		if (this.isPressed) {
			ctx.fillStyle = 'white';
		} else {
			ctx.fillStyle = 'black';
		}
		ctx.font = easel.myFontSize(this.fontPointSize) + "px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.name, 
			easel.translateDrawX(this.x + (this.width/2)), 
			this.gameScreen.canvas.height - easel.translateDrawY(this.y) - easel.translateDrawY(this.height*0.25)) ;
		ctx.fillStyle = tmpFillStyle;
	}
	
	onTouchStart(currentEvent) {
		if (this.gameScreen.easel.eventXYInRect(currentEvent, this)) {
			this.isPressed = true;
		}
	}
	
	onTouchMove(currentEvent) {
		if (this.gameScreen.mouseIsDown) {
			if (this.gameScreen.easel.eventXYInRect(currentEvent, this)) {
				this.isPressed = true;
			} else {
				this.isPressed = false;
			}
		}  
	}
	
	onTouchEnd(currentEvent) {
		if(this.isPressed) {
			this.isPressed = false;
			this.isClicked = true;
			this.clickedCallback();
		}
	}
}
