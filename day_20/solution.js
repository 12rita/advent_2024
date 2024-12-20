import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = testInput;

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

const getNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '.' || map[y - 1]?.[x] === 'E') neighbors.push({x, y: y - 1});
    if (map[y + 1]?.[x] === '.' || map[y + 1]?.[x] === 'E') neighbors.push({x, y: y + 1});
    if (map[y]?.[x - 1] === '.' || map[y]?.[x - 1] === 'E') neighbors.push({x: x - 1, y});
    if (map[y]?.[x + 1] === '.' || map[y]?.[x + 1] === 'E') neighbors.push({x: x + 1, y});
    return neighbors;
}

const dijkstra = (map, start, end) => {
    const vertexes = {};
    map.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === '.' || cell === 'E') vertexes[`${i},${j}`] = Infinity;
            if (cell === 'S') {
                vertexes[`${i},${j}`] = 0;
            }

        })
    })

    const queue = [start];
    const visited = {};
    while (queue.length) {
        const current = queue.shift();

        if (visited[`${current.y},${current.x}`]) continue;
        visited[`${current.y},${current.x}`] = true;

        const currentCost = vertexes[`${current.y},${current.x}`];

        const neighbors = getNeighbors(current, map);

        neighbors.forEach(neighbor => {
            if (vertexes[`${neighbor.y},${neighbor.x}`] > currentCost + 1) {
                vertexes[`${neighbor.y},${neighbor.x}`] = currentCost + 1;
            }
            queue.push(neighbor);
            queue.sort((a, b) => vertexes[`${a.x},${a.y}`] - vertexes[`${b.x},${b.y}`]);
        })


    }
    return vertexes[`${end.y},${end.x}`];

}

// const result = dijkstra();

const cheats = () => {
    const {map, start, end} = init();
    const cheats = {};
    const baseResult = dijkstra(map, start, end);

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            console.log(`${j}/${map[i].length}; ${i}/${map.length}`)
            if (map[i][j] === '#') {
                map[i][j] = '.';

                const result = dijkstra(map, start, end);
                // console.log({result})
                if (result < baseResult) {
                    const diff = baseResult - result;
                    cheats[diff] = cheats[diff] ? [...cheats[diff], {y: i, x: j}] : [{y: i, x: j}];
                }
                map[i][j] = '#';
            }
        }
    }
    return cheats;

}


const t1 = Date.now();
// const result = cheats();
const t2 = Date.now();
// console.log(Object.keys(result).reduce((acc, key) => {
//     if (+key >= 100) {
//         return acc + result[key].length
//     }
//     return acc;
// }, 0), t2 - t1);

/*--------------------Part2-----------------------------------------*/
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
    return way;

}

const getWallNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] === '#') neighbors.push({x, y: y - 1});
    if (map[y + 1]?.[x] === '#') neighbors.push({x, y: y + 1});
    if (map[y]?.[x - 1] === '#') neighbors.push({x: x - 1, y});
    if (map[y]?.[x + 1] === '#') neighbors.push({x: x + 1, y});
    return neighbors;
}


const getKey = (...points) => {
    return points.map(point => `${point.y},${point.x}`).join('-');
}
const findCheat = ({start, point, map, limit, length, visited}) => {

// console.log({point, length, limit})
    visited[getKey(point)] = true;
    if (length > limit) return [];
    const wallNeighbors = getWallNeighbors(point, map);

    const ends = wallNeighbors.filter(neighbor => !visited[getKey(neighbor)]).reduce((acc, neighbor) => {
        const localRes = findCheat({start, point: neighbor, map, limit, length: length + 1, visited});

// console.log({localRes})
        return [...acc, ...localRes]
    }, [])
    // console.log({point, length, limit})
    // console.log({ends})

    if (point.x !== start.x && point.y !== start.y) {
        const neighbors = getNeighbors(point, map);
        if (neighbors.length) {
            // console.log({start, point, neighbors})
            return [...ends, ...neighbors.map(neighbour => ({
                point: neighbour,
                length: length + 1
            }))]
        }
    }
    // console.log({start, ends})
    return ends
}

const optimizeWay = () => {
    const way = getWay();
    console.log(way.length)
    const cache = {};
    const visited = {}
    const {map} = init();

    way.forEach((startPoint, i) => {

        const ends = findCheat({start: startPoint, point: startPoint, map, limit: 19, length: 0, visited: {}});

        ends.forEach(({point: endPoint, length}) => {

            const endIdx = way.findIndex(point => point.x === endPoint.x && point.y === endPoint.y);

            if (endIdx - i > 0 && endIdx - i + 1 - length > 0) {
                const diff = endIdx - i + 1 - length;
                const storedDiff = visited[getKey(startPoint, endPoint)]
                if (storedDiff) {
                    if (storedDiff > diff) {

                    }
                }
                console.log({startPoint: `${startPoint.x}, ${startPoint.y}`, endPoint, length, diff})
                cache[diff] = cache[diff] ? cache[diff] + 1 : 1;
            }


        })

    })
    return cache;
}

const result2 = optimizeWay();
// console.log(result2)