import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const init = () => {
    const [arrangementsInput, towelsInput] = inputSwitch.split("\n\n");

    const arrangements = {}
    arrangementsInput.split(", ").forEach(el => {
        arrangements[el] = true
    });

    const towels = towelsInput.split("\n");

    return {towels, arrangements}
}

const checkAvailable = (towel, arrangements) => {
    let k = 1;
    // console.log({towel})
    while (k < towel.length + 1) {
        if (k === towel.length) {
            return !!arrangements[towel]
        }

        const part = towel.substring(0, k);
        // console.log({part, k})
        if (arrangements[part]) {
            if (checkAvailable(towel.substring(k), arrangements)) {
                return true
            } else k++
        } else k++
    }
    return false;
}

const countAvailable = (towels, arrangements) => {
    return towels.reduce((acc, towel) => {
        const res = checkAvailable(towel, arrangements);
        // console.log({res})
        acc += res ? 1 : 0;
        return acc;
    }, 0)
}

const {towels, arrangements} = init();
const result = countAvailable(towels, arrangements);
console.log({result})
/*--------------------Part2-----------------------------------------*/
const cache = {}

const checkAvailable2 = (towel, arrangements) => {
    if (cache[`${towel}`]) return cache[`${towel}`];
    let k = 1;
    let res = 0;
    while (k < towel.length + 1) {
        if (k === towel.length) {
            const result = res + (arrangements[towel] ? 1 : 0)
            cache[`${towel}`] = result
            return result
        }

        const part = towel.substring(0, k);

        if (arrangements[part]) {
            const leftPart = towel.substring(k)
            const local = checkAvailable2(leftPart, arrangements);
            res += local;
            k++
        } else k++
    }
    cache[`${towel}`] = res;
    return res;
}

const countAvailable2 = (towels, arrangements) => {
    return towels.reduce((acc, towel) => {
        const result = checkAvailable2(towel, arrangements);
        acc += result;
        return acc;
    }, 0)
}

const result2 = countAvailable2(towels, arrangements);
console.log({result2})