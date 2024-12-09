import {input} from "./input.js";
import {testInput} from "./test.js";


const inputExpand = (input) => {
    let k = 0;
    let expanded = [];
    for (let i = 0; i < input.length; i++) {

        if (i % 2 === 0) {

            for (let j = 0; j < +input[i]; j++) {
                expanded.push([k]);
            }


            k++
        } else {
            for (let j = 0; j < +input[i]; j++) {
                expanded.push(['.']);
            }

        }

    }
    return expanded;
}
const expanded = inputExpand(testInput)

const reorganize = (expArr) => {


    let start = 0, end = expArr.length - 1;
    while (start <= end) {

        if (expArr[start][0] === '.') {
            if (expArr[end][0] !== '.') {
                expArr[start][0] = expArr[end][0];
                expArr[end][0] = '.';
                end--;
                start++;
            } else {
                end--;
            }
        } else {
            start++;
        }
    }
    const dotStart = expArr.findIndex((el) => el[0] === '.');
    return expArr.slice(0, dotStart);

}

const result = reorganize(expanded).reduce((acc, el, idx) => acc + (+el[0] * idx), 0)

console.log(result)


/*--------------------Part2-----------------------------------------*/


const inputExpandWithId = (input) => {
    let k = 0;
    let expanded = [];
    for (let i = 0; i < input.length; i++) {

        if (i % 2 === 0) {
            expanded.push({id: k, size: +input[i]});

            k++
        } else {
            expanded.push({id: 'free', size: +input[i]});
        }

    }
    return expanded;
}

const expanded2 = inputExpandWithId(input)



const reorganize2 = (expArr) => {


    let end = expArr.length - 1;
    while (end >= 0) {
        const {id: endId, size: endSize} = expArr[end];

        if (endId !== 'free') {
            const freePlaceIdx = expArr.slice(0, end).findIndex((el) => el.id === 'free' && el.size >= endSize);
            if (freePlaceIdx !== -1) {
                const {id: freeIdx, size: freeSize} = expArr[freePlaceIdx];
                expArr[end].id = 'free';
                expArr.splice(freePlaceIdx, 1, {id: endId, size: endSize}, {id: freeIdx, size: freeSize - endSize});

            }
        }

        end--;
    }

    return expArr

}

const reorginized = reorganize2(expanded2)


const calculate = (arr) => {
    let pos = 0;
    let res = 0;
    for (let i = 0; i < arr.length; i++) {
        const {id, size} = arr[i]
        if (id !== 'free') {
            res += (pos + (pos + size - 1)) * (+id) * size / 2;
        }

        pos += size;
    }
    return res
}

const result2 = calculate(reorginized)

console.log(result2)