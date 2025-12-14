import { chunk, permutations } from "jsr:@std/collections";

const output = (array, index) => instructions[4].values = array[index];

const input = (array, index) => {
  array[index] = instructions[3].value.shift();
};

const add = (array, param1Address, param2Address, writeTo) =>
  array[writeTo] = array[param1Address] + array[param2Address];

const mul = (array, param1Address, param2Address, writeTo) =>
  array[writeTo] = array[param1Address] * array[param2Address];

const halt = () => instructions[99].halted = true;

const jumpIfTrue = (array, input1, input2, _o, pointer) =>
  instructions[5].offset = (parseInt(array[input1]) !== 0)
    ? array[input2] - pointer
    : 3;

const jumpIfFalse = (array, input1, input2, _o, pointer) =>
  instructions[6].offset = (parseInt(array[input1]) === 0)
    ? array[input2] - pointer
    : 3;

const lessThan = (array, input1, input2, writeTo) =>
  array[writeTo] = (array[input1] < array[input2]) ? 1 : 0;

const equals = (array, input1, input2, writeTo) =>
  array[writeTo] = (array[input1] === array[input2]) ? 1 : 0;

const modes = {
  0: { positionMode: true },
  1: { positionMode: false },
};

const getParameters = (instruction, array, pointer) => {
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

const instructions = {
  1: { operation: add, offset: 4 },
  2: { operation: mul, offset: 4 },
  3: { operation: input, offset: 2 },
  4: { operation: output, offset: 2, values: 0 },
  5: { operation: jumpIfTrue, offset: 3 },
  6: { operation: jumpIfFalse, offset: 3 },
  7: { operation: lessThan, offset: 4 },
  8: { operation: equals, offset: 4 },
  99: { operation: halt, offset: 1, halted: false },
};

const executeInstructions = (program, pointer) => {
  const instruction = `${program[pointer]}`.padStart(5, "0");

  const opcode = parseInt(instruction.slice(instruction.length - 2));

  const [input1, input2, writeTo] = getParameters(
    instruction,
    program,
    pointer,
  );
  instructions[opcode].operation(program, input1, input2, writeTo, pointer);
  pointer += instructions[opcode].offset;
  return pointer;
};

const display = (program, pointer) => {
  const array = program.slice();
  array[pointer] = "--> " + `${array[pointer]}`;
  const lines = chunk(array, 9);
  const paddedLines = lines.map((line) =>
    line.map((ele) => `${ele}`.padStart(9))
  );
  console.log(paddedLines.map((line) => line.join("")).join("\n"));
};

const debug = (program, pointer) => {
  console.clear();
  display(program, pointer);
  prompt();
};

const stepForward = ({ program, pointer }) => {
  instructions[99].halted = false;

  while (!instructions[99].halted) {
    // debug(program, pointer);
    pointer = executeInstructions(program, pointer);
  }

  const outputValue = instructions[4].values;
  return outputValue;
};

const computer = {
  program: [],
  pointer: 0,
};

const generateSignal = (amplifiers) => {
  const thruster = amplifiers.reduce((result, amplifier) => {
    instructions[3].value = [amplifier, result];
    computer.pointer = 0;
    return stepForward(computer);
  }, 0);
  return { thruster, amplifiers };
};

const amplifierController = () => {
  const combinations = permutations([0, 1, 2, 3, 4]);
  const signals = combinations.map(generateSignal);
  const higherSignal = signals.reduce(
    (largest, { thruster }) => Math.max(largest, thruster),
    0,
  );
  console.log(higherSignal);
};

const part1 = (input) => {
  const program = eval("[" + input + "]");
  computer.program = program;
  amplifierController();
};

const inputs = {
  verySmall: "1002,4,3,4,33",
  small:
    "3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0",
  file: Deno.readTextFileSync("./input.txt"),
};

part1(inputs.file);
