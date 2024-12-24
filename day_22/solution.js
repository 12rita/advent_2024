import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = testInput;

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
        sequences[idx]=[{item: +item, diff:0}]
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

const {result, sequences} = init();
console.log(result)

/*--------------------Part2-----------------------------------------*/
const checkSum = ()=>{
    const seqStringified = sequences.map(sequence=>sequence.map(item=>item.diff).join(','));
    let res = 0;
    const cache = {};
    for (let i = 0; i < seqStringified.length; i++) {
        const item = sequences[i];
        const diffs = seqStringified[i];
        for (let j = 0; j < diffs.length-3; j++) {
            const seq = item.slice(0,j+4).map(item=>item.diff).join(',');
            if (cache[seq]) {
                continue;
            }

            seqStringified.reduce((acc,item)=>{
                const exist =  item.indexOf(seq);
                if (exist)
            },0)
        }
    }
}
console.log(checkSum())
