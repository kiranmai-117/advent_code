const calculateFuel = (mass) => Math.floor(mass / 3) - 2;

const mass = Deno.readTextFileSync("./input.txt").split("\n");
console.log(mass.reduce((sum, x) => sum + calculateFuel(parseInt(x)),0));