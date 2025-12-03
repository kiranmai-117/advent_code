const calculateFuel = (mass) => Math.floor(mass / 3) - 2;

const mass = Deno.readTextFileSync("./input.txt").split("\n");

const totalFule = (mass) => {
  const fuel = calculateFuel(mass);
  if(fuel < 0) {
    return 0;
  }
  const total = fuel + totalFule(fuel);
  return total;
}

const part1 = (mass) => mass.reduce((sum, x) => sum + calculateFuel(parseInt(x)),0);

const part2 = (mass) => mass.reduce((sum, x) => sum + totalFule(parseInt(x)), 0);

console.log(part1(mass));
console.log(part2(mass));
console.log(totalFule(100756));
console.log(totalFule(1969));