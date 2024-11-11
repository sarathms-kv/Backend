import FizzUtil from "../../utils/fizz.util";
describe("Fizz Util Tests", () => {
  let fizzUtil: FizzUtil;
  beforeEach(() => {
    fizzUtil = new FizzUtil();
  });
  it("should return Fizz if the number is divisible by 3", () => {
    expect(fizzUtil.fizzbuzz(3)).toBe("Fizz");
  });
  it("should return Buzz if the number is divisible by 5", () => {
    expect(fizzUtil.fizzbuzz(10)).toBe("Buzz");
  });
  it("should return FizzBuzz if the number is divisible by 3 and 5", () => {
    expect(fizzUtil.fizzbuzz(15)).toBe("FizzBuzz");
  });
  it("should return the number if the number is not divisible by neither 3 nor 5", () => {
    expect(fizzUtil.fizzbuzz(7)).toBe(7);
  }) 
});
