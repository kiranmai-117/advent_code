const write = (instructions, array, index) => {
  instructions[4].values = array[index];
};

const read = (instructions, array, index) => {
  array[index] = instructions[3].value;
};

const add = (ins, array, input1, input2, writeTo) => {
  array[writeTo] = parseInt(array[input1]) + parseInt(array[input2]);
};

const mul = (ins, array, input1, input2, writeTo) => {
  array[writeTo] = parseInt(array[input1]) * parseInt(array[input2]);
};

const halt = (instructions) => instructions[99].halted = true;

const jumpIfTrue = (instructions, array, input1, input2) => {
  instructions[5].offset = (parseInt(array[input1]) !== 0) ? array[input2] - index : 3;
};

const jumpIfFalse = (instructions, array, input1, input2) => {
  instructions[6].offset = (parseInt(array[input1]) === 0) ? array[input2] - index : 3;
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

const performInstructions = (array) => {
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
    
    const input1 = (modes[instruction[2]].positionMode)
    ? array[index + 1]
    : index + 1;
    
    const input2 = (modes[instruction[1]].positionMode)
    ? array[index + 2]
    : index + 2;
    
    const writeTo = (modes[instruction[0]].positionMode)
    ? array[index + 3]
    : index + 3;
    
    instructions[cmd].operation(instructions, array, input1, input2, writeTo);
    index += instructions[cmd].offset;
  }
  console.log(instructions[4].values);
};

const part1 = () => {
  const memory = Deno.readTextFileSync("./input.txt").split(",");
  performInstructions(memory);
};

part1();
// performInstructions([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
// 1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
// 999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
