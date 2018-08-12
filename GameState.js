function GameScreen (screenName) {
    this.screenName = screenName;
    this.nextScreen = this;
    this.moveToNextScreen = false;
};

GameScreen.prototype.renderScreen = function() {
    // output a generic screen
		ctx.font = "30px Arial";
		ctx.textAlign = "center";
		ctx.fillText(this.screenName, canvas.width / 2, canvas.height / 2);
};

GameScreen.prototype.onClick = function(currentEvent) {
    // do nothing
    this.moveToNextScreen = true;
    console.log("GameState.onClick");
};

GameScreen.prototype.onKeyUp = function(currentEvent) {
	// do nothing
};


GameScreen.prototype.enteringGameScreen = function() {
    // do nothing
};


GameScreen.prototype.checkAndGoToNext = function() {
	if (this.moveToNextScreen) {
        this.moveToNextScreen = false;
        //console.log("current screen");
        //console.log(this);
        //console.log("next screen");
        //console.log(this.nextScreen);
        this.nextScreen.enteringGameScreen();
        return this.nextScreen;
    } else {
        return this;
    }
};

GameScreen.prototype.goToNextScreen = function() {
    this.moveToNextScreen = true;
};

