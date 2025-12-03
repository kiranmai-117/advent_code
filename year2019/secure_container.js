const isMeetsCriteria = (num) => {
  const digits = `${num}`.split("").map(n => parseInt(n));
  let double = false;
  for (let i = 0; i < digits.length; i++) {
    if(digits[i] === digits[i + 1]) {
      double = true;
    }
    if(digits[i] > digits[i + 1]) {
      return false;
    }
  }
  return double;
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

console.log(counter(307237,769058));