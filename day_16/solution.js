import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const init = (input) => {
    const vertexes = {};
    const map = input.split("\n").map((line, y) => {
        const row = line.split("");
        row.forEach((item, x) => {
            if (item !== "#") vertexes[`${x},${y}`] = {distance: Infinity, dir: '', parent: [], x, y};
        })
        return row;

    });

    const m = map.length, n = map[0].length;
    const start = {x: 1, y: m - 2, dir: 'R'};
    const finish = {x: n - 2, y: 1};
    vertexes[`${start.x},${start.y}`] = {distance: 0, dir: 'R', parent: [], x: start.x, y: start.y};

    return {map, vertexes, start, finish}
}

const getNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '.' || map[y - 1]?.[x] === 'E') neighbors.push({x, y: y - 1, dir: 'U'});
    if (map[y + 1]?.[x] === '.' || map[y + 1]?.[x] === 'E') neighbors.push({x, y: y + 1, dir: 'D'});
    if (map[y]?.[x - 1] === '.' || map[y]?.[x - 1] === 'E') neighbors.push({x: x - 1, y, dir: 'L'});
    if (map[y]?.[x + 1] === '.' || map[y]?.[x + 1] === 'E') neighbors.push({x: x + 1, y, dir: 'R'});
    return neighbors;
}

const dijkstra = (start, finish, vertexes, map) => {
    const visited = {};
    const queue = [{x: start.x, y: start.y, dir: 'R'}];

    while (queue.length) {
        // console.log({queue});

        const current = queue.shift();
        if (visited[`${current.x},${current.y}`]) continue;
        else visited[`${current.x},${current.y}`] = true;
        const neighbors = getNeighbors(current, map);
        const currentDistance = vertexes[`${current.x},${current.y}`].distance;
        neighbors.forEach(neighbor => {
                const {x, y, dir} = neighbor;
                const newDelta = dir !== current.dir ? 1001 : 1;
                const neighborDistance = vertexes[`${x},${y}`].distance;
                const newDir = neighborDistance <= currentDistance + newDelta ? current.dir : dir;

                vertexes[`${x},${y}`] = {
                    distance: Math
                        .min(neighborDistance, currentDistance + newDelta), dir: newDir, x, y
                };

            }
        )
        queue.push(...neighbors.filter(neighbor => !visited[`${neighbor.x},${neighbor.y}`]));
        queue.sort((a, b) => vertexes[`${a.x},${a.y}`].distance - vertexes[`${b.x},${b.y}`].distance);

    }

    return vertexes[`${finish.x},${finish.y}`].distance;

}

const {map, vertexes, start, finish} = init(inputSwitch)
const result1 = dijkstra(start, finish, vertexes, map);


console.log(result1);
/*--------------------Part2-----------------------------------------*/


const getKey = (point) => {
    const {x, y, dir} = point;
    return dir ? `${x},${y},${dir}` : `${x},${y}`
}

const findAllPaths = (start, finish, map) => {

    const costs = {};
    const startKey = getKey(start);
    costs[startKey] = 0;


    const traverse = (point, finish) => {
        const stack = [];
        const paths = new Set();
        stack.push({point: start, cost: 0, path: [start]});

        while (stack.length) {
            const el = stack.shift();
            const {point, cost, path} = el
            if (point.x === finish.x && point.y === finish.y && cost <= result1) {

                path.forEach(el => {
                    paths.add(el)
                });
                paths.add(finish);
            }
            const neighbors = getNeighbors(point, map);
            for (let neighbor of neighbors) {
                const localCost = cost + (neighbor.dir !== point.dir ? 1001 : 1);
                const key = getKey(neighbor);

                if (!costs[key] || costs[key] >= localCost) {
                    costs[key] = localCost;
                    stack.push({point: neighbor, cost: localCost, path: [...path, neighbor]})

                }

            }
        }
        return paths;

    }

    const unique = new Set();
    const result = traverse(start, finish);
    result.forEach(val => {
        unique.add(getKey({x: val.x, y: val.y}));
    })
    return unique.size

}

const result2 = findAllPaths(start, finish, map);
console.log(result2);

