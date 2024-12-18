import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const m = 71, n = 71;
const limit = 1024;

const init = () => {
    const map = [];
    for (let i = 0; i < m; i++) {
        const row = new Array(n).fill('.')
        map.push(row)
    }
    // console.log(map)
    inputSwitch.split('\n').slice(0, limit).forEach((el) => {
        // console.log({el})
        const [x, y] = el.split(',').map(el => +el);
        map[y][x] = '#';
    })
    return map;
}

const getNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '.') neighbors.push({x, y: y - 1});
    if (map[y + 1]?.[x] === '.') neighbors.push({x, y: y + 1});
    if (map[y]?.[x - 1] === '.') neighbors.push({x: x - 1, y});
    if (map[y]?.[x + 1] === '.') neighbors.push({x: x + 1, y});
    return neighbors;
}

const bfs = (start, finish, map) => {
    const stack = [];
    const visited = new Set();
    stack.push(start);
    // visited.add(start.x + ',' + start.y);
    while (stack.length > 0) {
        // console.log(stack)
        const current = stack.shift();

        const {x, y, step} = current;

        if (visited.has(x + ',' + y)) continue;
        else visited.add(x + ',' + y);

        if (x === finish.x && y === finish.y) {
            return step
        }
        const neighbors = getNeighbors(current, map);
        neighbors.forEach((point) => {
            if (!visited.has(point.x + ',' + point.y)) stack.push({...point, step: step + 1})
        })
    }
    return 0
}

const map = init();

const result = bfs({x: 0, y: 0, step: 0}, {x: n - 1, y: m - 1, step: 0}, map);

console.log({result})
/*--------------------Part2-----------------------------------------*/

const nextByte = (map)=>{
   const leftBytes = inputSwitch.split('\n').slice(limit);


   for (let byte of leftBytes){
       const [x, y] = byte.split(',').map(el => +el);
       map[y][x] = '#';
       const hasPath = bfs({x: 0, y: 0, step: 0}, {x: n - 1, y: m - 1, step: 0}, map);
       if (!hasPath) return byte

   }

}
const result2 = nextByte(map);
console.log({result2})