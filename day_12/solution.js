import {input} from "./input.js";
import {test1, test2, test3, test4, test5, testInput} from "./test.js";

Array.prototype.includes = function (el) {
    return !!this.find((item) => item.x === el.x && item.y === el.y);
}


const inputSwitch = input;

const map = inputSwitch.split("\n").map(el => el.split(""));
const m = map.length, n = map[0].length;
const visited = new Set();

const regions = [];

const traverse = () => {
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (!visited.has(`${i},${j}`)) {
                result += findIsland({x: i, y: j})

                // console.table(map)
            }
        }

    }

    return result
}


const findIsland = (point) => {

    const stack = [];
    const cells = [];
    stack.push(point);
    cells.push(point);
    let perimeter = 0;
    let area = 0;
    while (stack.length) {


        const {x, y} = stack.pop();
        if (!visited.has(`${x},${y}`)) visited.add(`${x},${y}`);
        else {
            continue;
        }
        const val = map[x][y];


        let localPerimeter = 4;
        area++;

        if (x - 1 >= 0 && map[x - 1][y] === val) {
            if (!visited.has(`${x - 1},${y}`)) {
                !cells.includes({x: x - 1, y}) && cells.push({x: x - 1, y})
                stack.push({x: x - 1, y})
            }

            localPerimeter--;
        }
        if (x + 1 < m && map[x + 1][y] === val) {
            if (!visited.has(`${x + 1},${y}`)) {
                !cells.includes({x: x + 1, y}) && cells.push({x: x + 1, y})
                stack.push({x: x + 1, y})
            }
            localPerimeter--;
        }
        if (y - 1 >= 0 && map[x][y - 1] === val) {
            if (!visited.has(`${x},${y - 1}`)) {
                !cells.includes({x, y: y - 1}) && cells.push({x, y: y - 1})
                stack.push({x, y: y - 1})
            }
            localPerimeter--;
        }
        if (y + 1 < n && map[x][y + 1] === val) {
            if (!visited.has(`${x},${y + 1}`)) {
                !cells.includes({x, y: y + 1}) && cells.push({x, y: y + 1})
                stack.push({x, y: y + 1})
            }
            localPerimeter--;
        }

        perimeter += localPerimeter;
    }

    regions.push(cells)
    return perimeter * area

}

const result = traverse()
console.log(result)
/*--------------------Part2-----------------------------------------*/

const countNeighbors = (point, cells) => {
    const {x, y} = point;
    let result = 0;
    if (cells.includes({x: x - 1, y})) result++;
    if (cells.includes({x: x + 1, y})) result++;
    if (cells.includes({x, y: y - 1})) result++;
    if (cells.includes({x, y: y + 1})) result++;
    return result;
}


const count2NeighborsEdges = (point, cells) => {
    const {x, y} = point;

    if (cells.includes({x: x - 1, y}) && cells.includes({x: x + 1, y})) return 0;
    if (cells.includes({x, y: y - 1}) && cells.includes({x, y: y + 1})) return 0;
    else {
        if (cells.includes({x: x - 1, y}) && cells.includes({x, y: y - 1})) {
            if (cells.includes({x: x - 1, y: y - 1})) return 1;
            else return 2;
        }
        if (cells.includes({x: x + 1, y}) && cells.includes({x, y: y + 1})) {
            if (cells.includes({x: x + 1, y: y + 1})) return 1;
            else return 2;
        }
        if (cells.includes({x: x - 1, y}) && cells.includes({x, y: y + 1})) {
            if (cells.includes({x: x - 1, y: y + 1})) return 1;
            else return 2;
        }
        if (cells.includes({x: x + 1, y}) && cells.includes({x, y: y - 1})) {
            if (cells.includes({x: x + 1, y: y - 1})) return 1;
            else return 2;
        }
    }

}

const count3NeighborsEdges = (point, cells) => {
    const {x, y} = point;
    if (cells.includes({x: x - 1, y}) && cells.includes({x: x + 1, y}) && cells.includes({x, y: y - 1})) {
        if (cells.includes({x: x - 1, y: y - 1}) && cells.includes({x: x + 1, y: y - 1})) return 0;
        else if (cells.includes({x: x - 1, y: y - 1}) || cells.includes({x: x + 1, y: y - 1})) return 1
        else return 2;
    }
    if (cells.includes({x: x - 1, y}) && cells.includes({x: x + 1, y}) && cells.includes({x, y: y + 1})) {
        if (cells.includes({x: x - 1, y: y + 1}) && cells.includes({x: x + 1, y: y + 1})) return 0;
        else if (cells.includes({x: x - 1, y: y + 1}) || cells.includes({x: x + 1, y: y + 1})) return 1
        else return 2;
    }
    if (cells.includes({x: x - 1, y}) && cells.includes({x, y: y - 1}) && cells.includes({x, y: y + 1})) {
        if (cells.includes({x: x - 1, y: y - 1}) && cells.includes({x: x - 1, y: y + 1})) return 0;
        else if (cells.includes({x: x - 1, y: y - 1}) || cells.includes({x: x - 1, y: y + 1})) return 1
        else return 2;
    }
    if (cells.includes({x: x + 1, y}) && cells.includes({x, y: y - 1}) && cells.includes({x, y: y + 1})) {
        if (cells.includes({x: x + 1, y: y - 1}) && cells.includes({x: x + 1, y: y + 1})) return 0;
        else if (cells.includes({x: x + 1, y: y - 1}) || cells.includes({x: x + 1, y: y + 1})) return 1
        else return 2;
    }
}

const count4NeighborsEdges = (point, cells) => {
    const {x, y} = point;
    let result = 4;

    if (cells.includes({x: x - 1, y: y - 1})) result--;
    if (cells.includes({x: x + 1, y: y + 1})) result--;
    if (cells.includes({x: x - 1, y: y + 1})) result--;
    if (cells.includes({x: x + 1, y: y - 1})) result--;
    return result;

}


const discountedPrice = () => {
    let result = 0;
    regions.forEach(cells => {

        const edges = cells.reduce((acc, cell) => {
            const neighbors = countNeighbors(cell, cells);
            // console.log({cell,neighbors, acc})
            if (neighbors === 0) return acc + 4;
            if (neighbors === 1) return acc + 2;
            if (neighbors === 2) {
                return acc + count2NeighborsEdges(cell, cells);
            }
            if (neighbors === 3) {

                return acc + count3NeighborsEdges(cell, cells);

            } else return acc + count4NeighborsEdges(cell, cells);
        }, 0)

        result += edges * cells.length
    })
    return result;
}

const result2 = discountedPrice();
console.log({result2})
