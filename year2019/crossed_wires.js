const distance = ([x, y]) => Math.abs(x) + Math.abs(y);

const offsets = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  L: { x: -1, y: 0 },
};

const move = (instruction, steps, x, y, points) => {
  for (let i = 0; i < steps; i++) {
    x = x + offsets[instruction].x;
    y = y + offsets[instruction].y;
    points.push([x, y]);
  }
  return [x, y];
};

const executeInstruction = (instructions) => {
  const points = [];
  let x = 0;
  let y = 0;
  instructions.map((instruction) => {
    const [cmd, steps] = [instruction[0], instruction.slice(1)];
    [x, y] = move(cmd, steps, x, y, points);
  });
  return points;
};

const intersectPoints = (wire1, wire2) => {
  const mergePoints = [];
  for (let i = 0; i < wire1.length; i++) {
    const [x1, y1] = wire1[i];
    for (let j = 0; j < wire2.length; j++) {
      const [x2, y2] = wire2[j];
      // console.log(x2,y2);
      if (x1 === x2 && y1 === y2) {
        // console.log(wire2[j]);
        mergePoints.push(wire2[j]);
      }
    }
  }
  return mergePoints;
};

const nearestPoint = (points) =>
  points.reduce((closestPoint, point) => 
    distance(closestPoint) > distance(point) ? point : closestPoint);


const part1 = () => {
  const [line1, line2] = Deno.readTextFileSync("./input.txt").split("\n");
  const instructions1 = line1.split(",");
  const instructions2 = line2.split(",");
  const wire1 = executeInstruction(instructions1);
  const wire2 = executeInstruction(instructions2);
  const points = intersectPoints(wire1, wire2);
  return distance(nearestPoint(points));
}

const countSteps = (points, wire1, wire2) => {
  const wire1Steps = [];
  const wire2Steps = [];
  points.map(([x1,y1]) => {
    wire1Steps.push(wire1.findIndex(([x2,y2]) => x1 === x2 && y1 === y2) + 1);
    wire2Steps.push(wire2.findIndex(([x2,y2]) => x1 === x2 && y1 === y2) + 1);
  })
  return wire1Steps.map((steps, i) => steps + wire2Steps[i]);
}

const part2 = () => {
  const [line1, line2] = Deno.readTextFileSync("./input.txt").split("\n");
  const instructions1 = line1.split(",");
  const instructions2 = line2.split(",");
  const wire1 = executeInstruction(instructions1);
  const wire2 = executeInstruction(instructions2);
  const points = intersectPoints(wire1, wire2);
  const totalSteps = countSteps(points, wire1, wire2);
  return totalSteps.reduce((smallest, steps) => 
  (smallest > steps) ? steps : smallest);
}

console.log(part2());
//console.log(part1());