import {input} from "./input.js";
import {testInput} from "./test.js";



let result = 0;

const checkReportType = (a,b)=>{
    const diff = Number(a)-Number(b);
    if (Math.abs(diff) >= 3 || Math.abs(diff) ===1 || diff === 0) return 0;
    else if (diff < 0) return -1;
    return 1
}

const checkReport = (a,b, type)=>{
    const diff = Number(a)-Number(b);
    if (Math.abs(diff) >= 3 || Math.abs(diff) ===1 || diff === 0) return false;
    else if ()
}

input.split('\n').forEach(line => {
    const report= line.split(' ');
const change = report[0] - report[1]
})



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
