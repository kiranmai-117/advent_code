import { permutations } from "jsr:@std/collections";

const output = (instructions, array, index) => {
  instructions["04"].values = array[index];
};

const input = (instructions, array, index) => {
  array[index] = instructions["03"].value;
};

const add = (_ins, array, param1Address, param2Address, writeTo) => {
  array[writeTo] = parseInt(array[param1Address]) +
    parseInt(array[param2Address]);
};

const mul = (_ins, array, param1Address, param2Address, writeTo) => {
  array[writeTo] = parseInt(array[param1Address]) *
    parseInt(array[param2Address]);
};

const halt = (instructions) => instructions[99].halted = true;

const jumpIfTrue = (instructions, array, input1, input2) => {
  instructions["05"].offset = (parseInt(array[input1]) !== 0)
    ? array[input2] - pointer
    : 3;
};

const jumpIfFalse = (instructions, array, input1, input2) => {
  instructions["06"].offset = (parseInt(array[input1]) === 0)
    ? array[input2] - pointer
    : 3;
};

const lessThan = (ins, array, input1, input2, writeTo) => {
  array[writeTo] = (array[input1] < array[input2]) ? 1 : 0;
};

const equals = (ins, array, input1, input2, writeTo) => {
  array[writeTo] = (array[input1] === array[input2]) ? 1 : 0;
};

const modes = {
  0: { positionMode: true },
  1: { positionMode: false },
};

let pointer = 0;

const getParameters = (instruction, array) => {
  const input1 = (modes[instruction[2]].positionMode)
    ? array[pointer + 1]
    : pointer + 1;

  const input2 = (modes[instruction[1]].positionMode)
    ? array[pointer + 2]
    : pointer + 2;

  const writeTo = (modes[instruction[0]].positionMode)
    ? array[pointer + 3]
    : pointer + 3;
  return [input1, input2, writeTo];
};

const performInstructions = (program) => {
  const instructions = {
    "01": { operation: add, offset: 4 },
    "02": { operation: mul, offset: 4 },
    "03": { operation: input, offset: 2, value: 8 },
    "04": { operation: output, offset: 2, values: 0 },
    "05": { operation: jumpIfTrue, offset: 3 },
    "06": { operation: jumpIfFalse, offset: 3 },
    "07": { operation: lessThan, offset: 4 },
    "08": { operation: equals, offset: 4 },
    "99": { operation: halt, offset: 1, halted: false },
  };

  pointer = 0;
  while (!instructions[99].halted) {
    const instruction = `${program[pointer]}`.padStart(5, "0");

    const opcode = instruction.slice(instruction.length - 2);

    const [input1, input2, writeTo] = getParameters(instruction, program);
    instructions[opcode].operation(
      instructions,
      program,
      input1,
      input2,
      writeTo,
    );

    pointer += instructions[opcode].offset;
  }
  // console.log(instructions[4].values);
  return instructions["04"].values;
};

const amplifier = (progarm, input1, input2) => {
  console.log(performInstructions(progarm));
};

// c
//   const program = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
//   const combinations = permutations([0, 1, 2, 3, 4]);
//   const signals = combinations.map((amplifiers) => {

//     let result = 0;

//     result = amplifiers.map((a) => amplifier([...program], a, result));
//   });
// };

// console.log(part1());
// amplifier([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]);
const progarm = [
  3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]

amplifier([...progarm])