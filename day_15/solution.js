import {test2, testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

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



