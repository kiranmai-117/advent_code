import {filterValues} from "jsr:@std/collections";

const isMeetsCriteria = (num) => {
  const digits = `${num}`.split("").map(n => parseInt(n));
  let double = false;
  const count = {};

  for (let i = 0; i < digits.length; i++) {
    (!count[digits[i]]) ? count[digits[i]] = 1 : count[digits[i]]++;
    double = filterValues(count, (c) => c === 2);

    if(digits[i] > digits[i + 1]) {
      return false;
    }
  }
  return Object.keys(double).length;
}

const counter = (start, end) => {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if(isMeetsCriteria(i)) {
      count++;
    }
  }
  return count;
}

console.log(counter(307237, 769058));