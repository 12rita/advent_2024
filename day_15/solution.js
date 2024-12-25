import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = testInput;

const [mapRaw, moves] = inputSwitch.split('\n\n');
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


// console.table(map)

const dir = {
    '^': {x: 0, y: -1},
    '<': {x: -1, y: 0},
    '>': {x: 1, y: 0},
    'v': {x: 0, y: 1},
}

const simulation = (map) => {
    moves.split('').forEach((move) => {
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
}

const countGPS = () => {
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (map[i][j] === 'O') result += 100 * i + j
        }
    }
    return result
}

simulation(map.slice());
const result = countGPS();

// console.table(map)
console.log(robot)
console.log({result})
/*--------------------Part2-----------------------------------------*/

const init = () => {
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


    return {map, robot};
}


const verticalMove = (start, direction, map) => {
    const {x: deltaX, y: deltaY} = dir[direction];
    const newPoint = {x: start.x + deltaX, y: start.y + deltaY};
    const newValue = map[start.y + deltaY]?.[start.x + deltaX];
    console.log({newPoint, newValue})
    if (newValue === ']' || newValue === '[') {
        const left = newValue === '[' ? newPoint.x : newPoint.x - 1;
        const right = newValue === ']' ? newPoint.x : newPoint.x + 1;

        const checkRight = verticalMove({x: right, y: newPoint.y}, direction, map);
        const checkLeft = verticalMove({x: left, y: newPoint.y}, direction, map);
// console.log({checkRight, checkLeft})
        if (!checkRight || !checkLeft) return false;

        if (newValue === '['){

        }
        map[newValue.y][newValue.x]=map[start.y][start.x];
        map[start.y][start.x] = '.';
        // return {
        //     left: checkLeft.x || checkLeft.left,
        //     right: checkRight.x || checkRight.right,
        //     y: direction === '^' ? Math.min(checkLeft.y, checkRight.y) : Math.max(checkLeft.y, checkRight.y)
        // }

    } else if (newValue === '#') {
        return false;
    } else if (newValue === '.') {
        map[newValue.y][newValue.x]=map[start.y][start.x];
        map[start.y][start.x] = '.';
        return true;
    }

}

const simulation2 = (map, robot) => {
    const m = map.length, n = map[0].length;

    moves.split('').forEach((move) => {
        const {x: deltaX, y: deltaY} = dir[move];
        const newPoint = {x: robot.x + deltaX, y: robot.y + deltaY};

        const newValue = map[robot.y + deltaY]?.[robot.x + deltaX];
        // console.log({newPoint, newValue, move});
        if (newValue && newValue !== '#') {

            if (newValue === '[' || newValue === ']') {
                let firstEmpty;

                if (move === '^') {
                    const {left, right, y} = verticalMove({x: robot.x, y: robot.y}, move, map);
                    console.log({left, right, y, move})
                    if (left && right) {
                        // for (let i = y; i < robot.y - 1; i++) {
                        //     for (let j = left; j <= right; j++) {
                        //         map[i][j] = map[i + 1][j];
                        //         map[i + 1][j] = '.';
                        //     }
                        // }
                        // map[robot.y - 1][robot.x] = '@';
                        // map[robot.y][robot.x] = '.';
                        // robot.y = robot.y - 1;
                    }
                }
                if (move === '>') {
                    for (let i = robot.x; i < n - 1; i++) {
                        if (map[robot.y][i] === '#') break;
                        if (map[robot.y][i] === '.') {
                            map[robot.y].splice(i, 1);
                            map[robot.y].splice(robot.x, 0, '.');
                            robot.x = newPoint.x;

                            break;
                        }
                    }
                }
                if (move === 'v') {

                    const {left, right, y} = verticalMove({x: robot.x, y: robot.y}, move, map);
                    console.log({left, right, y, move})
                    if (left && right) {
                        // for (let i = y; i > robot.y + 1; i--) {
                        //     for (let j = left; j <= right; j++) {
                        //         map[i][j] = map[i - 1][j];
                        //         map[i - 1][j] = '.';
                        //     }
                        // }
                        // map[robot.y + 1][robot.x] = '@';
                        // map[robot.y][robot.x] = '.';
                        //
                        // robot.y = newPoint.y;
                    }
                }
                if (move === '<') {
                    for (let i = robot.x; i > 0; i--) {
                        if (map[robot.y][i] === '#') break;
                        if (map[robot.y][i] === '.') {
                            map[robot.y].splice(i, 1);
                            map[robot.y].splice(robot.x, 0, '.');
                            robot.x = newPoint.x;

                            break;
                        }
                    }
                }


                // if (firstEmpty) {
                //     map[firstEmpty.y][firstEmpty.x] = 'O';
                //     map[newPoint.y][newPoint.x] = '@';
                //     map[robot.y][robot.x] = '.'
                //     robot.x = newPoint.x;
                //     robot.y = newPoint.y;
                // }

            } else {
                map[newPoint.y][newPoint.x] = '@';
                map[robot.y][robot.x] = '.'
                robot.x = newPoint.x;
                robot.y = newPoint.y;
            }


        }
        console.table(map.map(el => el.join('')).join('\n'));
    })

}

const {map: map2, robot: robot2} = init();

console.table(map2.map(el => el.join('')).join('\n'));
simulation2(map2, robot2);
console.table(map2.map(el => el.join('')).join('\n'));