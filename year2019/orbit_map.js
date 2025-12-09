import { intersect } from "jsr:@std/collections";
const orbits = {};

const mapOrbits = (data) => {
  for (let i = 0; i < data.length; i++) {
    const [inside, outside] = data[i].split(")");
    (!orbits[inside]) ? (orbits[inside] = [outside]) : orbits[inside].push(outside);
  }
}

const orbitCount = (orbit, path) => {
  const keys = Object.keys(orbits);
  const values = Object.values(orbits);
  let rOrbit = orbit;
  let count = -1;
  while(rOrbit) {
    path.push(rOrbit);
    rOrbit = keys[values.findIndex(lorbit => lorbit.includes(rOrbit))];
    count++;
  }
  return count;
}

const part1 = () => {
  const data = Deno.readTextFileSync("./input.txt").split("\n");
  // const data = ["B)C","C)D","D)E","COM)B","E)F","B)G","G)H","D)I","E)J","J)K","K)L"];
  mapOrbits(data);
  const keys = Object.values(orbits).flat();
  return keys.reduce((total, orbit) => total + orbitCount(orbit,[]), 0);
}

const part2 = () => {
  const data = Deno.readTextFileSync("./input.txt").split("\n");
  // const data = ["COM)B","B)C","C)D","D)E","E)F","B)G","G)H","D)I","E)J","J)K","K)L","J)YOU","I)SAN"];
  mapOrbits(data);
  const path1 = [];
  const path2 = [];
  const santa = orbitCount("SAN", path1);
  const you = orbitCount("YOU", path2);
  const common = intersect(path1, path2);
  const extra = orbitCount(common[0],[]);
  return ((santa - extra) + (you - extra)) - 2;
}

// console.log(part2());
console.log(part1());