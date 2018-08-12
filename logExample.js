

function testConsoleLogTrace() {
    console.trace();
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

function testConsoleLogTime() {
    console.time();
    wait(1000);
    console.timeEnd();
}



function testConsoleLog() {
    testConsoleLogTrace();
    console.count("test called");
    console.memory;
    console.assert(true, "Don't log me...");
    console.assert(false, "Log me!");
    console.log("Hello, %s. Your number is %i.", "Matt", 13);
    //console.clear(); //clears the console
    testConsoleLogTime();
}