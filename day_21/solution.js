import {input} from "./input.js";
import {testInput} from "./test.js";

const inputSwitch = input;

const numericKeypad =
    [['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        [undefined, '0', 'A']];
const directionalKeypad =
    [[undefined, '^', 'A'],
        ['<', 'v', '>']];


/**
 * @param {string} point
 * @param {'numeric'|'directional'} keypadType
 * @return {{x:number, y:number}}
 */
const getCoords = (point, keypadType) => {
    const keypad = keypadType === 'numeric' ? numericKeypad : directionalKeypad;
    for (let i = 0; i < keypad.length; i++) {
        for (let j = 0; j < keypad[i].length; j++) {
            if (keypad[i][j] === point) return {y: i, x: j}
        }
    }
}

/**
 * @param {number} y1
 * @param {number} y2
 * @return {string}
 */
const UPDO = (y1, y2) => {
    const diffY = y2 - y1;
    return diffY > 0 ? 'v'.repeat(diffY) : '^'.repeat(Math.abs(diffY));
}

/**
 * @param {number} x1
 * @param {number} x2
 * @return {string}
 */
const LERI = (x1, x2) => {
    const diffX = x2 - x1;
    return diffX > 0 ? '>'.repeat(diffX) : '<'.repeat(Math.abs(diffX));
}

const cache = {};

/**
 * @param {string} start
 * @param {string} finish
 * @param {'numeric'|'directional'} keypadType
 * @return {string}
 */
const getPath = (start, finish, keypadType) => {
    if (cache[`${start}${finish}`]) return cache[`${start}${finish}`];

    const {x: x1, y: y1} = getCoords(start, keypadType);
    const {x: x2, y: y2} = getCoords(finish, keypadType);
    const diffX = x2 - x1;
    let res = '';

    if (keypadType === 'numeric') {

        if (y1 === 3 && x2 === 0) {
            res = UPDO(y1, y2) + LERI(x1, x2);
            cache[`${start}${finish}`] = res;
            return res

        } else if (x1 === 0 && y2 === 3) {
            res = LERI(x1, x2) + UPDO(y1, y2);
            cache[`${start}${finish}`] = res;
            return res
        }

    }

    if (keypadType === 'directional') {
        if (y1 === 0 && x2 === 0) {
            res = UPDO(y1, y2) + LERI(x1, x2);
            cache[`${start}${finish}`] = res;
            return res
        }

        if (x1 === 0 && y2 === 0) {
            res = LERI(x1, x2) + UPDO(y1, y2);
            cache[`${start}${finish}`] = res;
            return res
        }
    }

    if (diffX < 0) {
        res = LERI(x1, x2) + UPDO(y1, y2);
        cache[`${start}${finish}`] = res;
        return res
    } else {
        res = UPDO(y1, y2) + LERI(x1, x2);
        cache[`${start}${finish}`] = res;
        return res
    }

}

/**
 * @param {string} code
 * @param {'numeric'|'directional'} keypadType
 * @return {string}
 */
const getSeq = (code, keypadType) => {

    let res = getPath('A', code[0], keypadType) + 'A';

    for (let i = 0; i < code.length - 1; i++) {
        const letter = code[i];
        const nextLetter = code[i + 1];
        res += getPath(letter, nextLetter, keypadType) + "A";

    }
    return res;
}

/**
 * @param {string} code
 * @return {string}
 */
const getFullSequence = (code) => {
    const seq1 = getSeq(code, 'numeric');
    const seq2 = getSeq(seq1, 'directional');
    const seq3 = getSeq(seq2, 'directional');
    return seq3
}

/**
 * @return {number}
 */
const countResult = () => {
    return inputSwitch.split('\n').reduce((acc, item) => {
        return acc + (getFullSequence(item).length * parseInt(item));
    }, 0)
}

const result1 = countResult();
console.log({result1})


/*--------------------Part2-----------------------------------------*/

const cache2 = {};
/**
 * @param {string} seq
 * @param {number} step
 * @return {number}
 */
const getSeqOptimized = (seq, step) => {
    if (cache2[seq + ',' + step]) return cache2[seq + ',' + step];
    if (step === 24) {
        cache2[seq + ',' + step] = getSeq(seq, 'directional').length;
        return getSeq(seq, 'directional').length;
    }
    const splitted = seq.split('A');
    splitted.pop();

    const res = splitted.reduce((acc, seq) => {
        return acc + getSeqOptimized(getSeq(seq + 'A', "directional"), step + 1)
    }, 0);
    cache2[seq + ',' + step] = res

    return res
}


const getFullSequence2 = (code) => {
    let localSeq = getSeq(code, 'numeric');

    localSeq = getSeqOptimized(localSeq, 0);

    return localSeq
}

const countResult2 = () => {
    return inputSwitch.split('\n').reduce((acc, item) => {
        return acc + (getFullSequence2(item) * parseInt(item));
    }, 0)
}

const result2 = countResult2();

console.log({result2})
