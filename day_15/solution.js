import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const init1 = (input) => {
    const [mapRaw, movesRaw] = input.split('\n\n');

    const moves = movesRaw.split('\n').join('').split('');

    const robot = {x: 0, y: 0};

    const map = mapRaw.split('\n').map((el, idx) => {
        const row = el.split('');
        const robotIdx = row.findIndex(val => val === '@');
        if (robotIdx !== -1) {
            robot.x = robotIdx;
            robot.y = idx;
        }
        return row;
    });

    const m = map.length, n = map[0].length;

    return {map, robot, moves, m, n}

}


// console.table(map)

const dir = {
    '^': {x: 0, y: -1},
    '<': {x: -1, y: 0},
    '>': {x: 1, y: 0},
    'v': {x: 0, y: 1},
}

const simulation = (map, moves, robot, m, n) => {
    moves.forEach((move) => {
        const {x: deltaX, y: deltaY} = dir[move];
        const newPoint = {x: robot.x + deltaX, y: robot.y + deltaY};
        const newValue = map[robot.y + deltaY]?.[robot.x + deltaX];
        // console.log({newPoint, newValue, move});
        if (newValue && newValue !== '#') {

            if (newValue === 'O') {
                let firstEmpty;

                if (move === '^') {
                    for (let i = robot.y; i > 0; i--) {
                        if (map[i][robot.x] === '#') break;
                        if (map[i][robot.x] === '.') {
                            firstEmpty = {x: robot.x, y: i};
                            break;
                        }
                    }
                }
                if (move === '>') {
                    for (let i = robot.x; i < n - 1; i++) {
                        if (map[robot.y][i] === '#') break;
                        if (map[robot.y][i] === '.') {
                            firstEmpty = {x: i, y: robot.y};
                            break;
                        }
                    }
                }
                if (move === 'v') {
                    for (let i = robot.y; i < m - 1; i++) {
                        if (map[i][robot.x] === '#') break
                        if (map[i][robot.x] === '.') {
                            firstEmpty = {x: robot.x, y: i};
                            break;
                        }
                    }
                }
                if (move === '<') {
                    for (let i = robot.x; i > 0; i--) {
                        if (map[robot.y][i] === '#') break;
                        if (map[robot.y][i] === '.') {
                            firstEmpty = {x: i, y: robot.y};
                            break;
                        }
                    }
                }


                if (firstEmpty) {
                    map[firstEmpty.y][firstEmpty.x] = 'O';
                    map[newPoint.y][newPoint.x] = '@';
                    map[robot.y][robot.x] = '.'
                    robot.x = newPoint.x;
                    robot.y = newPoint.y;
                }

            } else {
                map[newPoint.y][newPoint.x] = '@';
                map[robot.y][robot.x] = '.'
                robot.x = newPoint.x;
                robot.y = newPoint.y;
            }


        }
        // console.table(map)
    })

    return map;
}

const countGPS = (map) => {
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (map[i][j] === 'O') result += 100 * i + j
        }
    }
    return result
}

const {map, m, n, moves, robot} = init1(inputSwitch);

const newMap = simulation(map, moves, robot, m, n);
const result = countGPS(newMap);

console.log(robot)
console.log({result})
/*--------------------Part2-----------------------------------------*/

export const init2 = (input) => {
    const [mapRaw, movesRaw] = input.split('\n\n');

    const moves = movesRaw.split('\n').join('').split('');
    const robot = {x: 0, y: 0};

    const map = mapRaw.split('\n').map((el, idx) => {
        const row = el.split('');

        const robotIdx = row.findIndex(val => val === '@');
        if (robotIdx !== -1) {
            robot.x = 2 * robotIdx;
            robot.y = idx;
        }
        const newRow = [];
        row.forEach((el, idx) => {
            if (el === '#') newRow.push('#', '#');
            if (el === '.') newRow.push('.', '.');
            if (el === 'O') newRow.push('[', ']');
            if (el === '@') newRow.push('@', '.');
        })
        return newRow;
    });


    return {map, robot, moves};
}


export const verticalMove = (start, direction, map) => {
    const {x: deltaX, y: deltaY} = dir[direction];
    const newPoint = {x: start.x + deltaX, y: start.y + deltaY};
    const newValue = map[start.y + deltaY]?.[start.x + deltaX];
    // console.log({newPoint, newValue, start})
    if (newValue === ']' || newValue === '[') {
        const left = newValue === '[' ? newPoint.x : newPoint.x - 1;
        const right = newValue === ']' ? newPoint.x : newPoint.x + 1;

        const checkRight = verticalMove({x: right, y: newPoint.y}, direction, map);
        const checkLeft = verticalMove({x: left, y: newPoint.y}, direction, map);
        // console.log({checkRight, checkLeft})
        if (!checkRight || !checkLeft) return false;

        map[newPoint.y][newPoint.x] = map[start.y][start.x];
        map[start.y][start.x] = '.';
        // console.log({start, newPoint, checkRight, checkLeft})
        return true;
    } else if (newValue === '#') {
        return false;
    } else if (newValue === '.') {
        map[newPoint.y][newPoint.x] = map[start.y][start.x];
        map[start.y][start.x] = '.';
        return true;
    }

}

export const moveRight = (robot, map) => {
    const {x, y} = robot;
    const n = map[0].length;
    for (let i = x; i < n - 1; i++) {
        if (map[y][i] === '#') return false;
        if (map[y][i] === '.') {
            map[y].splice(i, 1);
            map[y].splice(robot.x, 0, '.');
            return true;
        }
    }
}

export const moveLeft = (robot, map) => {
    const {x, y} = robot;
    for (let i = x; i > 0; i--) {
        if (map[y][i] === '#') return false;
        if (map[y][i] === '.') {
            map[y].splice(i, 1);
            map[y].splice(x, 0, '.');
            return true;
        }
    }
}

export const simulation2 = ({robot, map, move}) => {

    const {x: deltaX, y: deltaY} = dir[move];
    const newPoint = {x: robot.x + deltaX, y: robot.y + deltaY};
    const newValue = map[robot.y + deltaY]?.[robot.x + deltaX];
    let newMap = JSON.parse(JSON.stringify(map));

    if (newValue && newValue !== '#') {

        if (newValue === '[' || newValue === ']') {

            if (move === '^' || move === 'v') {
                const localMap = JSON.parse(JSON.stringify(map));
                const checkVertical = verticalMove({x: robot.x, y: robot.y}, move, localMap);

                if (checkVertical) {
                    robot.y = newPoint.y;
                    newMap = localMap
                }
            }
            if (move === '>') {
                const localMap = JSON.parse(JSON.stringify(map));
                const checkHorizontal = moveRight(robot, localMap);
                if (checkHorizontal) {
                    robot.x = newPoint.x;
                    newMap = localMap;
                }
            }
            if (move === '<') {
                const localMap = JSON.parse(JSON.stringify(map));
                const checkHorizontal = moveLeft(robot, localMap);
                if (checkHorizontal) {
                    robot.x = newPoint.x;
                    newMap = localMap;
                }
            }


        } else {
            newMap[newPoint.y][newPoint.x] = '@';
            newMap[robot.y][robot.x] = '.'
            robot.x = newPoint.x;
            robot.y = newPoint.y;
        }
    }

    return {map: newMap, robot}
}

const {map: map2, robot: robot2, moves: moves2} = init2(inputSwitch);

export const countGPS2 = (map) => {
    const m = map.length, n = map[0].length;
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (map[i][j] === '[') result += 100 * i + j
        }
    }
    return result
}

const countResult2 = (map, robot, moves) => {
    let localMap = map;
    let localRobot = robot;
    moves.forEach(move => {
        const {map: newMap, robot: newRobot} = simulation2({map: localMap, robot: localRobot, move});
        localMap = newMap;
        localRobot = newRobot;
    });
    return countGPS2(localMap);
}

const result2 = countResult2(map2, robot2, moves2);
console.log({result2});

