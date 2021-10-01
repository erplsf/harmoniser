import Fraction from "fraction.js";

export class Asset {
  name: string;
  amount: Fraction;
  target: Fraction;

  // calculated later
  portion: Fraction;
  fracDev: Fraction;
  targetValue: Fraction;

  constructor(name: string, amount: number, target: number) {
    this.name = name;
    this.amount = new Fraction(amount);
    this.target = new Fraction(target);

    // dummy assigments
    this.portion = new Fraction(1);
    this.fracDev = new Fraction(0);
    this.targetValue = new Fraction(0);
  }
};
