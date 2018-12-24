
function writeParagraph(text) {
	document.write("<p>");
	document.write(text);
	document.write("</p>");

}

class Polygon {
    constructor() {
      this.name = "Polygon";
    }
  }
  
var poly1 = new Polygon();

writeParagraph(poly1.name);

/*
var myList = ["I", "like", "ducks!"];

var index;
for (index = 0; index < myList.length; ++index) {
    writeParagraph(myList[index]);
}

var index = 0;

while (index < myList.length) {
    writeParagraph(myList[index]);
    ++index;
};
*/