class DateRange {
  constructor(startDate, endDate) {
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);

    if (this.startDate > this.endDate) {
      throw new Error('Start date cannot be after end date');
    }
  }

  getDays() {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
  }

  includes(date) {
    const checkDate = new Date(date);
    return checkDate >= this.startDate && checkDate <= this.endDate;
  }

  equals(other) {
    return other instanceof DateRange &&
           this.startDate.getTime() === other.startDate.getTime() &&
           this.endDate.getTime() === other.endDate.getTime();
  }

  toString() {
    return `${this.startDate.toISOString().split('T')[0]} to ${this.endDate.toISOString().split('T')[0]}`;
  }
}

module.exports = DateRange;