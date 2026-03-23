const Money = require('../value-objects/Money');

class Salary {
  constructor(id, userId, month, amount) {
    this.id = id;
    this.userId = userId;
    this.month = month; // Format: YYYY-MM
    this.amount = new Money(amount);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      month: this.month,
      amount: this.amount.toNumber()
    };
  }
}

module.exports = Salary;