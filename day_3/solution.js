import {input} from "./input.js";
import {testInput} from "./test.js";


const regex = /mul\(\d{1,3},\d{1,3}\)/g;


const filtered = input.match(regex)
const result = filtered.reduce((acc, cur) => {
    const [a, b] = cur.match(/\d{1,3}/g);

    return acc + Number(a) * Number(b);
}, 0)

console.log(result)
/*--------------------Part2-----------------------------------------*/
const regexp2 = /mul\(\d{1,3},\d{1,3}\)|don't\(\)|do\(\)/g

const filtered2 = input.match(regexp2)

let disable = false;

const result2 = filtered2.reduce((acc, cur) => {
    if (cur === `don't()`) {
        disable = true;
        return acc;
    }
    else if (cur === `do()`) {
        disable = false;
        return acc;
    }
    else if (!disable) {
        const [a, b] = cur.match(/\d{1,3}/g);

        return acc + Number(a) * Number(b);
    }
    else return acc;
},0)

console.log(result2)


