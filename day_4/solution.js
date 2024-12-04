import {input} from "./input.js";
import {testInput} from "./test.js";


let result = 0;
const letters = input.split('\n').map(line => line.split(''))

const dir = {
    'U': [0, -1],
    'D': [0, 1],
    'L': [-1, 0],
    'R': [1, 0],
    'UL': [-1, -1],
    'UR': [1, -1],
    'DL': [-1, 1],
    'DR': [1, 1],
}
const example = "XMAS";

const checkDir = (x, y, dir) => {
    const [dx, dy] = dir
    for (let k = 0; k < example.length; k++) {
        if (letters[x + dx * k]?.[y + dy * k] !== example[k]) return 0;
    }
    return 1;
}


const checkWord = (x, y) => {
    Object.values(dir).forEach(dir => {
        if (checkDir(x, y, dir)) result++;
    })

}

for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
        if (letters[i][j] === example[0]) checkWord(i, j)
    }
}
console.log(result)

/*--------------------Part2-----------------------------------------*/
let result2 = 0;

const checkWord2 = (x, y) => {
    if ((letters[x + dir.UR[0]]?.[y + dir.UR[1]] === 'S' && letters[x + dir.DL[0]]?.[y + dir.DL[1]] === 'M') ||
        (letters[x + dir.UR[0]]?.[y + dir.UR[1]] === 'M' && letters[x + dir.DL[0]]?.[y + dir.DL[1]] === 'S')) {
        if ((letters[x + dir.UL[0]]?.[y + dir.UL[1]] === 'M' && letters[x + dir.DR[0]]?.[y + dir.DR[1]] === 'S') ||
            (letters[x + dir.UL[0]]?.[y + dir.UL[1]] === 'S' && letters[x + dir.DR[0]]?.[y + dir.DR[1]] === 'M')) {
            result2++;
        }
    }
}

for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
        if (letters[i][j] === 'A') checkWord2(i, j)
    }
}

console.log(result2)