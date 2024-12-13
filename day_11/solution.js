import {input} from "./input.js";

const inputSwitch = input;

const splitStringHalf = (str) => {
    return [str.slice(0, str.length / 2), String(Number(str.slice(str.length / 2)))]
}

const transform = (arr) => {
    const local = [...arr];
    for (let i = 0; i < local.length; i++) {
        if (local[i] === "0") local[i] = "1";
        else if (local[i].length % 2 === 0) {
            local.splice(i, 1, ...splitStringHalf(local[i]))
            i++
        } else local[i] = String(+local[i] * 2024)
    }

    // console.log({arr},{local})
    return local
}

const rocks = inputSwitch.split(" ");

const cycle = () => {
    let localRocks = rocks.slice();
    for (let i = 0; i < 25; i++) {
        localRocks = transform(localRocks)
    }
    return localRocks
}

const f = Date.now()
const result = cycle();
const diff = Date.now() - f
console.log(result.length, diff)


/*--------------------Part2-----------------------------------------*/
const cache = new Map();

const recursiveTransform = (elem, step, goal) => {
    if (cache.has(`${elem},${step}`)) return cache.get(`${elem},${step}`);

    let result = 0;
    if (step === goal) return 1;
    else {
        const res = transform([elem]);
        for (let i = 0; i < res.length; i++) {
            result += recursiveTransform(res[i], step + 1, goal)
        }
    }
    cache.set(`${elem},${step}`, result);
    return result;
}

const cycle2 = () => {

    return [...rocks].reduce((acc, el) => {
        return acc + recursiveTransform(el, 0, 75)
    }, 0)
}
const f2 = Date.now()


const result2 = cycle2();
const diff2 = Date.now() - f
console.log(result2, diff2)
