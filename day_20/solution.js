import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = testInput;
const tippingPoint = 50;
const maxLength = 2;
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


// const t1 = Date.now();
// const result = cheats();
// const t2 = Date.now();
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
    way.push(vertex)
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

const getAllNeighbors = (point, map) => {
    const {x, y} = point;

    const neighbors = [];
    if (map[y - 1]?.[x] !== undefined) neighbors.push({x, y: y - 1, val: map[y - 1][x]});
    if (map[y + 1]?.[x] !== undefined) neighbors.push({x, y: y + 1, val: map[y + 1][x]});
    if (map[y]?.[x - 1] !== undefined) neighbors.push({x: x - 1, y, val: map[y][x - 1]});
    if (map[y]?.[x + 1] !== undefined) neighbors.push({x: x + 1, y, val: map[y][x + 1]});
    return neighbors;
}

const getKey = (...points) => {
    return points.map(point => point.dir ? `${point.x},${point.y},${point.dir}` : `${point.x},${point.y}`).join('-');
}
const getPoint = (key) => {
    const [y, x] = key.split(',').map(Number);
    return {x, y}
}


const bfs = (start, map) => {
    const stack = [];
    const visited = {};
    const win = {};
    stack.push({point: start, length: 0});
    while (stack.length) {

        const el = stack.shift();

        const {point, length} = el;
        const visitedKey = getKey(point);
        visited[visitedKey] = true;
        const wallNeighbors = getWallNeighbors(point, map);
        const neighbors = point.x === start.x && point.y === start.y ? [] : getNeighbors(point, map);

        if (neighbors.length) {

            neighbors.forEach(neighbor => {
                if (neighbor.x !== start.x || neighbor.y !== start.y) {
                    const key = getKey(neighbor);


                    if (!win[key] || win[key] > length + 1) {
                        win[key] = length + 1
                    }
                }

            })
        }
        if (wallNeighbors.length) {
            wallNeighbors.forEach(neighbor => {
                const wallKey = getKey(neighbor);
                if (!visited[wallKey]) {
                    stack.push({point: neighbor, length: length + 1})
                }
            })
        }
    }

    return Object.keys(win).filter(key => win[key] <= 2).map(key => {
        return {point: getPoint(key), length: win[key]}
    });
}

const optimizeWay = () => {
    const way = getWay();
    const wayLength = way.length - 1;
    let result = 0;
    const visited = {}
    const {map} = init();

    way.forEach((startPoint, i) => {
        console.log(`${i}/${wayLength}`)
        const cheats = bfs(startPoint, map);
        cheats.forEach(({point, length}) => {


            const endIdx = way.findIndex(el => el.x === point.x && el.y === point.y);

            const newLength = i + length + (wayLength - endIdx);
            const diff = wayLength - newLength;
            if (diff >= limit) {
                visited[diff] = (visited[diff] || 0) + 1;
                result++;
            }

        })
    })
    console.log(visited)
    return result;
}

// const result2 = optimizeWay();

const bfs2 = (start, finish, map) => {
    const queue = [];
    queue.push({point: start, length: 0});
    // console.log({start, finish})
    const visited = {};
    const paths = {};
    while (queue.length) {
        const el = queue.shift();
        const {point, length} = el;
        // if (point.x === finish.x && point.y === finish.y) {
        //     return length;
        // }
        // console.log(queue)
        const key = getKey(point);
        if (visited[key]) continue;
        visited[key] = true;

        if (point.x === finish.x && point.y === finish.y) {
            return paths
        }

        const neighbours = getAllNeighbors(point, map);
        // console.log({point, neighbours})
        neighbours.forEach((neighbour) => {
            const neighbourKey = getKey(neighbour);
            // console.log({neighbourKey, visited: visited[neighbourKey]})
            if (neighbour.val === '#') {

                if (!visited[neighbourKey] && length + 1 <= maxLength) {
                    queue.push({point: neighbour, length: length + 1});
                }
                // console.log(point)
            } else {

                if (!visited[neighbourKey] && length + 1 <= maxLength) {
                    paths[neighbourKey] = {length: length + 1, point: neighbour}
                    queue.push({point: neighbour, length: length + 1});
                }
                // console.log(point);
            }
        })
        // console.log({paths})
    }
    // console.log('point', paths['2,1'])
    return paths;

}

const findCheats = () => {
    const way = getWay();
    // console.log(way)
    const {map, end} = init();
    const wins = {};
    // console.log(way)

    for (let i = 0; i < way.length; i++) {
        // console.log({i},i + limit + 1, way.length - limit - 1 )
        const paths = bfs2(way[i], end, map);
        // console.log({start: way[i], paths});
        Object.keys(paths).forEach(key => {

            // const end = getPoint(key);
            const {length, point: end} = paths[key];
            const endIdx = way.findIndex(el => el.x === end.x && el.y === end.y);
            if (!endIdx <= i) {
                // const newLength = i + length + (way.length - 1 - endIdx);
                // const diff = way.length - 1 - newLength;

                const diff = endIdx - i - length;

               if (diff > 0) console.log({length, star:way[i], diff, wayLength: way.length, endIdx, end})
                if (diff >= tippingPoint) {

                    wins[diff] = wins[diff] ? wins[diff] + 1 : 1;
                }

                if (diff === 76) {
                    console.log(way[i].x, way[i].y);
                    console.log(way[endIdx].x, way[endIdx].y);
                }
            }
        });


        // for (let j = i + 1; j < way.length; j++) {
        //     // console.log({j})
        //     const start = way[i];
        //     const finish = way[j];
        //
        //
        //     const mapCopy = JSON.parse(JSON.stringify(map));
        //     mapCopy[finish.y][finish.x] = '#';
        //     const res = bfs2(start, finish, mapCopy);
        //     // if (start.y === 7 && finish.y === 7 && start.x === 7 && finish.x === 5)
        //     if (res <= length) {
        //         const newLength = i + res + (way.length - j);
        //
        //         const diff = way.length - newLength;
        //
        //         if (start.x === 1 && start.y === 3 && finish.y === 7) {
        //             console.log({res, diff, i, j, newLength, start, finish})
        //         }
        //         if (diff >= limit) {
        //
        //             wins[diff] = (wins[diff] || 0) + 1;
        //         }
        //     }
        // }
    }

    return wins
}
const result2 = findCheats();
console.log(result2);
