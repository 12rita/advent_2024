import {input} from "./input.js";
import {testInput} from "./test.js";

const start = {x: 0, y: 0}
const map = input.split('\n').map((line, idx) => {
    const row = line.split('');
    const startIdx = row.findIndex(char => char === '^')
    if (startIdx !== -1) {
        start.x = idx;
        start.y = startIdx;
    }
    return row;
})

const startX = start.x, startY = start.y;
const m = map.length, n = map[0].length;
console.log(m, n)

const dir = [[-1, 0], //up
    [0, 1], //right
    [1, 0], //down
    [0, -1]] //left

const visited = {};

const traverse = () => {
    let k = 0;
    let turns = 0;

    while (start.x < m && start.x >= 0 && start.y < n && start.y >= 0) {
        const {x, y} = start;

        visited[`${x},${y}`] = true;


        const [dx, dy] = dir[k];
        const nextStep = map[x + dx]?.[y + dy];
        if (nextStep !== '#') {
            start.x += dx;
            start.y += dy;
        } else {
            k = (k + 1) % 4;
        }

    }

}

traverse();
const result = Object.keys(visited).length;
console.log(result)
/*--------------------Part2-----------------------------------------*/

const checkLoop = (xS, yS) => {
    let k = 0;

    const visited = {};
    const start = {x: xS, y: yS};

    while (start.x < m && start.x >= 0 && start.y < n && start.y >= 0) {
        const {x, y} = start;
        if (!visited[`${x},${y},${k}`])
            visited[`${x},${y},${k}`] = true;
        else return 1

        const [dx, dy] = dir[k];
        const nextStep = map[x + dx]?.[y + dy];
        if (nextStep !== '#') {
            start.x += dx;
            start.y += dy;
        } else {

            k = (k + 1) % 4;
        }

    }
    return 0
}

const now = Date.now();
let result2 = 0;
const makeObstacle = () => {

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const sym = map[i][j]
            if (sym === '.' && (i !== startX || j !== startY)) {
                map[i][j] = '#'
                result2 += checkLoop(startX, startY);

                map[i][j] = '.'
            }
        }
    }
}
makeObstacle();
const later = Date.now();
const diff = later - now;
console.log({result2, diff})
