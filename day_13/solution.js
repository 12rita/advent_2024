import {input} from "./input.js";
import {testInput} from "./test.js";

const inputSwitch = testInput;

const result = inputSwitch.split("\n\n").reduce((acc, el) => {

    const conditions = el.matchAll(/\d+/g)

    const A = +conditions.next().value[0];
    const C = +conditions.next().value[0];
    const B = +conditions.next().value[0];
    const D = +conditions.next().value[0];
    const X = +conditions.next().value[0];
    const Y = +conditions.next().value[0];
    // console.log({A, B, C, D, X, Y})
    const n = (X * C - A * Y) / (B * C - A * D);

    // console.log(n)
    if (n < 0 || !Number.isInteger(n) || n > 100)
        return acc
    const m = (B * Y - D * X) / (B * C - A * D);

    // console.log(m)
    if (m < 0 || !Number.isInteger(m) || m > 100)
        return acc

    return acc + n + m * 3
}, 0);
console.log(result)
/*--------------------Part2-----------------------------------------*/

const result2 = inputSwitch.split("\n\n").reduce((acc, el) => {
    const conditions = el.matchAll(/\d+/g)

    const A = +conditions.next().value[0];
    const C = +conditions.next().value[0];
    const B = +conditions.next().value[0];
    const D = +conditions.next().value[0];
    const X = 10000000000000+ +conditions.next().value[0];
    const Y = 10000000000000+ +conditions.next().value[0];

    // console.log({A, B, C, D, X, Y})
    const n = (X * C - A * Y) / (B * C - A * D);

    if (n < 0 || !Number.isInteger(n) )
        return acc
    const m = (B * Y - D * X) / (B * C - A * D);

    if (m < 0 || !Number.isInteger(m) )
        return acc

    // console.log({m,n})
    return acc + n + m * 3
}, 0);
console.log(result2)

