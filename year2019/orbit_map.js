const orbits = {};

const mapOrbits = (data) => {
  for (let i = 0; i < data.length; i++) {
    const [inside, outside] = data[i].split(")");
    (!orbits[inside]) ? orbits[inside] = [outside] : orbits[inside].push(outside);
    if (i === data.length - 1) {
      orbits[outside] = [];
    }
  }
}

const orbitCount = (orbit) => {
  const keys = Object.keys(orbits);
  const values = Object.values(orbits);
  // console.log(orbit);
  let rOrbit = orbit;
  let count = -1;
  while(rOrbit) {
    rOrbit = keys[values.findIndex(lorbit => lorbit.includes(rOrbit))];
    count++;
  }
  // console.log("count", count);
  return count;
}

const part1 = () => {
  // const data = Deno.readTextFileSync("./input.txt").split("\n");
  const data = ["COM)B","B)C","C)D","D)E","E)F","B)G","G)H","G)M","M)N","D)I","E)J","J)K","K)L"];
  mapOrbits(data);
  console.log(orbits);
  const keys = Object.values(orbits).flat();
  return keys.reduce((total, orbit) => total + orbitCount(orbit), 0);
}

console.log(part1());