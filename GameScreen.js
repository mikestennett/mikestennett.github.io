

class AllScreens {

    constructor() {
        this.myCurrentScreen;
        this.firstTime = true;
        this.noScreenFoundName = "No Screen Found";
        this.allTheScreens = new Map();
    }

    currentScreen() {
        var tmpScreen;
        if (this.firstTime) {
            this.firstTime = false;
            tmpScreen = new GameScreen(this.noScreenFoundName);
            if (typeof (this.myCurrentScreen) == "undefined") {
                this.myCurrentScreen = tmpScreen;
            }
        }
        tmpScreen = this.myCurrentScreen;
        return this.myCurrentScreen;
    }

    addNewScreen(screenName, screen) {
        this.allTheScreens = this.allTheScreens.set(screenName, screen);
    }

    setScreenTo(screenName) {
        var tmpScreen = this.allTheScreens.get(screenName);
        if (typeof (tmpScreen) != "undefined") {
            this.myCurrentScreen = tmpScreen;
            tmpScreen.enteringGameScreen();
        } else {
            this.myCurrentScreen = this.allTheScreens.get(this.noScreenFoundName);
        }
    }

    getScreen(screenName) {
        var tmpScreen = this.allTheScreens.get(screenName);
        if (typeof (tmpScreen) == "undefined") {
            this.myCurrentScreen = this.allTheScreens.get(this.noScreenFoundName);
        }
        return tmpScreen;
    }

    static getInstance() {
        return (AllScreens.instance == null) ? AllScreens.instance = new AllScreens() : AllScreens.instance;
    }

}

class GameScreen {
    constructor(screenName) {
        this.screenName = screenName;
        this.nextScreen = screenName;
        AllScreens.getInstance().addNewScreen(screenName, this);
        this.eventObjs = new Array();
    }

    addEventObj(eventObj) {
        eventObjs.push(eventObj);
    }

    renderScreen() {
        var index, len = this.eventObjs.length;
        for (index = 0; index < len; ++index) {
            this.eventObjs[index].render();
        }
        if (len == 0) {
            // output a generic screen
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText(this.screenName, canvas.width / 2, canvas.height / 2);
        }
    }
    
    onTouchStart(currentEvent) {
        // do nothing
        var index, len = this.eventObjs.length;
        for (index = 0; index < len; ++index) {
            this.eventObjs[index].onTouchStart(currentEvent);
        }
    }

    onTouchEnd(currentEvent) {
        var index, len = this.eventObjs.length;
        for (index = 0; index < len; ++index) {
            this.eventObjs[index].onTouchEnd(currentEvent);
        }
        if (len == 0) {
            AllScreens.getInstance().setScreenTo(this.nextScreen);
        }
        console.log("GameState.onTouchStart");
    }
    
    onTouchMove(currentEvent) {
        var index, len = this.eventObjs.length;
        for (index = 0; index < len; ++index) {
            this.eventObjs[index].onTouchMove(currentEvent);
        }
    }
    
    onKeyUp(currentEvent) {
        var index, len = this.eventObjs.length;
        for (index = 0; index < len; ++index) {
            this.eventObjs[index].onKeyUp(currentEvent);
        }
    }
    
    enteringGameScreen() {
        // do nothing
    }
}

