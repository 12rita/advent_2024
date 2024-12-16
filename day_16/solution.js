import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = testInput;
const vertexes = {};
const map = inputSwitch.split("\n").map((line, y) => {
    const row = line.split("");
    row.forEach((item, x) => {
        if (item !== "#") vertexes[`${x},${y}`] = {distance: Infinity, dir: '', parent: [], x, y};
    })
    return row;

});

const m = map.length, n = map[0].length;
const start = {x: 1, y: m - 2};
const finish = {x: n - 2, y: 1};
vertexes[`${start.x},${start.y}`] = {distance: 0, dir: 'R', parent: [], x: start.x, y: start.y};

const getNeighbors = (point) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '.' || map[y - 1]?.[x] === 'E') neighbors.push({x, y: y - 1, dir: 'U'});
    if (map[y + 1]?.[x] === '.' || map[y + 1]?.[x] === 'E') neighbors.push({x, y: y + 1, dir: 'D'});
    if (map[y]?.[x - 1] === '.' || map[y]?.[x - 1] === 'E') neighbors.push({x: x - 1, y, dir: 'L'});
    if (map[y]?.[x + 1] === '.' || map[y]?.[x + 1] === 'E') neighbors.push({x: x + 1, y, dir: 'R'});
    return neighbors;
}
const dijkstra = () => {
    const visited = {};
    const queue = [{x: start.x, y: start.y, dir: 'R'}];

    while (queue.length) {
        // console.log({queue});

        const current = queue.shift();
        if (visited[`${current.x},${current.y}`]) continue;
        else visited[`${current.x},${current.y}`] = true;
        const neighbors = getNeighbors(current);
        const currentDistance = vertexes[`${current.x},${current.y}`].distance;
        neighbors.forEach(neighbor => {
                const {x, y, dir} = neighbor;
                const newDelta = dir !== current.dir ? 1001 : 1;
                const neighborDistance = vertexes[`${x},${y}`].distance;
                const neighbourParent = vertexes[`${x},${y}`].parent;
                const newDir = neighborDistance <= currentDistance + newDelta ? current.dir : dir;
                const newParent = neighborDistance < currentDistance + newDelta ? neighbourParent : neighborDistance > currentDistance + newDelta ? [vertexes[`${current.x},${current.y}`]] : [vertexes[`${current.x},${current.y}`], ...neighbourParent];
                vertexes[`${x},${y}`] = {
                    distance: Math
                        .min(neighborDistance, currentDistance + newDelta), dir: newDir, parent: newParent, x, y
                };

            }
        )
        queue.push(...neighbors.filter(neighbor => !visited[`${neighbor.x},${neighbor.y}`]));
        queue.sort((a, b) => vertexes[`${a.x},${a.y}`].distance - vertexes[`${b.x},${b.y}`].distance);

    }


}

dijkstra();
// console.log(vertexes)
const result = vertexes[`${finish.x},${finish.y}`].distance;
console.log(result);
/*--------------------Part2-----------------------------------------*/


const unique = new Set();
const visited2 = {};

const oppositeDir = {
    'U': 'D',
    'D': 'U',
    'L': 'R',
    'R': 'L'
}
const findAllPaths = (start, finish, length, vertexes) => {
    const {x, y, dir} = start;
    console
     .log({x, y, dir});

    if (visited2[`${x},${y},${dir}`]) return;
    visited2[`${x},${y},${dir}`] = true;

    if (start.x === finish.x && start.y === finish.y) {
        // console.log({length, vertexes})
        vertexes.forEach((vertex) => {
            map[vertex.y][vertex.x] = 'O';
            unique.add(vertex.x + ',' + vertex.y);
        })
        return;
    } else {
        const neighbors = getNeighbors(start);
        // console.log({start,neighbors})
        if (neighbors.length)
            neighbors.forEach((neighbor) => {
                findAllPaths(neighbor, finish, length + 1, [...vertexes, neighbor])
            })
        else return;
    }
}

findAllPaths({...start, dir:'R'}, finish, 0, [start]);


console.log(unique.size)
// console.table(map)