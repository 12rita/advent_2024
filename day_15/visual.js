import {test2, testInput} from "./test.js";
import {input} from "./input.js";
import {countGPS2, init2, simulation2} from "./solution.js";

const inputSwitch = testInput;


const {map: map2, robot: robot2, moves} = init2(inputSwitch);

const draw = (map) => {
    const root = document.getElementById("root");
    if (root.firstChild) root.removeChild(root.firstChild)

    const picture = map.map(el => el.join('')).join('\n');

    const el = document.createElement("pre");
    el.innerText = picture;

    root.appendChild(el);
}


const moveRobots = () => {
    const stack = [...moves];
    let map = map2;
    let robot = robot2;
    return () => {
        const move = stack.shift();
        if (!move) {
            console.log('Finish')
            return;
        }
        console.log({move}, `left:${stack.length}`);
        const {map: newMap, robot: newRobot} = simulation2({map, robot, move});
        map = newMap;
        robot = newRobot;
        draw(newMap);
    }

}

const drawIteration = (map, robot, moves, iteration) => {
    let localMap = map;
    let localRobot = robot;
    moves.slice(0, iteration).forEach(move => {
        const {map: newMap, robot: newRobot} = simulation2({map: localMap, robot: localRobot, move});
        localMap = newMap;
        localRobot = newRobot;
    });
    // console.table(localMap.map(el => el.join('')).join('\n'));

    draw(localMap);
    const result = countGPS2(localMap);
    console.log('Success', moves.length, result)
}


const button = document.getElementById("button");
const move = moveRobots();

const inputButton = document.getElementById("input-button");
inputButton.addEventListener("click", (e) => {
    e.preventDefault();
    const iteration = document.getElementById("input").value;
    drawIteration(map2, robot2, moves, iteration);
})

button.addEventListener("click", (e) => {
    e.preventDefault();
    move();
})

window.onload = () => {
    draw(map2);
    console.log(moves.length)
}
