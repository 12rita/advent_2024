import {input} from "./input.js";
import {testInput} from "./test.js";

const start = {x: 0, y: 0}

const map = testInput.split('\n').map((line, idx) => {
    const row = line.split('');
    const startIdx = row.findIndex(char => char === '^')
    if (startIdx !== -1) {
        start.x = idx;
        start.y = startIdx;
    }
    return row;
})

const m = map.length, n = map[0].length;
console.log(m,n)

const dir = [
    [-1, 0], //up
    [0, 1], //right
    [1, 0], //down
    [0, -1]] //left

const visited = {};

const traverse = () => {
    let k = 0;
    let turns = 0;
console.log(start)
    while (start.x < m && start.x >= 0 && start.y < n && start.y >= 0) {

        const {x, y} = start;

        visited[`${x},${y}`] = true;


        const [dx, dy] = dir[k];
        const nextStep = map[x + dx]?.[y + dy];
        if (nextStep !== '#') {
            map[x][y] = dy === 0 ? '|' : '—';
            start.x += dx;
            start.y += dy;
        } else {
            turns++
            k = (k + 1) % 4;
        }



    }
    console.log(turns)
}

traverse();
console.table(map)

console.log(Object.keys(visited).length)

/*--------------------Part2-----------------------------------------*/

