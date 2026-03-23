class Money {
  constructor(amount) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Amount must be a non-negative number');
    }
    this.amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
  }

  add(other) {
    return new Money(this.amount + other.amount);
  }

  subtract(other) {
    return new Money(Math.max(0, this.amount - other.amount));
  }

  multiply(factor) {
    return new Money(this.amount * factor);
  }

  divide(divisor) {
    if (divisor === 0) throw new Error('Cannot divide by zero');
    return new Money(this.amount / divisor);
  }

  isGreaterThan(other) {
    return this.amount > other.amount;
  }

  isLessThan(other) {
    return this.amount < other.amount;
  }

  equals(other) {
    return other instanceof Money && this.amount === other.amount;
  }

  toString() {
    return `$${this.amount.toFixed(2)}`;
  }

  toNumber() {
    return this.amount;
  }
}

module.exports = Money;