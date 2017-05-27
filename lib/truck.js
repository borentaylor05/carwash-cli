'use strict';
const ANSWERS = require('../constants').ANSWERS;
const VEHICLES = require('../constants').VEHICLES;
const IS_BED_CLOSED = {
  choices: [ANSWERS.YES, ANSWERS.NO],
  message: 'Is your truck bed closed?',
  name: 'isBedClosed',
  type: 'list'
};
const CHECK_FOR_MUD = {
  choices: [ANSWERS.YES, ANSWERS.NO],
  message: 'Is your truck bed muddy?',
  name: 'isTruckBedMuddy',
  type: 'list'
};

class Truck {
  constructor (vorpal, lpNumber) {
    this.vorpal = vorpal;
    this.type = VEHICLES.TRUCK;
    this.licensePlate = lpNumber;
    this.totalPrice = 10;
    this.mudAdditionalPrice = 2;
  }

  setTotalPrice(price) {
    this.totalPrice = price;
  }

  wash(cb) {
    this.checkBed(result => {
      if (result.isBedClosed === ANSWERS.NO) {
        this.vorpal.log('Please close your truck bed and get back in line. \n');
        cb(null);
      } else {
        this.checkMud(result => {
          if (result.isTruckBedMuddy === ANSWERS.YES) {
            this.totalPrice += this.mudAdditionalPrice;
          }

          cb(this.totalPrice);
        });
      }
    });
  }

  checkBed(cb) {
    this.vorpal.prompt(IS_BED_CLOSED, cb);
  }

  checkMud(cb) {
    this.vorpal.prompt(CHECK_FOR_MUD, cb);
  }
}

module.exports = Truck;