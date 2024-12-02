import {input} from "./input.js";
import {testInput} from "./test.js";

const list1 =[], list2 = [];

input.split('\n').forEach(line => {
    const [first, second] = line.split('   ');
    list1.push(Number(first));
    list2.push(Number(second));
})

list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);


const dist = list1.map((item, idx)=>Math.abs(item-list2[idx]));

const answer = dist.reduce((a, b) => a + b);
console.log(answer);
/*-----------------------------------------------------------------*/

const dict = {};

list2.forEach((item) => {
    if (!dict[item]) dict[item] = 0;
    dict[item] += 1;
})

const freq = list1.map((item) => (dict[item] ?? 0)*item);

const answer2 = freq.reduce((a, b) => a + b);
console.log(answer2);
