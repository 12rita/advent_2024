import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const mix = (val, secret) => {
    return BigInt(val) ^ BigInt(secret);
}
const prune = (num) => {
    return Number(num) % 16777216
}

const simulation = (secret) => {

    const first = prune(mix(secret, secret * 64));
    const second = prune(mix(Math.floor(first / 32), first));
    const third = prune(mix(second * 2048, second));

    // console.log({first, second, third})
    return third
}

const init = () => {
    const sequences = [];
    const result = inputSwitch.split('\n').reduce((acc, item, idx) => {
        let newVal = +item;
        sequences[idx] = [{item: +item, diff: 0}]
        for (let i = 0; i < 2000; i++) {
            newVal = simulation(newVal);
            const prevVal = sequences[idx][sequences[idx].length - 1].item;
            sequences[idx].push({item: newVal, diff: newVal - prevVal});
        }
        // console.log({newVal})

        return acc + newVal
    }, 0);

    return {result, sequences};
}

// const {result} = init();
// console.log(result);

/*--------------------Part2-----------------------------------------*/

Number.prototype.lastSym = function () {
    return this % 10
}

const init2 = () => {
    const sequences = [];
    const values = {}
    inputSwitch.split('\n').forEach((item, idx) => {
        let newVal = +item;

        sequences[idx] = [{item: Number(item).lastSym(), diff: 0}]
        for (let i = 0; i < 2000; i++) {
            newVal = simulation(newVal);
            const prevVal = sequences[idx][sequences[idx].length - 1].item;
            sequences[idx].push({item: newVal.lastSym(), diff: newVal.lastSym() - prevVal});
        }
    });

    sequences.forEach((sequence, idx) => {
        let start = 0;
        const local = {};
        while (start < sequence.length - 3) {
            const key = sequence.slice(start, start + 4).map(el => el.diff).join(',');

            if (!local[key]) {
                local[key] = sequence[start + 3].item
            }
            start = start + 1;
        }

        Object.keys(local).forEach(key=>{
            if (!values[key]) values[key] = 0;
            values[key]+=local[key];
        })
    });

    // console.log(values['-2,1,-1,3'])

    let MAX = 0;
    let MAX_KEY = '';
    Object.keys(values).forEach(key => {
        if (values[key] > MAX) {
            MAX = values[key];
            MAX_KEY = key;
        }
    })

    return {MAX, MAX_KEY};
}

const {MAX, MAX_KEY} = init2();
console.log(MAX, MAX_KEY);

