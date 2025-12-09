import { permutations } from "jsr:@std/collections";

const write = (instructions, array, index) => {
  instructions[4].values = array[index];
};

const read = (instructions, array, index) => {
  array[index] = instructions[3].value;
};

const add = (_ins, array, input1, input2, writeTo) => {
  array[writeTo] = parseInt(array[input1]) + parseInt(array[input2]);
};

const mul = (_ins, array, input1, input2, writeTo) => {
  array[writeTo] = parseInt(array[input1]) * parseInt(array[input2]);
};

const halt = (instructions) => instructions[99].halted = true;

const jumpIfTrue = (instructions, array, input1, input2) => {
  instructions[5].offset = (parseInt(array[input1]) !== 0)
    ? array[input2] - index
    : 3;
};

const jumpIfFalse = (instructions, array, input1, input2) => {
  instructions[6].offset = (parseInt(array[input1]) === 0)
    ? array[input2] - index
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

let index = 0;

const something = (instruction,array) => {

    const input1 = (modes[instruction[2]].positionMode)
      ? array[index + 1]
      : index + 1;

    const input2 = (modes[instruction[1]].positionMode)
      ? array[index + 2]
      : index + 2;

    const writeTo = (modes[instruction[0]].positionMode)
      ? array[index + 3]
      : index + 3;
      return[input1, input2, writeTo];
}

const performInstructions = (array, input = 0) => {
  const instructions = {
    1: { operation: add, offset: 4 },
    2: { operation: mul, offset: 4 },
    3: { operation: read, offset: 2, value: 5 },
    4: { operation: write, offset: 2, values: 0 },
    5: { operation: jumpIfTrue, offset: 3 },
    6: { operation: jumpIfFalse, offset: 3 },
    7: { operation: lessThan, offset: 4 },
    8: { operation: equals, offset: 4 },
    99: { operation: halt, offset: 1, halted: false },
  };

  index = 0;
  while (!instructions[99].halted) {
    const instruction = `${array[index]}`.padStart(5, "0");

    const cmd = parseInt(instruction.slice(instruction.length - 2));

    const [input1,input2, writeTo] = something(instruction, array);
    /* (modes[instruction[2]].positionMode)
      ? array[index + 1]
      : index + 1;

    const input2 = (modes[instruction[1]].positionMode)
      ? array[index + 2]
      : index + 2;

    const writeTo = (modes[instruction[0]].positionMode)
      ? array[index + 3]
      : index + 3; */

    instructions[cmd].operation(instructions, array, input1, input2, writeTo);
    index += instructions[cmd].offset;
  }
  // console.log(instructions[4].values);
  return instructions[4].values;
};

const amplifier = (progarm, input1, input2) => {
  performInstructions(progarm);
};

const part1 = () => {
  const input = [
    3,
    15,
    3,
    16,
    1002,
    16,
    10,
    16,
    1,
    16,
    15,
    15,
    4,
    15,
    99,
    0,
    0,
  ];
  const combinations = permutations([0, 1, 2, 3, 4]);
  const signals = combinations.map((amplifiers) => {
    let result = 0;
    result = amplifiers.map((a) => amplifier([...input], a, result));
  });
};

// console.log(part1());
amplifier([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0]);
