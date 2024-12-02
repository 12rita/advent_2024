import {input} from "./input.js";
import {testInput} from "./test.js";


let result = 0;
let result2 = 0;

/**
 * @param {string} a
 * @param {string} b
 * @return {1 | -1 | 0}
 */
const checkReportType = (a, b) => {
    const diff = Number(a) - Number(b);
    if (Math.abs(diff) > 3 || diff === 0) return 0;
    else if (diff < 0) return -1;
    return 1
}

/**
 * @param {string} a
 * @param {string} b
 * @param {number} type
 * @return {boolean}
 */
const checkReport = (a, b, type) => {
    const diff = Number(a) - Number(b);
    if (Math.abs(diff) > 3 || diff === 0) return false;
    else if (Math.sign(diff) !== type) return false;
    return true;
}

/**
 * @param {string[]} report
 * @param {1 | 0 |-1} type
 * @return {boolean}
 */
const countSafe = (report, type) => {
    if (type === 0) return false;
    for (let i = 1; i < report.length - 1; i++) {
        if (!checkReport(report[i], report[i + 1], type)) return false;
    }
    return true
}

/**
 * @param {string[]} report
 * @param {1 | 0 |-1} type
 * @return {boolean}
 */
const countDifferent = (report, type) => {
    if (countSafe(report, type)) {
        return true;
    }
    for (let i = 0; i < report.length; i++) {
        const newArr = report.toSpliced(i, 1);
        const newType = checkReportType(newArr[0], newArr[1]);
        if (countSafe(newArr, newType)) {
            return true;
        }
    }
    return false;
}

input.split('\n').forEach(line => {
    const report = line.split(' ');
    const type = checkReportType(report[0], report[1]);

    if (countSafe(report, type)) result++;
/*--------------------Part2-----------------------------------------*/
    if (countDifferent(report, type)) result2++;

})

console.log(result2);



