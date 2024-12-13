import {input} from "./input.js";
import {test2, testInput} from "./test.js";

const inputSwitch = input;

const splitStringHalf = (str)=>{
    return [str.slice(0, str.length/2), String(Number(str.slice(str.length/2)))]
}

const rocks = inputSwitch.split(" ");
const cycle = ()=>{
    for (let i = 0;i<75;i++){
        for (let j = 0; j<rocks.length; j++){
            if (rocks[j] === "0") rocks[j]="1";
            else if (rocks[j].length % 2 === 0) {
                rocks.splice(j,1, ...splitStringHalf(rocks[j]))
                j++
            }
            else rocks[j] = String(+rocks[j]*2024)

        }
    }
}
const f = Date.now()
cycle()
const diff = Date.now() - f
console.log(rocks.length,diff )

// 1 2024 1 0 9 9 2021976
// 2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2
/*--------------------Part2-----------------------------------------*/
