import {input} from "./input.js";
import {test2, testInput} from "./test.js";

const inputSwitch = input;

const init = () => {
    const registers = {A: 0, B: 0, C: 0}
    const [registersInput, program] = inputSwitch.split("\n\n");
    const values = registersInput.matchAll(/\d+/g);

    registers.A = +values.next().value[0];
    registers.B = +values.next().value[0];
    registers.C = +values.next().value[0];

    const operations = program.split(' ')[1].split(',');

    return {registers, operations};

}


const program = (registersInput, operations) => {

    const registers = {...registersInput};
    let pointer = 0;

    const result = []

    const getVal = (val) => {
        if (+val < 4) return +val;
        else if (val === '4') return registers.A;
        else if (val === '5') return registers.B;
        else if (val === '6') return registers.C;
        else return 0
    }

    /*division*/
    const adv = (val) => {
        const operand = getVal(val);
        registers.A = Math.trunc(registers.A / Math.pow(2, operand));
    }

    /*bitwise XOR*/
    const bxl = (val) => {
        registers.B = Number(BigInt(registers.B) ^ BigInt(val))
    }

    /*mod 8*/
    const bst = (val) => {
        const operand = getVal(val);
        registers.B = operand % 8
    }

    /*Jump not zero*/
    const jnz = (val) => {
        if (registers.A !== 0) {
            pointer = +val;
        } else {
            pointer += 2;
        }

    }

    /*The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.) */
    const bxc = (val) => {
        registers.B = Number(BigInt(registers.B) ^ BigInt(registers.C))
    }


    /*The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)*/
    const out = (val) => {
        const operand = getVal(val);
        result.push(operand % 8)
    }

    /*The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)*/
    const bdv = (val) => {
        const operand = getVal(val);
        registers.B = Math.trunc(registers.A / Math.pow(2, operand));
    }


    /*The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)*/
    const cdv = (val) => {
        const operand = getVal(val);
        registers.C = Math.trunc(registers.A / Math.pow(2, operand));
    }


    const opDict = {
        '0': adv,
        '1': bxl,
        '2': bst,
        '3': jnz,
        '4': bxc,
        '5': out,
        '6': bdv,
        '7': cdv,

    }

    while (pointer < operations.length) {

        const operation = operations[pointer];
        const operand = operations[pointer + 1];
        opDict[operation](operand);
        if (operation !== '3') pointer += 2;

    }

    return result.join(',');
}

const {registers, operations} = init();

const result = program(registers, operations);

console.log({result})


/*--------------------Part2-----------------------------------------*/


const checkA = (variants, answer) => {

    const newVariants = new Set();
    for (let i = 0; i < 8; i++) {
        if (!variants.length) {
            const result = program({A: i, B: 0, C: 0}, operations);
            if (result === answer) newVariants.add(i.toString(2))
        }
        Array.from(variants).forEach(variant => {

            const newVal = variant + i.toString(2).padStart(3, '0');
            const result = program({A: parseInt(newVal, 2), B: 0, C: 0}, operations);

            if (result === answer) newVariants.add(newVal)

        })
    }

    return newVariants;

}


const backtrack = (operations) => {

    let variations = [];
    [...operations].reduceRight((acc, operation) => {
        acc.push(operation);

        variations = checkA(variations, [...acc].reverse().join(','));
        return acc

    }, []);
    return Math.min(...Array.from(variations).map(el => parseInt(el, 2)))

}
const t1 = Date.now()


const result2 = backtrack(operations);
const t2 = Date.now()
console.log({result2}, t2 - t1)


