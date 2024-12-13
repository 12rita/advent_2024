import {input} from "./input.js";
import {testInput} from "./test.js";

const inputSwitch = input;

const zeros = [];
const nines = [];
const map = inputSwitch.split('\n').map((el, line) => {
    const row = el.split('');
    row.forEach((el, row) => {
        if (el === '0') {
            zeros.push({y: line, x: row})
        }
        else if (el === '9') {
            nines.push({y: line, x: row})
        }
    })
    return row
});

const m = map.length, n = map[0].length;

const bfs = (start, finish) => {
    const stack = [];
    const visited = new Set();
    stack.push(start);
    visited.add(start);
    while (stack.length > 0) {
        const current = stack.shift();
        const {x, y} = current
        if (x === finish.x && y === finish.y) {
            return true
        }
        if (y - 1 >= 0 && !visited.has(map[y - 1][x]) && +map[y - 1][x] - map[y][x] === 1) stack.push({x, y: y - 1})
        if (y + 1 < m && !visited.has(map[y + 1][x]) && +map[y + 1][x] - map[y][x] === 1) stack.push({x, y: y + 1})
        if (x - 1 >= 0 &&!visited.has(map[y][x - 1]) && +map[y][x - 1] - map[y][x] === 1) stack.push({x: x - 1, y})
        if (x + 1 < n &&!visited.has(map[y][x + 1]) && +map[y][x + 1] - map[y][x] === 1) stack.push({x: x + 1, y})
    }
    return false
}

const zerosScore = () => {
    let result = 0;
    zeros.forEach((start) => {
        result += nines.filter((point)=>bfs(start,point)).length

    })
    return result;
}

const result = zerosScore();
console.log(result)


/*--------------------Part2-----------------------------------------*/

let paths = {};

const traverse = (x, y, path) => {
    const val = +map[y][x];
    if (val === 9) {
        paths[path] = 1;
        return;
    }
    if (y - 1 >= 0 && +map[y - 1][x] - val === 1) {
        traverse(x, y - 1, path + 'U')
    }
    if (y + 1 < m && +map[y + 1][x] - val === 1) {
        traverse(x, y + 1, path + 'D')
    }
    if (x - 1 >= 0 && +map[y][x - 1] - val === 1) {
        traverse(x - 1, y, path + 'L')
    }
    if (x + 1 < n && +map[y][x + 1] - val === 1) {
        traverse(x + 1, y, path + 'R')
    } else return;
}

const zerosRating = ()=>{
    let result = 0;
    zeros.forEach((start) => {
        traverse(start.x, start.y, '')
        result+=Object.keys(paths).length;
        paths = {};
    })
    return result;
}
const result2 = zerosRating();
console.log(result2)