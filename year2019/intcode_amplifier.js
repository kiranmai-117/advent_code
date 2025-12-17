import { chunk, maxBy, permutations } from "jsr:@std/collections";

const output = (array, index) => {
  instructions[4].values = array[index];
  halt();
};

const input = (array, index) => {
  array[index] = instructions[3].value.shift();
};

const add = (array, param1Address, param2Address, writeTo) =>
  array[writeTo] = array[param1Address] + array[param2Address];

const mul = (array, param1Address, param2Address, writeTo) =>
  array[writeTo] = array[param1Address] * array[param2Address];

const halt = () => instructions[99].halted = true;

const jumpIfTrue = (array, input1, input2, _o, pointer) =>
  instructions[5].offset = (array[input1] !== 0) ? array[input2] - pointer : 3;

const jumpIfFalse = (array, input1, input2, _o, pointer) =>
  instructions[6].offset = (parray[input1] === 0) ? array[input2] - pointer : 3;

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

let isHalted = false;
const executeInstructions = (program, pointer) => {
  const instruction = `${program[pointer]}`.padStart(5, "0");

  const opcode = parseInt(instruction.slice(instruction.length - 2));
  isHalted = opcode === 99;
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
  // console.clear();
  display(program, pointer);
  prompt();
};

const stepForward = (computer) => {
  instructions[99].halted = false;
  while (!instructions[99].halted) {
    // debug(computer.program, computer.pointer);
    computer.pointer = executeInstructions(computer.program, computer.pointer);
  }
  const outputValue = instructions[4].values;
  return outputValue;
};

const computer = {
  program: [],
  pointer: 0,
};

const amplifiers = {
  5: { program: computer.program.slice(), pointer: 0 },
  6: { program: computer.program.slice(), pointer: 0 },
  7: { program: computer.program.slice(), pointer: 0 },
  8: { program: computer.program.slice(), pointer: 0 },
  9: { program: computer.program.slice(), pointer: 0 },
};

const generateSignal = (amplifierSequence, inputSignal) => {
  let i = 0;
  isHalted = false;
  while (!isHalted) {
    const phase = amplifierSequence[i++ % 5];
    const amplifier = amplifiers[phase];
    instructions[3].value = (i < 6) ? [phase, inputSignal] : [inputSignal];
    inputSignal = stepForward(amplifier);
  }
  return inputSignal;
};

const amplifierController = (phases) => {
  // const combinations = [[9, 7, 8, 5, 6]];
  const combinations = permutations(phases);
  const signals = [];
  for (const amplifierSequence of combinations) {
    phases.map((phase) => {
      amplifiers[phase].program = computer.program.slice();
      amplifiers[phase].pointer = 0;
    });
    signals.push(
      generateSignal(amplifierSequence, 0),
    );
  }
  // const signals = combinations.map((amplifiers) =>
  //   generateSignal(amplifiers, 0)
  // );

  console.log(Math.max(...signals));
};

const part1 = (input) => {
  const program = eval("[" + input + "]");
  computer.program = program;
  amplifierController([0, 1, 2, 3, 4]);
};

const part2 = (input) => {
  const program = eval("[" + input + "]");
  computer.program = program.slice();
  amplifierController([5, 6, 7, 8, 9], program);
};

const inputs = {
  verySmall: "1002,4,3,4,33",
  small:
    "3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10",
  file: Deno.readTextFileSync("./input.txt"),
};

// part1(inputs.small);
part2(inputs.file);
