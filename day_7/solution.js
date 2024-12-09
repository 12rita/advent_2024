import {input} from "./input.js";
import {testInput} from "./test.js";

/**
 * @param {number[]} numbers
 * @param {number} res
 * @return {boolean}
 */
const calcResult = (numbers, res) => {
    /*--------------------Part2-----------------------------------------*/
    if (numbers.length === 2) {
        return numbers[0] * numbers[1] === res ||
            numbers[0] + numbers[1] === res ||
            Number(String(numbers[0]) + String(numbers[1])) === res
    }
    const a = numbers.shift();
    const b = numbers.shift();


    return calcResult([a * b, ...numbers], res) || calcResult([a + b, ...numbers], res) || calcResult([Number(String(a) + String(b)), ...numbers], res);
}

const result = input.split('\n').reduce((acc, cur) => {
    const [result, rest] = cur.split(':')
    const numbers = rest.split(' ').map(Number);

    if (calcResult(numbers, +result)) return acc + +result;
    return acc;
}, 0)

console.log(result)



