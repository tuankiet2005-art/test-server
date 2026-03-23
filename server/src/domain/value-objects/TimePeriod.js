class TimePeriod {
  constructor(value) {
    if (!TimePeriod.validPeriods.includes(value)) {
      throw new Error(`Invalid time period: ${value}`);
    }
    this.value = value;
  }

  static get ALL_DAY() { return 'all_day'; }
  static get MORNING() { return 'morning'; }
  static get AFTERNOON() { return 'afternoon'; }

  static get validPeriods() {
    return [TimePeriod.ALL_DAY, TimePeriod.MORNING, TimePeriod.AFTERNOON];
  }

  getDaysDeducted() {
    switch (this.value) {
      case TimePeriod.ALL_DAY: return 1;
      case TimePeriod.MORNING:
      case TimePeriod.AFTERNOON: return 0.5;
      default: return 0;
    }
  }

  equals(other) {
    return other instanceof TimePeriod && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = TimePeriod;