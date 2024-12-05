import {order, reports} from "./input.js";
import {testOrder, testReports} from "./test.js";


const orderMap = {}

order.split('\n').forEach(line => {
    const [first, second] = line.split('|');
    if (!orderMap[first]) orderMap[first] = [];
    orderMap[first].push(second);
})


Object.keys(orderMap).forEach(key => {
    orderMap[key] = orderMap[key].sort((a, b) => {
        return Number(a) - Number(b)
    })
})


const incorrectReports = [];

const correctReports = reports.split('\n').filter((line) => {
    const report = line.split(',');
    for (let i = 0; i < report.length - 1; i++) {
        const biggerNumbers = orderMap[report[i]]
        if (!biggerNumbers || !biggerNumbers.includes(report[i + 1])) {
            incorrectReports.push(line);
            return false;
        }
    }

    return true;
})
const result = correctReports.reduce((acc, line) => {
    const report = line.split(',');
    return acc + +report[Math.floor(report.length / 2)]
}, 0)

console.log(result)
/*--------------------Part2-----------------------------------------*/

const fixReport = (report) => {
    let broken = false;
    for (let i = 0; i < report.length - 1; i++) {
        const biggerNumbers = orderMap[report[i]]
        if (!biggerNumbers || !biggerNumbers.includes(report[i + 1])) {
            broken = true;
            const newI = report[i + 1];
            report[i + 1] = report[i];
            report[i] = newI;
        }
    }
    if (broken) return fixReport(report);
    else return report;
}

const result2 = incorrectReports.reduce((acc,line) => {
    const report = line.split(',');
    const fixedReport = fixReport(report);
    return acc + +fixedReport[Math.floor(fixedReport.length / 2)]
},0)

console.log(result2)