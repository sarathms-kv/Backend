class FizzBuzz {
  constructor() {}
  public fizzbuzz(x) {
    if (x % 3 == 0 && x % 5 == 0) return "FizzBuzz";
    else if (x % 5 == 0) return "Buzz";
    else if (x % 3 == 0) return "Fizz";
    else return x;
  }
}

const f = new FizzBuzz();
for (let i = 1; i <= 100; i++) {
  console.log(f.fizzbuzz(i));
}

export default FizzBuzz;