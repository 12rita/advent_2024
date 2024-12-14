import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;
const m = 103;
const n = 101;

const centerX = Math.floor(n / 2)
const centerY = Math.floor(m / 2)

console.log(centerX, centerY);
const map = new Array(m).fill('');
map.forEach((item, idx) => {
    map[idx] = new Array(n).fill(0)

});


const getRobots = () => {
    const robots = [];
    inputSwitch.split("\n").forEach(line => {
        const conditions = line.split(' ');
        const [startX, startY] = conditions[0].substring(2).split(',');
        const [vectorX, vectorY] = conditions[1].substring(2).split(',');
        robots.push({x: +startX, y: +startY, vectorX: +vectorX, vectorY: +vectorY});
        map[startY][startX]++;
    });

    return robots;

}


const move = (point, vector) => {
    map[point.y][point.x]--;

    const newX = point.x + vector.x < 0 ? (point.x + vector.x) + n : (point.x + vector.x) % n;
    const newY = point.y + vector.y < 0 ? point.y + vector.y + m : (point.y + vector.y) % m;

    // console.log(point, vector, newY, newX);

    map[newY][newX]++

    return {x: newX, y: newY};
}

const checkQuadrants = () => {
    let first = 0, second = 0, third = 0, fourth = 0;

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (map[i][j]) {
                if (i < centerY) {
                    if (j < centerX)
                        first += map[i][j];
                    else if (j > centerX) {
                        second += map[i][j];
                    }
                } else if (i > centerY) {
                    if (j < centerX) {

                        third += map[i][j];
                    } else if (j > centerX) {
                        fourth += map[i][j];
                    }
                }

            }
        }

    }

    console.log({first, second, third, fourth})

    return first * second * third * fourth
}

const simulation = (robots) => {
    robots.forEach(({x, y, vectorX, vectorY}, idx) => {
        let newPoint = {x, y};
        newPoint = move({x: newPoint.x, y: newPoint.y}, {x: vectorX, y: vectorY});
        robots[idx] = {...robots[idx], x: newPoint.x, y: newPoint.y};

    })
}

const robots = getRobots();
// console.table(map)

// for (let i = 0; i < 100; i++) {
//     simulation(robots);
// }
const result = checkQuadrants();
console.log(result)
/*--------------------Part2-----------------------------------------*/


const draw = () => {
    const root = document.getElementById("root");
    if (root.firstChild) root.removeChild(root.firstChild)
    const newArr = [];
    for (let i = 0; i < m; i++) {
        const line = map[i].map(el => {
            if (el) return el
            else return ' '
        }).join("");
        newArr.push(line);
    }
    const picture = newArr.join('\n')

    const el = document.createElement("pre");
    el.innerText = picture;

    root.appendChild(el);
}

let counter = 0;

const moveRobots = () => {
    console.log(counter);
    simulation(robots);
    draw();
    const result = checkQuadrants();
    // console.log({result});
    counter++;
}

// const handlerTimeout = (e)=>{
//     let handler;
//     if (e.code === 'Enter') {
//         if (!handler) handler = setInterval(moveRobots, 1000);
//         else clearInterval(handler)
//
//     }
// }
// let handler = null;
// window.addEventListener('keydown', (e) => {
//
//     if (e.code === 'Enter') {
//         console.log(handler);
//         if (!handler) {
//             handler = setInterval(moveRobots, 100);
//         } else {
//             clearInterval(handler)
//             handler = null
//         }
//
//     }
//
// })

const button = document.getElementById("button");
button.addEventListener("click", (e) => {
    e.preventDefault();
    moveRobots();
})
for (let i = 0; i < 7344; i++){
    simulation(robots);
}
const result2 = checkQuadrants();
console.log(result2)
window.onload = draw
