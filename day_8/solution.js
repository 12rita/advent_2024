import {input} from "./input.js";
import {testInput} from "./test.js";

const dict = {}

const map = input.split('\n').map((line, y) => {
    const row = line.split('');
    row.forEach((sym, x) => {
        if (sym !== '.') {
            if (!dict[sym]) dict[sym] = [];
            dict[sym].push({x, y})
        }
    })
    return row;
})

const m = map.length, n = map[0].length;

const unique = {};

Object.keys(dict).forEach((key) => {
    const fqs = dict[key];

    for (let i = 0; i < fqs.length; i++) {

        for (let j = 0; j < fqs.length; j++) {
            if (i === j) break;
            const {x, y} = fqs[i];
            const {x: x1, y: y1} = fqs[j];

            const distX = x - x1;
            const distY = y - y1;

            const firstAN = {x: x + distX, y: y + distY};
            const secondAN = {x: x1 - distX, y: y1 - distY};


            if (firstAN.x < n && firstAN.x >= 0 && firstAN.y < m && firstAN.y >= 0) {
                unique[`${firstAN.x},${firstAN.y}`] = true;
            }
            if (secondAN.x < n && secondAN.x >= 0 && secondAN.y < m && secondAN.y >= 0) {
                unique[`${secondAN.x},${secondAN.y}`] = true;
            }


        }

    }
})

const result = Object.keys(unique).length;

console.log(result)

/*--------------------Part2-----------------------------------------*/

const unique2 = {};

Object.keys(dict).forEach((key) => {
    const fqs = dict[key];

    for (let i = 0; i < fqs.length; i++) {

        for (let j = 0; j < fqs.length; j++) {
            if (i === j) break;
            const {x, y} = fqs[i];
            const {x: x1, y: y1} = fqs[j];

            const distX = x - x1;
            const distY = y - y1;


            let k = 1;
            let newX = x, newY = y;
            while (newX < n && newX >= 0 && newY < m && newY >= 0) {

                unique2[`${newX},${newY}`] = true;
                newX = x + k * distX;
                newY = y + k * distY;

                k++
            }
            k = 1;
            newX = x1;
            newY = y1;

            while (newX < n && newX >= 0 && newY < m && newY >= 0) {
                unique2[`${newX},${newY}`] = true;
                newX = x1 - k * distX;
                newY = y1 - k * distY;

                k++
            }

        }

    }
})


const result2 = Object.keys(unique2).length;

console.log(result2)
