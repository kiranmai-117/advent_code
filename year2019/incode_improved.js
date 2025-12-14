import { chunk } from "jsr:@std/collections";

const output = (array, index) => instructions[4].values = array[index];

const input = (array, index) => array[index] = instructions[3].value;

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

const checkValue = 8;

const instructions = {
  1: { operation: add, offset: 4 },
  2: { operation: mul, offset: 4 },
  3: { operation: input, offset: 2, value: checkValue },
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

const stepForward = ({ program, pointer }) => {
  instructions[99].halted = false;

  while (!instructions[99].halted) {
    debug(program, pointer);
    pointer = executeInstructions(program, pointer);
  }

  const outputValue = instructions[4].values;
  return outputValue;
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

const computer = {
  program: [],
  pointer: 0,
};

const part1 = (input) => {
  const program = eval("[" + input + "]");
  computer.program = program;
  console.log(stepForward(computer));
};

const inputs = {
  verySmall: "1002,4,3,4,33",
  small:
    "3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99",
  file: Deno.readTextFileSync("./input.txt"),
};

part1(inputs.small);
