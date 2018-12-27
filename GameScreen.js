

class AllScreens {

    constructor() {
        this.myCurrentScreen;
        this.firstTime = true;
        this.noScreenFoundName = "No Screen Found";
        this.allTheScreens = new Map();
        this.theCanvas;
        this.theContext;
        this.theEasel;
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

    setCanvas(canvasId) {
        this.theCanvas = document.getElementById(canvasId);
        this.theContext = this.canvas.getContext("2d");
        this.theEasel = new Easel(this.theContext);
    }

    get canvas() {  // getter - syntax like a property but is a funciton 
        return this.theCanvas;
    }

    get context() {
        return this.theContext;
    }

    get easel() {
        return this.theEasel;
    }


    static getInstance() {
        return (AllScreens.instance == null) ? AllScreens.instance = new AllScreens() : AllScreens.instance;
    }

    static currentScreen() {
        return AllScreens.getInstance().currentScreen();
    }



}

class GameScreen {
    constructor(screenName) {
        this.screenName = screenName;
        this.nextScreen = screenName;
        AllScreens.getInstance().addNewScreen(screenName, this);
        this.eventObjs = new Array();
        this.mouseIsDown = false;
    }

    get canvas() {  
        return AllScreens.getInstance().canvas;
    }

    get context() {
        return AllScreens.getInstance().context;
    }

    get easel() {
        return AllScreens.getInstance().easel;
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
            this.context.font = "30px Arial";
            this.context.textAlign = "center";
            this.context.fillText(this.screenName, this.canvas.width / 2, this.canvas.height / 2);
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

