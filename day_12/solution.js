import {input} from "./input.js";
import {test1, test2, test3, testInput} from "./test.js";

const inputSwitch = input;

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

