import {input} from "./input.js";
import {testInput} from "./test.js";

const inputSwitch = input;

const init = () => {
    const data = inputSwitch.split('\n\n').map(el => el.split('\n'));

    const locks = data.filter(el => el[0] === '#####').map(el => {
        // console.table(el);
        const res = el.reduce((acc, line) => {
            for (let i = 0; i < line.length; i++) {
                if (acc[i] === undefined) acc[i] = 0;
                if (line[i] === '.') {
                    acc[i]++
                }
            }
            return acc;
        }, []);
        // console.log(res);
        return res
    });

    const keys = data.filter(el => el[0] !== '#####').map(el => {
        // console.table(el);
        const res = el.reduce((acc, line) => {
            for (let i = 0; i < line.length; i++) {
                if (acc[i] === undefined) acc[i] = 0;
                if (line[i] === '#') {
                    acc[i]++
                }
            }
            return acc;
        }, []);
        // console.log(res);
        return res
    });

    return {keys, locks};
}


const checkKeyFit = (key, lock) => {

    for (let i = 0; i < key.length; i++) {
        if (key[i] > lock[i]) return false;

    }
    return true;
}


const findUniquePairs = (keys, locks) => {
    const res = [];
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < locks.length; j++) {
            if (checkKeyFit(keys[i], locks[j])) {
                res.push([i, j]);
            }
        }
    }
    return res.length;
}

const {keys, locks} = init();
const result = findUniquePairs(keys, locks);
console.log({result});
/*--------------------Part2-----------------------------------------*/

