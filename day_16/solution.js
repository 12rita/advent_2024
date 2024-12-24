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
const result = vertexes[`${finish.x},${finish.y}`].distance;
console.log(result);
/*--------------------Part2-----------------------------------------*/


const unique = new Set();

const getKey = (point) => {
    const {x, y, dir} = point;
    return dir ? `${x},${y},${dir}` : `${x},${y}`
}
const visited2 = {};

const oppositeDir = {
    'U': 'D',
    'D': 'U',
    'L': 'R',
    'R': 'L'
}
const findAllPaths = (start, finish) => {

    const costs = {};
    const startKey = getKey(start);
    costs[startKey] = 0;
    const paths = new Set();

    const traverse = (point, finish, path, cost) => {
        // console.log({point, path, cost});
        // console.log({costs})
        if (point.x === finish.x && point.y === finish.y) {
            path.push(finish)
            return path
        }
        const neighbors = getNeighbors(point);
        // console.log(neighbors)
        neighbors.forEach(neighbor => {
            const localCost = cost + (neighbor.dir !== point.dir ? 1001 : 1);
            const key = getKey(point);
            if (costs[key]) {
                if (costs[key] <= localCost) {
                    costs[key] = localCost;
                    const newPath = traverse(neighbor, finish, [...path, neighbor]);
                    newPath.forEach(el => {
                        paths.add(el)
                    });
                }
                else return []
            } else {
                costs[key] = localCost;
                const newPath = traverse(neighbor, finish, [...path, neighbor], localCost);
                newPath.forEach(el => {
                    paths.add(el)
                });
            }

        })

        return paths

    }

    const result = traverse(start, finish, [], 0);
    console.log(result)

}

findAllPaths(vertexes[`${start.x},${start.y}`], finish,);


console.log(unique.size)
console.table(map)
