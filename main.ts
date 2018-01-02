interface Person {
  name: string;
  say(): string;
}

let darren = {
  name: "Darren",
  say: function() {
    return `My name is ${this.name}!`;
  }
};

function sayIt(person: Person) {
  return person.say();
}

console.log(sayIt(darren));
