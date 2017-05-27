'use strict';
const MAX_TRANSACTIONS = require('../constants').MAX_TRANSACTIONS;
const STOLEN_PLATE = require('../constants').STOLEN_PLATE;
const VEHICLES = require('../constants').VEHICLES;
const WHAT_TYPE = {
  choices: [VEHICLES.CAR, VEHICLES.TRUCK, VEHICLES.SPACESHIP],
  message: 'What type of vehicle are you driving?',
  name: 'vehicleType',
  type: 'list'
};

let _ = require('lodash');
let Car = require('./car');
let Truck = require('./truck');

class CarWash {
  constructor(vorpal) {
    this.vorpal = vorpal;
    this.transactions = [];
  }

  completeTransaction() {
    this.vorpal.log(`Your total today is $${this.currentVehicle.totalPrice}. Thank you for your business! \n`);
    this.transactions.push(this.prettifyTransaction());
    this.setCurrentVehicle(null);
    
    if (this.transactions.length > MAX_TRANSACTIONS) {
      this.transactions.pop();
    }
  }

  washVehicle(cb) {
    this.currentVehicle.wash(price => {
      if (!price) {
        return cb(false);
      }

      let totalPrice = price;
      if (this.isRepeatCustomer()) {
        this.vorpal.log('Thanks for returning! Enjoy our 50% discount.');
        totalPrice = price / 2;
      }

      this.currentVehicle.setTotalPrice(totalPrice.toFixed(2));
      cb(true);
    });
  }

  isRepeatCustomer() {
    return !!_.find(this.transactions, { licensePlate: this.currentVehicle.licensePlate });
  }

  setCurrentVehicle(type) {
    if (type === VEHICLES.CAR) {
      this.currentVehicle = new Car(this.vorpal, this.currentLicensePlate);
    } else if (type === VEHICLES.TRUCK) {
      this.currentVehicle = new Truck(this.vorpal, this.currentLicensePlate);
    } else {
      this.currentVehicle = null;
    }
  }

  getLicensePlateNumber(cb) {
    this.vorpal.prompt({
      type: 'input',
      message: 'What is your license plate number? ',
      name: 'licensePlate'
    }, result => {
      if (result.licensePlate === STOLEN_PLATE) {
        this.vorpal.log('This car is stolen. Better run!!');
        return cb(false);
      }

      this.currentLicensePlate = result.licensePlate;
      cb(true);
    });
  }

  getVehicleType(cb) {
    this.vorpal.prompt(WHAT_TYPE, result => {
      this.setCurrentVehicle(result.vehicleType);
      if (!this.currentVehicle) {
        this.vorpal.log(`${result.vehicleType}s cannot be washed here.`);
        return cb(false);
      }

      cb(true);
    });
  }

  showTransactions(cb) {
    this.vorpal.log('\n');
    this.vorpal.log('-------- Transactions Begin --------');
    this.transactions.forEach(vehicle => {
      this.vorpal.log(`${vehicle.type}: ${vehicle.totalPrice}`);
    });
    this.vorpal.log('-------- Transactions End --------');
    this.vorpal.log('\n');

    cb();
  }

  prettifyTransaction() {
    return {
      totalPrice: this.currentVehicle.totalPrice,
      licensePlate: this.currentVehicle.licensePlate,
      type: this.currentVehicle.type
    };
  }
}

module.exports = CarWash;