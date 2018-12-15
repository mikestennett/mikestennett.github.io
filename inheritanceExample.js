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

function testInheritance() {
  var myteach = new Teacher("Betty", "Smith", 25, "female", "interests", "math");
  myteach.greeting();
  myteach.goodbye();
}