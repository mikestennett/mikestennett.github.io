
// allScreens.get("screenName") // returns screen

var allScreens = (function () {
    var myCurrentScreen;
    var firstTime = true;
    var noScreenFoundName = "No Screen Found";
    var allTheScreens = new Map();

    function privatefunction() { // not used
        var object = new Object("I am the instance");
        return object;
    }
 
    return {
        currentScreen: function () {
            var tmpScreen;
            if (firstTime) {
                firstTime = false;
                tmpScreen = new GameScreen(noScreenFoundName);
                if (typeof(myCurrentScreen) == "undefined") {
                    myCurrentScreen = tmpScreen;
                }
            }
            tmpScreen = myCurrentScreen;
            return myCurrentScreen;
        },

        addNewScreen: function(screenName, screen) {
            allTheScreens = allTheScreens.set(screenName, screen);
        },
        setScreenTo: function(screenName) {
            var tmpScreen = allTheScreens.get(screenName);
            if (typeof(tmpScreen) != "undefined") {
                myCurrentScreen = tmpScreen;
                tmpScreen.enteringGameScreen();
            } else {
                myCurrentScreen = allTheScreens.get(noScreenFoundName);
            }
        },
        getScreen: function(screenName) {
            var tmpScreen = allTheScreens.get(screenName);
            if (typeof(tmpScreen) == "undefined") {
                myCurrentScreen = allTheScreens.get(noScreenFoundName);
            }
            return tmpScreen;
        }
    };
})();

function GameScreen(screenName) {
    this.screenName = screenName;
    this.nextScreen = screenName;
    this.moveToNextScreen = false;
    allScreens.addNewScreen(screenName, this);
    this.eventObjs = new Array();
};

GameScreen.prototype.addEventObj = function (eventObj) {
    // output a generic screen
   eventObjs.push(eventObj);
};


GameScreen.prototype.renderScreen = function () {
    // output a generic screen
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.screenName, canvas.width / 2, canvas.height / 2);
};

GameScreen.prototype.onTouchStart = function (currentEvent) {
    // do nothing
    var index, len = this.eventObjs.length;
    for (index = 0; index < len; ++index) {
        this.eventObjs[index].onTouchStart(currentEvent);
    }
};


GameScreen.prototype.onTouchEnd = function (currentEvent) {
    // do nothing
    var index, len = this.eventObjs.length;
    for (index = 0; index < len; ++index) {
        this.eventObjs[index].onTouchEnd(currentEvent);
    }
    if (len == 0) {
        allScreens.setScreenTo(this.nextScreen);
    }
    console.log("GameState.onTouchStart");
};


GameScreen.prototype.onTouchMove = function (currentEvent) {
    var index, len = this.eventObjs.length;
    for (index = 0; index < len; ++index) {
        this.eventObjs[index].onTouchMove(currentEvent);
    }
};


GameScreen.prototype.onKeyUp = function (currentEvent) {
    var index, len = this.eventObjs.length;
    for (index = 0; index < len; ++index) {
        this.eventObjs[index].onKeyUp(currentEvent);
    }
};


GameScreen.prototype.enteringGameScreen = function () {
    // do nothing
};


