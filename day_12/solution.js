import {input} from "./input.js";
import {test1, test2, test3, testInput} from "./test.js";

const inputSwitch = test3;

const map = inputSwitch.split("\n").map(el => el.split(""));
const m = map.length, n = map[0].length;
const visited = new Set();

const traverse = () => {
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (!visited.has(`${i},${j}`)) {
                result += findIsland({x: i, y: j});
                // console.table(map)
            }
        }

    }

    return result
}


const findIsland = (point) => {

    const stack = [];
    stack.push(point);
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
            if (!visited.has(`${x - 1},${y}`))
                stack.push({x: x - 1, y})

            localPerimeter--;
        }
        if (x + 1 < m && map[x + 1][y] === val) {
            if (!visited.has(`${x + 1},${y}`))
                stack.push({x: x + 1, y})
            localPerimeter--;
        }
        if (y - 1 >= 0 && map[x][y - 1] === val) {
            if (!visited.has(`${x},${y - 1}`))
                stack.push({x, y: y - 1})
            localPerimeter--;
        }
        if (y + 1 < n && map[x][y + 1] === val) {
            if (!visited.has(`${x},${y + 1}`))
                stack.push({x, y: y + 1})
            localPerimeter--;
        }

        perimeter += localPerimeter;
    }


    return perimeter * area

}

const result = traverse()
console.log(result)
/*--------------------Part2-----------------------------------------*/

const dict = {}

const categorize = () => {

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            const val = map[i][j];
            if (!dict[val]) dict[val] = []
            dict[val].push({x: i, y: j})
        }

    }

}

Array.prototype.includes = function (el) {
    return !!this.find((item) => item.x === el.x && item.y === el.y);

}
const countNeighbors = (point, key) => {
    const {x, y} = point;
    let result = 0;
    if (dict[key].includes({x: x - 1, y})) result++;
    if (dict[key].includes({x: x + 1, y})) result++;
    if (dict[key].includes({x, y: y - 1})) result++;
    if (dict[key].includes({x, y: y + 1})) result++;
    return result;
}


const count2NeighborsEdges = (point, key) => {
    const {x, y} = point;

    if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x: x + 1, y})) return 0;
    if (dict[key].includes({x, y: y - 1}) && dict[key].includes({x, y: y + 1})) return 0;
    else {
        if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x, y: y - 1})){
            if (dict[key].includes({x: x - 1, y: y - 1}) ) return 1;
            else return 2;
        }
        if (dict[key].includes({x: x + 1, y}) && dict[key].includes({x, y: y + 1})){
            if (dict[key].includes({x: x + 1, y: y + 1}) ) return 1;
            else return 2;
        }
        if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x, y: y + 1})){
            if (dict[key].includes({x: x - 1, y: y + 1}) ) return 1;
            else return 2;
        }
        if (dict[key].includes({x: x + 1, y}) && dict[key].includes({x, y: y - 1})){
            if (dict[key].includes({x: x + 1, y: y - 1}) ) return 1;
            else return 2;
        }
    }

}

const count3NeighborsEdges = (point, key) => {
    const {x, y} = point;
    if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x: x + 1, y}) && dict[key].includes({x, y: y - 1})){
        if (dict[key].includes({x: x - 1, y: y - 1}) && dict[key].includes({x: x + 1, y: y - 1}) ) return 0;
        else if (dict[key].includes({x: x - 1, y: y - 1}) || dict[key].includes({x: x + 1, y: y - 1}) ) return 1
        else return 2;
    }
    if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x: x + 1, y}) && dict[key].includes({x, y: y + 1})){
        if (dict[key].includes({x: x - 1, y: y + 1}) && dict[key].includes({x: x + 1, y: y + 1}) ) return 0;
        else if (dict[key].includes({x: x - 1, y: y + 1}) || dict[key].includes({x: x + 1, y: y + 1}) ) return 1
        else return 2;
    }
    if (dict[key].includes({x: x - 1, y}) && dict[key].includes({x, y: y - 1}) && dict[key].includes({x, y: y + 1})){
        if (dict[key].includes({x: x - 1, y: y - 1}) && dict[key].includes({x:x-1, y: y + 1}) ) return 0;
        else if (dict[key].includes({x: x - 1, y: y - 1}) || dict[key].includes({x:x-1, y: y + 1}) ) return 1
        else return 2;
    }
    if (dict[key].includes({x: x + 1, y}) && dict[key].includes({x, y: y - 1}) && dict[key].includes({x, y: y + 1})){
        if (dict[key].includes({x: x + 1, y: y - 1}) && dict[key].includes({x:x+1, y: y + 1}) ) return 0;
        else if (dict[key].includes({x: x + 1, y: y - 1}) || dict[key].includes({x:x+1, y: y + 1}) ) return 1
        else return 2;
    }
}

const count4NeighborsEdges = (point, key) => {
    const {x, y} = point;
    let result = 4;

    if (dict[key].includes({x: x - 1, y: y - 1})) result--;
    if (dict[key].includes({x: x + 1, y: y + 1})) result--;
    if (dict[key].includes({x: x - 1, y: y + 1})) result--;
    if (dict[key].includes({x: x + 1, y: y - 1})) result--;
    return result;

}

const discountedPrice = ()=>{
    let result = 0;
    Object.keys(dict).forEach(key=>{
        const cells = dict[key];
        const edges = cells.reduce((acc,cell)=>{
            const neighbors = countNeighbors(cell,key);
            // console.log({cell,neighbors})
            if (neighbors === 0) return acc+4;
            if (neighbors === 1) return acc+2;
            if (neighbors === 2) {
                return acc+count2NeighborsEdges(cell,key);
            }
            if (neighbors === 3) {

                return acc+count3NeighborsEdges(cell,key);

            }
            else return acc+count4NeighborsEdges(cell,key);
        },0)
        // console.log({edges}, dict[key].length)
        result += edges*dict[key].length;
    })
    return result;
}
categorize();
// console.log(dict)
const result2 = discountedPrice();
console.log({result2})