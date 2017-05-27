#! /usr/bin/env node

const vorpal = require('vorpal')();
const VEHICLES = require('../constants').VEHICLES;
const WASHABLE_TYPES = [VEHICLES.CAR, VEHICLES.TRUCK];
const NEXT = `\nType 'next' to wash the next vehicle...`;

let CarWash = require('../lib/carWash');
let carWash;

vorpal
  .command('start', 'Starts the car wash program.')
  .action(startCarWash);

vorpal
  .command('next', 'Washes the next vehicle.')
  .action(startCarWash);

vorpal
  .command('transactions', 'Shows the last 10 transactions')
  .action(showTransactions);

vorpal
  .delimiter('Car Wash: ')
  .log(`Type 'start' to enter the Car Wash or 'help' to see all possible commands...`)
  .show();


function startCarWash(args, callback) {
  this.log('Welcome to the Car Wash!');
  if (!carWash) {
    carWash = new CarWash(this);
  }
  carWash.getLicensePlateNumber(err => {
    if (err) {
      this.log(err);
      this.log(NEXT);
      return vorpal.show();
    }

    carWash.getVehicleType(err => {
      if (err) {
        this.log(err);
        this.log(NEXT);
        return vorpal.show();
      }

      carWash.washVehicle(err => {
        if (!err) {
          carWash.completeTransaction();
        }

        this.log(NEXT);
        vorpal.show();
      });
    });
  });
  callback();
}

function showTransactions(args, callback) {
  if (!carWash) {
    this.log('There are no transactions yet.');
    return callback();
  }

  carWash.showTransactions(() => {
    vorpal.show();
  });

  callback();
}