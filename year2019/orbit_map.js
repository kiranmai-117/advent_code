const orbits = {};

const mapOrbits = (data) => {
  console.log(data.length);
  for (let i = 0; i < data.length; i++) {
    const [inside, outside] = data[i].split(")");
    (!orbits[inside]) ? (orbits[inside] = [outside]) : orbits[inside].push(outside);
  }
}

const orbitCount = (orbit) => {
  const keys = Object.keys(orbits);
  const values = Object.values(orbits);
  let rOrbit = orbit;
  let count = -1;
  while(rOrbit) {
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
  return keys.reduce((total, orbit) => total + orbitCount(orbit), 0);
}

console.log(part1());