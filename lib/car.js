'use strict';
const ANSWERS = require('../constants').ANSWERS;
const VEHICLES = require('../constants').VEHICLES;

class Car {
  constructor (vorpal, lpNumber) {
    this.vorpal = vorpal;
    this.type = VEHICLES.CAR;
    this.licensePlate = lpNumber;
    this.totalPrice = 5;
  }

  setTotalPrice(price) {
    this.totalPrice = price;
  }

  wash(cb) {
    cb(this.totalPrice);
  }
}

module.exports = Car;