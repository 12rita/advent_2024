import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;
const TIPPING_POINT = 100;
const MAX_LENGTH = 20;
/**
 * A number, or a string containing a number.
 * @typedef {{x:number; y:number; val?:string}} Point
 * @typedef {string[][]} Map
 */


const init = () => {
    const map = inputSwitch.split('\n').map(line => line.split(''));

    const start = {x: 0, y: 0};
    const end = {x: 0, y: 0};
    map.forEach((row, i) => {
        row.forEach((cell, j) => {

            if (cell === 'S') {

                start.y = i;
                start.x = j;
            }
            if (cell === 'E') {

                end.y = i;
                end.x = j;
            }
        })
    })

    return {map, start, end}
}

/**
 * @param {Point} point
 * @param {Map} map
 * @return {Point[]}
 */
const getNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '.' || map[y - 1]?.[x] === 'E') neighbors.push({x, y: y - 1});
    if (map[y + 1]?.[x] === '.' || map[y + 1]?.[x] === 'E') neighbors.push({x, y: y + 1});
    if (map[y]?.[x - 1] === '.' || map[y]?.[x - 1] === 'E') neighbors.push({x: x - 1, y});
    if (map[y]?.[x + 1] === '.' || map[y]?.[x + 1] === 'E') neighbors.push({x: x + 1, y});
    return neighbors;
}

/**
 * @return {Point[]}
 */
const getWay = () => {
    const {map, start, end} = init();
    const way = [];
    const visited = {};

    let vertex = {...start};
    while (vertex.x !== end.x || vertex.y !== end.y) {
        way.push(vertex);
        visited[getKey(vertex)] = true;
        const neighbors = getNeighbors(vertex, map).filter(neighbor => !visited[getKey(neighbor)]);
        vertex = neighbors[0];
    }
    way.push(vertex)
    return way;

}


/**
 * @param {Point} point
 * @param {Map} map
 * @return {Point[]}
 */
const getAllNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] !== undefined) neighbors.push({x, y: y - 1, val: map[y - 1][x]});
    if (map[y + 1]?.[x] !== undefined) neighbors.push({x, y: y + 1, val: map[y + 1][x]});
    if (map[y]?.[x - 1] !== undefined) neighbors.push({x: x - 1, y, val: map[y][x - 1]});
    if (map[y]?.[x + 1] !== undefined) neighbors.push({x: x + 1, y, val: map[y][x + 1]});
    return neighbors;
}

const getKey = (point) => {
    return `${point.x},${point.y}`;
}


const findCheats = () => {
    const {map} = init();
    const way = getWay();
    const ends = {};
    way.forEach((point, startIdx) => {
        console.log(`${startIdx}/${way.length}`)
        const queue = [];
        const visited = {};
        const local = {};
        queue.push({point, length: 0});
        while (queue.length) {

            const el = queue.shift();
            const {point: start, length} = el;

            const key = getKey(start);
            if (visited[key]) continue;
            visited[key] = true;
            const neighbors = getAllNeighbors(start, map);
// console.log({neighbors})

            neighbors.forEach((neighbor) => {

                if (length + 1 <= MAX_LENGTH && !visited[getKey(neighbor)]) {
                    if (neighbor.val === '.' || neighbor.val === 'E' || neighbor.val === 'S') {
                        const endIdx = way.findIndex(wayPoint =>
                            wayPoint.x === neighbor.x && wayPoint.y === neighbor.y
                        );
                        const diff = endIdx - startIdx - (length + 1);
                        if (diff >= TIPPING_POINT) {
                            local[getKey(neighbor)] = diff;
                        }
                    }

                    const newPoint = {point: neighbor, length: length + 1};
                    queue.push(newPoint);
                }
            })
        }

        Object.keys(local).forEach((key) => {
            const val = local[key];
            ends[val] = ends[val] ? ends[val] + 1 : 1;
        })
    });
    return ends;
}

const cheats = findCheats()
const result = Object.values(cheats).reduce((acc, item) => acc + item, 0)
console.log(result);
