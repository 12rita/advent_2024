import {input} from "./input.js";
import {test2, testInput} from "./test.js";

const inputSwitch = input;

const opDict = {
    'XOR': (a, b) => a ^ b,
    'OR': (a, b) => a | b,
    'AND': (a, b) => a & b,
}

const init = () => {
    const [inputValues, gateValues] = inputSwitch.split('\n\n');

    const values = {};
    inputValues.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        values[key] = value;
    })

    const gates = gateValues.split('\n');

    return {values, gates}
}

const getResult = (values, gates) => {
    const gatesQueue = [...gates];


    let k = 0;
    while (gatesQueue.length) {
        k = k % gatesQueue.length;
        // console.log({k, length: gatesQueue.length})
        const gate = gatesQueue[k];
        const [conditions, output] = gate.split(' -> ');
        const [left, op, right] = conditions.split(' ');
        if (left in values && right in values) {
            values[output] = opDict[op](values[left], values[right]);
            gatesQueue.splice(k, 1);
        } else {
            k++
        }
    }


    const binaryResult = gates.map(el => {
        const [_, output] = el.split(' -> ');
        return output;
    }).filter(el => el.startsWith('z')).sort().map((el) => values[el]).reverse().join('');

    return parseInt(binaryResult, 2);
}

const {values, gates} = init();

const result1 = getResult(values, gates);
console.log({result1})

/*--------------------Part2-----------------------------------------*/

