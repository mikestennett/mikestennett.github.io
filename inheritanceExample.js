class Singleton {

  constructor(message = 'Hello world') {

      this.message = message;

  }

    static getInstance() {

      return (Singleton.instance == null) ? Singleton.instance = new Singleton() : Singleton.instance;

  }

}

class Animal { // Class is a new type of object called "Animal"

  static get DEFAULT_TYPE() { return "generic animal"; } // Class static constant

  static fight(animal1, animal2) {  // this is a static class function
    console.log("Animal " + animal1.name + " fights " + animal2.name);
  }

  constructor(name) {
    this.name = name;
    this.type = Animal.DEFAULT_TYPE;
  }

  speak(says = ' makes a noise.') {  // method
    console.log(this.name + says );
  }

  cuteness() { // method
    console.log(this.name + ' may be cute');
  }

  get typer() {  // getter - syntax like a property but is a funciton 
    return this.name + " is a " + this.type;
  }

  // setter - syntax like a property but is a funciton 
  set typeof(aType) {  // uses parameter default value this also makes it optional
    this.type = aType;
  }

}

class Dog extends Animal {
  constructor(name) {
    super(name); // call the super class constructor and pass in the name parameter
    this.type = "Dog";
  }

  speak() {
    console.log(this.name + ' barks.');
    super.speak(); // Call super's speak
  }
}

class ChowChow extends Dog {
  constructor(name) {
    super(name);
  }

  cuteness() {
    console.log(this.name + ' is very cute');
    super.cuteness();
  }
}

function testInheritance() {
  console.log("Begin testInheritance");
  var myDog = new Dog("Spike");
  myDog.speak();
  var myAnimal = new Animal("Animal");
  myAnimal.speak();
  console.log(myAnimal.typer);
  var myChow = new ChowChow("Chase");
  myChow.cuteness();
  myChow.typeof = "ChowChow"
  console.log(myChow.typer);
  Animal.fight(myAnimal, myDog);
}

testInheritance();

//////////////////////////////////////////////////////////////////////////////////////
// Older way of doing inheritance.  Several posts say it's better but they fail to be clear as to why

function Person(first, last, age, gender, interests) {
  this.name = {
    first,
    last
  };
  this.age = age;
  this.gender = gender;
  this.interests = interests;
};

Person.prototype.greeting = function () {
  console.log('Hi! I\'m ' + this.name.first + '.');
};

Person.prototype.goodbye = function () {
  console.log('Goodbye.');
};


// Teacher Constructor  
function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests);  // Call super class constructor

  this.subject = subject;
}


// Inherit from Person
Teacher.prototype = Object.create(Person.prototype); // Inherit the Person methods
Teacher.prototype.constructor = Teacher;  // Set the constructor back to Teacher - because JS is lame

Teacher.prototype.greeting = function () {
  var prefix;

  if (this.gender === 'male' || this.gender === 'Male' || this.gender === 'm' || this.gender === 'M') {
    prefix = 'Mr.';
  } else if (this.gender === 'female' || this.gender === 'Female' || this.gender === 'f' || this.gender === 'F') {
    prefix = 'Ms.';
  } else {
    prefix = 'Mx.';
  }

  console.log('Hello. My name is ' + prefix + ' ' + this.name.last + ', and I teach ' + this.subject + '.');
  Person.prototype.greeting.call(this);  // or use apply for array
};

function testOldInheritance() {
  var myteach = new Teacher("Betty", "Smith", 25, "female", "interests", "math");
  myteach.greeting();
  myteach.goodbye();
}

