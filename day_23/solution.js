import {testInput} from "./test.js";
import {input} from "./input.js";

const inputSwitch = input;

const init = () => {
    const computers = {};
    inputSwitch.split('\n').forEach(line => {
        const [comp1, comp2] = line.split('-');

        if (!computers[comp1]) computers[comp1] = [];
        if (!computers[comp2]) computers[comp2] = [];

        computers[comp1].push(comp2);
        computers[comp2].push(comp1);
    })

    return computers
}
const getKey = (...computers) => {
    return computers.sort().join(',')
}

const countSubnetworks = (computers, key) => {
    const neighbours = computers[key];
    let result = 0;

    const cache = {};
    // console.log({neighbours})
    for (let i = 0; i < neighbours.length; i++) {
        for (let j = i + 1; j < neighbours.length; j++) {
            if (i === j) continue;
            const n1 = neighbours[i];
            const n2 = neighbours[j];
            const network = getKey(key, n1, n2);

            if (cache[key]) continue;
            if (computers[n1].includes(n2)) {
                cache[network] = [key, n1, n2];
                result++;
                // console.log({result})
            }
        }
    }
    return {cache, result};
}

const searchNetwork = (computers) => {
    const startsWithT = Object.keys(computers).filter(key => key.startsWith('t'));


    const uniqueNetworks = startsWithT.reduce((acc, curr) => {

        const {cache: newNetworks} = countSubnetworks(computers, curr)
        return {...acc, ...newNetworks};
    }, {});


    return Object.keys(uniqueNetworks).length
}

const computers = init();

const result1 = searchNetwork(computers);
console.log(result1)
/*--------------------Part2-----------------------------------------*/
const countLargest = (computers) => {
    let max = {};
    Object.keys(computers).forEach(comp => {
        const {cache} = countSubnetworks(computers, comp);

        if (Object.keys(max).length < Object.keys(cache).length) {
            max = cache;
        }
    })

    // console.log({max})

    return Array.from(new Set(Object.values(max).reduce((acc, vals) => {
        return [...acc, ...vals]

    }, []))).sort().join(',')
}
const result2 = countLargest(computers);
console.log(result2)
