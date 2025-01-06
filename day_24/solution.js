import {input} from "./input.js";
import {test2, test3, testInput} from "./test.js";
import * as fs from "node:fs";

const inputSwitch = input;

const opDict = {
    'XOR': (a, b) => a ^ b,
    'OR': (a, b) => a | b,
    'AND': (a, b) => a & b,
}

const init = () => {
    const [inputValues, gateValues] = inputSwitch.split('\n\n');

    const values = {};
    inputValues.split('\n').forEach(line => {
        const [key, value] = line.split(': ');
        values[key] = value;
    })

    const gates = gateValues.split('\n');

    return {values, gates}
}

const getResult = (values, gates) => {
    const gatesQueue = [...gates];


    let k = 0;
    while (gatesQueue.length) {
        k = k % gatesQueue.length;
        // console.log({k, length: gatesQueue.length})
        const gate = gatesQueue[k];
        const [conditions, output] = gate.split(' -> ');
        const [left, op, right] = conditions.split(' ');
        if (left in values && right in values) {
            values[output] = opDict[op](values[left], values[right]);
            gatesQueue.splice(k, 1);
        } else {
            k++
        }
    }


    const binaryResult = gates.map(el => {
        const [_, output] = el.split(' -> ');
        return output;
    }).filter(el => el.startsWith('z')).sort().map((el) => values[el]).reverse().join('');


    return {binaryResult, decResult: parseInt(binaryResult, 2)};
}

const {values, gates} = init();

const {binaryResult, decResult} = getResult(JSON.parse(JSON.stringify(values)), gates);
console.log({decResult, binaryResult})

/*--------------------Part2-----------------------------------------*/
// console.log({values})
const getInitialNumber = () => {
    let x = '';
    let y = '';
    const xKeys = Object.keys(values).filter(key => key.startsWith('x'));

    xKeys.sort().reverse().forEach((key) => {
        x += values[key]
    })

    const yKeys = Object.keys(values).filter(key => key.startsWith('y'));
    yKeys.sort().reverse().forEach((key) => {
        y += values[key]
    });

    return {x, decX: parseInt(x, 2), y, decY: parseInt(y, 2)};
}

const {x, decX, y, decY} = getInitialNumber();
console.log({x, decX, y, decY, sum: decX + decY});
console.log({binaryResult, theory: (decX + decY).toString(2)})

const getDigraph = () => {

    const theory = (decX + decY).toString(2).split('').reverse().join('');
    const fact = binaryResult.split('').reverse().join('');
    const brokenBits = {};

    for (let i = 0; i < theory.length; i++) {
        if (theory[i] !== fact[i]) {
            const num = i > 9 ? 'z' + String(i) : 'z' + '0' + String(i);
            brokenBits[num] = true;
        }
    }

    let gates_xor = [];
    let gates_and = [];
    let gates_or = [];

    const graph = gates.reduce((acc, el) => {
        const [conditions, output] = el.split(' -> ');
        const [left, op, right] = conditions.split(' ');
        acc += `${left} -> ${output}; \n`;
        acc += `${right} -> ${output}; \n`;

        if (op === 'XOR') {
            gates_xor.push(output);
        }
        if (op === 'AND') {
            gates_and.push(output);
        }
        if (op === 'OR') {
            gates_or.push(output);
        }
        return acc
    }, '');

    const xs = Array.from(Array(45)).map((_, idx) => `x${idx > 9 ? idx : '0' + idx}`).join(' -> ');
    const ys = Array.from(Array(45)).map((_, idx) => `y${idx > 9 ? idx : '0' + idx}`).join(' -> ');
    const zs = Array.from(Array(46)).map((_, idx) => `z${idx > 9 ? idx : '0' + idx}`).join(' -> ');

    const input_x = `  subgraph input_x {
    node [style=filled,color=lightgrey];
    ${xs}
  }`;
    const input_y = `  subgraph input_y {
    node [style=filled,color=lightgrey];
    ${ys}
  }`;
    const output_z = `  subgraph output_z {
    ${zs}
  }`;
    const broken_subgraph = `  subgraph broken_z {
    node [style=filled,color=red];
    ${Object.keys(brokenBits).join(';')}
  }`;
    const gates_xor_subgraph = `  subgraph gates_xor {
    node [style=filled,color=lightblue];
    ${gates_xor.join(';')}
  }`;
    const gates_or_subgraph = `  subgraph gates_or {
    node [style=filled,color=yellow];
    ${gates_or.join(';')}
  }`;
    const gates_and_subgraph = `  subgraph gates_and {
    node [style=filled,color=lightgreen];
    ${gates_and.join(';')}
  }`;

    fs.writeFileSync('graph',
        input_x + '\n' +
        input_y + '\n' +
        broken_subgraph + '\n' +
        gates_xor_subgraph + '\n' +
        gates_or_subgraph + '\n' +
        gates_and_subgraph + '\n' +
        output_z + '\n\n' +
        graph
    );

    return graph
}
getDigraph();

/*
https://dreampuf.github.io/GraphvizOnline/?engine=dot#digraph%20G%20%7B%0A%20%20subgraph%20input_x%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dlightgrey%5D%3B%0A%20%20%20%20x00%20-%3E%20x01%20-%3E%20x02%20-%3E%20x03%20-%3E%20x04%20-%3E%20x05%20-%3E%20x06%20-%3E%20x07%20-%3E%20x08%20-%3E%20x09%20-%3E%20x10%20-%3E%20x11%20-%3E%20x12%20-%3E%20x13%20-%3E%20x14%20-%3E%20x15%20-%3E%20x16%20-%3E%20x17%20-%3E%20x18%20-%3E%20x19%20-%3E%20x20%20-%3E%20x21%20-%3E%20x22%20-%3E%20x23%20-%3E%20x24%20-%3E%20x25%20-%3E%20x26%20-%3E%20x27%20-%3E%20x28%20-%3E%20x29%20-%3E%20x30%20-%3E%20x31%20-%3E%20x32%20-%3E%20x33%20-%3E%20x34%20-%3E%20x35%20-%3E%20x36%20-%3E%20x37%20-%3E%20x38%20-%3E%20x39%20-%3E%20x40%20-%3E%20x41%20-%3E%20x42%20-%3E%20x43%20-%3E%20x44%0A%20%20%7D%0A%20%20subgraph%20input_y%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dlightgrey%5D%3B%0A%20%20%20%20y00%20-%3E%20y01%20-%3E%20y02%20-%3E%20y03%20-%3E%20y04%20-%3E%20y05%20-%3E%20y06%20-%3E%20y07%20-%3E%20y08%20-%3E%20y09%20-%3E%20y10%20-%3E%20y11%20-%3E%20y12%20-%3E%20y13%20-%3E%20y14%20-%3E%20y15%20-%3E%20y16%20-%3E%20y17%20-%3E%20y18%20-%3E%20y19%20-%3E%20y20%20-%3E%20y21%20-%3E%20y22%20-%3E%20y23%20-%3E%20y24%20-%3E%20y25%20-%3E%20y26%20-%3E%20y27%20-%3E%20y28%20-%3E%20y29%20-%3E%20y30%20-%3E%20y31%20-%3E%20y32%20-%3E%20y33%20-%3E%20y34%20-%3E%20y35%20-%3E%20y36%20-%3E%20y37%20-%3E%20y38%20-%3E%20y39%20-%3E%20y40%20-%3E%20y41%20-%3E%20y42%20-%3E%20y43%20-%3E%20y44%0A%20%20%7D%0A%20%20subgraph%20broken_z%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dred%5D%3B%0A%20%20%20%20%0A%20%20%7D%0A%20%20subgraph%20gates_xor%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dlightblue%5D%3B%0A%20%20%20%20fkk%3Bz11%3Bz15%3Bmtg%3Bz14%3Bfgn%3Bz09%3Bbvs%3Bz07%3Bz41%3Bths%3Bz08%3Bbkk%3Bpwn%3Bz38%3Bjdh%3Bz25%3Bz20%3Bdfh%3Bdjn%3Bmfw%3Bz44%3Bwsk%3Bz21%3Bqdh%3Bbvt%3Bwgk%3Bvqr%3Bz23%3Bftv%3Bz10%3Btpb%3Bz40%3Bhnr%3Bfqf%3Bz12%3Bz30%3Brfc%3Bgcg%3Bmtq%3Bqcq%3Bz37%3Bz43%3Bz39%3Bwpp%3Bz05%3Bz02%3Bbkt%3Brqm%3Bz29%3Bz22%3Bfps%3Bz27%3Bz19%3Bnfs%3Bz01%3Bz00%3Bz24%3Bkgf%3Bnsr%3Bpnd%3Bfdv%3Bqtf%3Bvvd%3Bjbs%3Bz31%3Bz18%3Bz16%3Bsvn%3Bz33%3Bz13%3Bz35%3Btwn%3Bz04%3Bz17%3Bz28%3Bvft%3Bkqm%3Bfcm%3Bz26%3Bz36%3Brjd%3Bz32%3Bz42%3Bpjd%3Bz34%3Bz06%3Bz03%3Bwbp%0A%20%20%7D%0A%20%20subgraph%20gates_or%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dyellow%5D%3B%0A%20%20%20%20fkb%3Bvpn%3Bdpb%3Bhth%3Bkwr%3Bsmr%3Bmjw%3Bpth%3Bvbn%3Bphr%3Bsjd%3Bgsd%3Bksc%3Bchk%3Bfkt%3Bkvm%3Bvbw%3Bddt%3Bmvw%3Bftq%3Bnjm%3Bpjs%3Bz45%3Bsjs%3Brnt%3Brsj%3Btgm%3Bfdr%3Bpgm%3Bvjf%3Bvms%3Bmwj%3Bqbw%3Bkbf%3Bfvr%3Bjth%3Bkdf%3Bswg%3Bsbb%3Bgvm%3Bkbs%3Bvsb%3Bvbt%3Bdmp%0A%20%20%7D%0A%20%20subgraph%20gates_and%20%7B%0A%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dlightgreen%5D%3B%0A%20%20%20%20bjv%3Bpkr%3Bmtn%3Bqqp%3Btpt%3Bcfn%3Brfg%3Bprf%3Bdsc%3Bfmg%3Bngh%3Btmh%3Bpbg%3Bjsf%3Bdqb%3Brdt%3Bwfs%3Bdkd%3Bsqk%3Btjr%3Bnwq%3Bfdn%3Brnh%3Brgk%3Bffp%3Brpp%3Bvcd%3Bhtp%3Btpw%3Bvnj%3Bmqr%3Bdbp%3Bmbk%3Brfr%3Bqfg%3Bhgs%3Bwdv%3Bgsq%3Bvwc%3Bjvq%3Bwmv%3Bdnq%3Bbpw%3Bnhj%3Bprv%3Bqnd%3Bckj%3Bpkt%3Bcgd%3Bndk%3Bjqp%3Bjmf%3Bsqp%3Bwcn%3Bwkd%3Bvnn%3Bhnq%3Bdhv%3Bdcr%3Bggk%3Brhm%3Bhvw%3Bjpj%3Bbtn%3Bvgc%3Btvj%3Brqt%3Brcq%3Bvpq%3Brth%3Bjwh%3Bjwp%3Bgnr%3Brgn%3Bshb%3Bckn%3Bfrt%3Bcdk%3Bjfb%3Bppf%3Bjwg%3Bnpq%3Bdbw%3Bjdk%3Bdcf%3Bqtv%3Bdvh%3Bmbd%3Bktr%0A%20%20%7D%0A%20%20subgraph%20output_z%20%7B%0A%20%20%20%20z00%20-%3E%20z01%20-%3E%20z02%20-%3E%20z03%20-%3E%20z04%20-%3E%20z05%20-%3E%20z06%20-%3E%20z07%20-%3E%20z08%20-%3E%20z09%20-%3E%20z10%20-%3E%20z11%20-%3E%20z12%20-%3E%20z13%20-%3E%20z14%20-%3E%20z15%20-%3E%20z16%20-%3E%20z17%20-%3E%20z18%20-%3E%20z19%20-%3E%20z20%20-%3E%20z21%20-%3E%20z22%20-%3E%20z23%20-%3E%20z24%20-%3E%20z25%20-%3E%20z26%20-%3E%20z27%20-%3E%20z28%20-%3E%20z29%20-%3E%20z30%20-%3E%20z31%20-%3E%20z32%20-%3E%20z33%20-%3E%20z34%20-%3E%20z35%20-%3E%20z36%20-%3E%20z37%20-%3E%20z38%20-%3E%20z39%20-%3E%20z40%20-%3E%20z41%20-%3E%20z42%20-%3E%20z43%20-%3E%20z44%20-%3E%20z45%0A%20%20%7D%0A%0Amjw%20-%3E%20bjv%3B%20%0Abvt%20-%3E%20bjv%3B%20%0Ay41%20-%3E%20fkk%3B%20%0Ax41%20-%3E%20fkk%3B%20%0Atgm%20-%3E%20pkr%3B%20%0Aqtf%20-%3E%20pkr%3B%20%0Agcg%20-%3E%20z11%3B%20%0Amwj%20-%3E%20z11%3B%20%0Apth%20-%3E%20mtn%3B%20%0Adjn%20-%3E%20mtn%3B%20%0Aqbw%20-%3E%20z15%3B%20%0Afqf%20-%3E%20z15%3B%20%0Atjr%20-%3E%20fkb%3B%20%0Ahgs%20-%3E%20fkb%3B%20%0Ay10%20-%3E%20mtg%3B%20%0Ax10%20-%3E%20mtg%3B%20%0Aths%20-%3E%20z14%3B%20%0Akwr%20-%3E%20z14%3B%20%0Ax18%20-%3E%20fgn%3B%20%0Ay18%20-%3E%20fgn%3B%20%0Akwr%20-%3E%20qqp%3B%20%0Aths%20-%3E%20qqp%3B%20%0Ajpj%20-%3E%20vpn%3B%20%0Aggk%20-%3E%20vpn%3B%20%0Apnd%20-%3E%20z09%3B%20%0Asbb%20-%3E%20z09%3B%20%0Ax32%20-%3E%20bvs%3B%20%0Ay32%20-%3E%20bvs%3B%20%0Atwn%20-%3E%20z07%3B%20%0Anjm%20-%3E%20z07%3B%20%0Ay18%20-%3E%20tpt%3B%20%0Ax18%20-%3E%20tpt%3B%20%0Agvm%20-%3E%20z41%3B%20%0Afkk%20-%3E%20z41%3B%20%0Apjs%20-%3E%20cfn%3B%20%0Avvd%20-%3E%20cfn%3B%20%0Ax00%20-%3E%20rfg%3B%20%0Ay00%20-%3E%20rfg%3B%20%0Ay14%20-%3E%20prf%3B%20%0Ax14%20-%3E%20prf%3B%20%0Ay14%20-%3E%20ths%3B%20%0Ax14%20-%3E%20ths%3B%20%0Appf%20-%3E%20dpb%3B%20%0Ajmf%20-%3E%20dpb%3B%20%0Ax35%20-%3E%20dsc%3B%20%0Ay35%20-%3E%20dsc%3B%20%0Asvn%20-%3E%20fmg%3B%20%0Avsb%20-%3E%20fmg%3B%20%0Ay38%20-%3E%20ngh%3B%20%0Ax38%20-%3E%20ngh%3B%20%0Ax44%20-%3E%20tmh%3B%20%0Ay44%20-%3E%20tmh%3B%20%0Avvd%20-%3E%20z08%3B%20%0Apjs%20-%3E%20z08%3B%20%0Ax37%20-%3E%20bkk%3B%20%0Ay37%20-%3E%20bkk%3B%20%0Ay19%20-%3E%20pwn%3B%20%0Ax19%20-%3E%20pwn%3B%20%0Afmg%20-%3E%20hth%3B%20%0Arcq%20-%3E%20hth%3B%20%0Avft%20-%3E%20z38%3B%20%0Avbn%20-%3E%20z38%3B%20%0Ax42%20-%3E%20jdh%3B%20%0Ay42%20-%3E%20jdh%3B%20%0Anhj%20-%3E%20kwr%3B%20%0Anwq%20-%3E%20kwr%3B%20%0Addt%20-%3E%20z25%3B%20%0Arjd%20-%3E%20z25%3B%20%0Avpn%20-%3E%20pbg%3B%20%0Amtg%20-%3E%20pbg%3B%20%0Ax42%20-%3E%20jsf%3B%20%0Ay42%20-%3E%20jsf%3B%20%0Asmr%20-%3E%20z20%3B%20%0Abkt%20-%3E%20z20%3B%20%0Ay27%20-%3E%20dfh%3B%20%0Ax27%20-%3E%20dfh%3B%20%0Achk%20-%3E%20dqb%3B%20%0Apjd%20-%3E%20dqb%3B%20%0Awcn%20-%3E%20smr%3B%20%0Asqk%20-%3E%20smr%3B%20%0Ajdk%20-%3E%20mjw%3B%20%0Arpp%20-%3E%20mjw%3B%20%0Ax43%20-%3E%20djn%3B%20%0Ay43%20-%3E%20djn%3B%20%0Ay23%20-%3E%20rdt%3B%20%0Ax23%20-%3E%20rdt%3B%20%0Ax16%20-%3E%20wfs%3B%20%0Ay16%20-%3E%20wfs%3B%20%0Ajfb%20-%3E%20pth%3B%20%0Ajsf%20-%3E%20pth%3B%20%0Aksc%20-%3E%20dkd%3B%20%0Ajbs%20-%3E%20dkd%3B%20%0Ay29%20-%3E%20mfw%3B%20%0Ax29%20-%3E%20mfw%3B%20%0Asjs%20-%3E%20z44%3B%20%0Aqcq%20-%3E%20z44%3B%20%0Ay33%20-%3E%20wsk%3B%20%0Ax33%20-%3E%20wsk%3B%20%0Ajbs%20-%3E%20z21%3B%20%0Aksc%20-%3E%20z21%3B%20%0Ay17%20-%3E%20qdh%3B%20%0Ax17%20-%3E%20qdh%3B%20%0Akbs%20-%3E%20sqk%3B%20%0Apwn%20-%3E%20sqk%3B%20%0Ay41%20-%3E%20tjr%3B%20%0Ax41%20-%3E%20tjr%3B%20%0Affp%20-%3E%20vbn%3B%20%0Ashb%20-%3E%20vbn%3B%20%0Ax40%20-%3E%20bvt%3B%20%0Ay40%20-%3E%20bvt%3B%20%0Ay05%20-%3E%20wgk%3B%20%0Ax05%20-%3E%20wgk%3B%20%0Afcm%20-%3E%20nwq%3B%20%0Aswg%20-%3E%20nwq%3B%20%0Ay39%20-%3E%20vqr%3B%20%0Ax39%20-%3E%20vqr%3B%20%0Asqp%20-%3E%20phr%3B%20%0Ambd%20-%3E%20phr%3B%20%0Apkt%20-%3E%20sjd%3B%20%0Ackj%20-%3E%20sjd%3B%20%0Afps%20-%3E%20fdn%3B%20%0Arfg%20-%3E%20fdn%3B%20%0Ax07%20-%3E%20rnh%3B%20%0Ay07%20-%3E%20rnh%3B%20%0Ansr%20-%3E%20z23%3B%20%0Agsd%20-%3E%20z23%3B%20%0Ax16%20-%3E%20ftv%3B%20%0Ay16%20-%3E%20ftv%3B%20%0Asjd%20-%3E%20rgk%3B%20%0Aftv%20-%3E%20rgk%3B%20%0Ax37%20-%3E%20ffp%3B%20%0Ay37%20-%3E%20ffp%3B%20%0Avpn%20-%3E%20z10%3B%20%0Amtg%20-%3E%20z10%3B%20%0Avbt%20-%3E%20rpp%3B%20%0Avqr%20-%3E%20rpp%3B%20%0Ax43%20-%3E%20vcd%3B%20%0Ay43%20-%3E%20vcd%3B%20%0Ahnr%20-%3E%20htp%3B%20%0Akdf%20-%3E%20htp%3B%20%0Ax26%20-%3E%20tpw%3B%20%0Ay26%20-%3E%20tpw%3B%20%0Adqb%20-%3E%20gsd%3B%20%0Adhv%20-%3E%20gsd%3B%20%0Awbp%20-%3E%20vnj%3B%20%0Avbw%20-%3E%20vnj%3B%20%0Ay26%20-%3E%20tpb%3B%20%0Ax26%20-%3E%20tpb%3B%20%0Afgn%20-%3E%20mqr%3B%20%0Aphr%20-%3E%20mqr%3B%20%0Ay06%20-%3E%20dbp%3B%20%0Ax06%20-%3E%20dbp%3B%20%0Avgc%20-%3E%20ksc%3B%20%0Avpq%20-%3E%20ksc%3B%20%0Amjw%20-%3E%20z40%3B%20%0Abvt%20-%3E%20z40%3B%20%0Arhm%20-%3E%20chk%3B%20%0Adkd%20-%3E%20chk%3B%20%0Ay24%20-%3E%20hnr%3B%20%0Ax24%20-%3E%20hnr%3B%20%0Advh%20-%3E%20fkt%3B%20%0Adnq%20-%3E%20fkt%3B%20%0Acdk%20-%3E%20kvm%3B%20%0Agsq%20-%3E%20kvm%3B%20%0Ax15%20-%3E%20fqf%3B%20%0Ay15%20-%3E%20fqf%3B%20%0Ay40%20-%3E%20mbk%3B%20%0Ax40%20-%3E%20mbk%3B%20%0Aqfg%20-%3E%20vbw%3B%20%0Avwc%20-%3E%20vbw%3B%20%0Amtq%20-%3E%20z12%3B%20%0Akvm%20-%3E%20z12%3B%20%0Avbn%20-%3E%20rfr%3B%20%0Avft%20-%3E%20rfr%3B%20%0Ahth%20-%3E%20qfg%3B%20%0Amfw%20-%3E%20qfg%3B%20%0Afkk%20-%3E%20hgs%3B%20%0Agvm%20-%3E%20hgs%3B%20%0Avjf%20-%3E%20wdv%3B%20%0Afdv%20-%3E%20wdv%3B%20%0Agcg%20-%3E%20gsq%3B%20%0Amwj%20-%3E%20gsq%3B%20%0Ay29%20-%3E%20vwc%3B%20%0Ax29%20-%3E%20vwc%3B%20%0Awbp%20-%3E%20z30%3B%20%0Avbw%20-%3E%20z30%3B%20%0Ajvq%20-%3E%20ddt%3B%20%0Ahtp%20-%3E%20ddt%3B%20%0Ay24%20-%3E%20jvq%3B%20%0Ax24%20-%3E%20jvq%3B%20%0Akgf%20-%3E%20wmv%3B%20%0Aftq%20-%3E%20wmv%3B%20%0Ax35%20-%3E%20rfc%3B%20%0Ay35%20-%3E%20rfc%3B%20%0Afdn%20-%3E%20mvw%3B%20%0Ahnq%20-%3E%20mvw%3B%20%0Ay11%20-%3E%20gcg%3B%20%0Ax11%20-%3E%20gcg%3B%20%0Ax25%20-%3E%20dnq%3B%20%0Ay25%20-%3E%20dnq%3B%20%0Ay12%20-%3E%20mtq%3B%20%0Ax12%20-%3E%20mtq%3B%20%0Ay44%20-%3E%20qcq%3B%20%0Ax44%20-%3E%20qcq%3B%20%0Adsc%20-%3E%20ftq%3B%20%0Aprv%20-%3E%20ftq%3B%20%0Awsk%20-%3E%20bpw%3B%20%0Avms%20-%3E%20bpw%3B%20%0Arsj%20-%3E%20z37%3B%20%0Abkk%20-%3E%20z37%3B%20%0Adjn%20-%3E%20z43%3B%20%0Apth%20-%3E%20z43%3B%20%0Awdv%20-%3E%20njm%3B%20%0Adbp%20-%3E%20njm%3B%20%0Argn%20-%3E%20pjs%3B%20%0Arnh%20-%3E%20pjs%3B%20%0Avqr%20-%3E%20z39%3B%20%0Avbt%20-%3E%20z39%3B%20%0Ay34%20-%3E%20wpp%3B%20%0Ax34%20-%3E%20wpp%3B%20%0Ay13%20-%3E%20nhj%3B%20%0Ax13%20-%3E%20nhj%3B%20%0Arnt%20-%3E%20prv%3B%20%0Arfc%20-%3E%20prv%3B%20%0Adpb%20-%3E%20z05%3B%20%0Awgk%20-%3E%20z05%3B%20%0Ajwh%20-%3E%20z45%3B%20%0Atmh%20-%3E%20z45%3B%20%0Anfs%20-%3E%20z02%3B%20%0Amvw%20-%3E%20z02%3B%20%0Adfh%20-%3E%20qnd%3B%20%0Afvr%20-%3E%20qnd%3B%20%0Ax15%20-%3E%20ckj%3B%20%0Ay15%20-%3E%20ckj%3B%20%0Ax20%20-%3E%20bkt%3B%20%0Ay20%20-%3E%20bkt%3B%20%0Avcd%20-%3E%20sjs%3B%20%0Amtn%20-%3E%20sjs%3B%20%0Ay04%20-%3E%20rqm%3B%20%0Ax04%20-%3E%20rqm%3B%20%0Amfw%20-%3E%20z29%3B%20%0Ahth%20-%3E%20z29%3B%20%0Aqbw%20-%3E%20pkt%3B%20%0Afqf%20-%3E%20pkt%3B%20%0Ay34%20-%3E%20cgd%3B%20%0Ax34%20-%3E%20cgd%3B%20%0Apjd%20-%3E%20z22%3B%20%0Achk%20-%3E%20z22%3B%20%0Ay01%20-%3E%20fps%3B%20%0Ax01%20-%3E%20fps%3B%20%0Ay08%20-%3E%20ndk%3B%20%0Ax08%20-%3E%20ndk%3B%20%0Abtn%20-%3E%20rnt%3B%20%0Acgd%20-%3E%20rnt%3B%20%0Amvw%20-%3E%20jqp%3B%20%0Anfs%20-%3E%20jqp%3B%20%0Apgm%20-%3E%20jmf%3B%20%0Arqm%20-%3E%20jmf%3B%20%0Adfh%20-%3E%20z27%3B%20%0Afvr%20-%3E%20z27%3B%20%0Akbf%20-%3E%20sqp%3B%20%0Aqdh%20-%3E%20sqp%3B%20%0Apwn%20-%3E%20z19%3B%20%0Akbs%20-%3E%20z19%3B%20%0Ax02%20-%3E%20nfs%3B%20%0Ay02%20-%3E%20nfs%3B%20%0Arth%20-%3E%20rsj%3B%20%0Awmv%20-%3E%20rsj%3B%20%0Ajqp%20-%3E%20tgm%3B%20%0Ahvw%20-%3E%20tgm%3B%20%0Afps%20-%3E%20z01%3B%20%0Arfg%20-%3E%20z01%3B%20%0Ay19%20-%3E%20wcn%3B%20%0Ax19%20-%3E%20wcn%3B%20%0Ax10%20-%3E%20wkd%3B%20%0Ay10%20-%3E%20wkd%3B%20%0Ax00%20-%3E%20z00%3B%20%0Ay00%20-%3E%20z00%3B%20%0Akqm%20-%3E%20vnn%3B%20%0Admp%20-%3E%20vnn%3B%20%0Ahnr%20-%3E%20z24%3B%20%0Akdf%20-%3E%20z24%3B%20%0Ax01%20-%3E%20hnq%3B%20%0Ay01%20-%3E%20hnq%3B%20%0Ax22%20-%3E%20dhv%3B%20%0Ay22%20-%3E%20dhv%3B%20%0Ay36%20-%3E%20kgf%3B%20%0Ax36%20-%3E%20kgf%3B%20%0Ay27%20-%3E%20dcr%3B%20%0Ax27%20-%3E%20dcr%3B%20%0Ax09%20-%3E%20ggk%3B%20%0Ay09%20-%3E%20ggk%3B%20%0Ay23%20-%3E%20nsr%3B%20%0Ax23%20-%3E%20nsr%3B%20%0Aktr%20-%3E%20fdr%3B%20%0Abpw%20-%3E%20fdr%3B%20%0Ax21%20-%3E%20rhm%3B%20%0Ay21%20-%3E%20rhm%3B%20%0Adcf%20-%3E%20pgm%3B%20%0Apkr%20-%3E%20pgm%3B%20%0Ax09%20-%3E%20pnd%3B%20%0Ay09%20-%3E%20pnd%3B%20%0Ax06%20-%3E%20fdv%3B%20%0Ay06%20-%3E%20fdv%3B%20%0Afrt%20-%3E%20vjf%3B%20%0Ajwp%20-%3E%20vjf%3B%20%0Ax03%20-%3E%20qtf%3B%20%0Ay03%20-%3E%20qtf%3B%20%0Ax08%20-%3E%20vvd%3B%20%0Ay08%20-%3E%20vvd%3B%20%0Ax02%20-%3E%20hvw%3B%20%0Ay02%20-%3E%20hvw%3B%20%0Ay21%20-%3E%20jbs%3B%20%0Ax21%20-%3E%20jbs%3B%20%0Akqm%20-%3E%20z31%3B%20%0Admp%20-%3E%20z31%3B%20%0Anpq%20-%3E%20vms%3B%20%0Ackn%20-%3E%20vms%3B%20%0Apnd%20-%3E%20jpj%3B%20%0Asbb%20-%3E%20jpj%3B%20%0Aphr%20-%3E%20z18%3B%20%0Afgn%20-%3E%20z18%3B%20%0Asjd%20-%3E%20z16%3B%20%0Aftv%20-%3E%20z16%3B%20%0Awkd%20-%3E%20mwj%3B%20%0Apbg%20-%3E%20mwj%3B%20%0Awpp%20-%3E%20btn%3B%20%0Afdr%20-%3E%20btn%3B%20%0Abkt%20-%3E%20vgc%3B%20%0Asmr%20-%3E%20vgc%3B%20%0Ax30%20-%3E%20tvj%3B%20%0Ay30%20-%3E%20tvj%3B%20%0Ax28%20-%3E%20svn%3B%20%0Ay28%20-%3E%20svn%3B%20%0Avms%20-%3E%20z33%3B%20%0Awsk%20-%3E%20z33%3B%20%0Aswg%20-%3E%20z13%3B%20%0Afcm%20-%3E%20z13%3B%20%0Aprf%20-%3E%20qbw%3B%20%0Aqqp%20-%3E%20qbw%3B%20%0Argk%20-%3E%20kbf%3B%20%0Awfs%20-%3E%20kbf%3B%20%0Ansr%20-%3E%20rqt%3B%20%0Agsd%20-%3E%20rqt%3B%20%0Ax28%20-%3E%20rcq%3B%20%0Ay28%20-%3E%20rcq%3B%20%0Ax20%20-%3E%20vpq%3B%20%0Ay20%20-%3E%20vpq%3B%20%0Adbw%20-%3E%20fvr%3B%20%0Atpw%20-%3E%20fvr%3B%20%0Arnt%20-%3E%20z35%3B%20%0Arfc%20-%3E%20z35%3B%20%0Ax36%20-%3E%20rth%3B%20%0Ay36%20-%3E%20rth%3B%20%0Avnn%20-%3E%20jth%3B%20%0Ajwg%20-%3E%20jth%3B%20%0Asjs%20-%3E%20jwh%3B%20%0Aqcq%20-%3E%20jwh%3B%20%0Ax07%20-%3E%20twn%3B%20%0Ay07%20-%3E%20twn%3B%20%0Adpb%20-%3E%20jwp%3B%20%0Awgk%20-%3E%20jwp%3B%20%0Arqt%20-%3E%20kdf%3B%20%0Ardt%20-%3E%20kdf%3B%20%0Agnr%20-%3E%20swg%3B%20%0Aqtv%20-%3E%20swg%3B%20%0Arqm%20-%3E%20z04%3B%20%0Apgm%20-%3E%20z04%3B%20%0Ax12%20-%3E%20gnr%3B%20%0Ay12%20-%3E%20gnr%3B%20%0Anjm%20-%3E%20rgn%3B%20%0Atwn%20-%3E%20rgn%3B%20%0Arsj%20-%3E%20shb%3B%20%0Abkk%20-%3E%20shb%3B%20%0Ax32%20-%3E%20ckn%3B%20%0Ay32%20-%3E%20ckn%3B%20%0Aqdh%20-%3E%20z17%3B%20%0Akbf%20-%3E%20z17%3B%20%0Ax05%20-%3E%20frt%3B%20%0Ay05%20-%3E%20frt%3B%20%0Avsb%20-%3E%20z28%3B%20%0Asvn%20-%3E%20z28%3B%20%0Ax38%20-%3E%20vft%3B%20%0Ay38%20-%3E%20vft%3B%20%0Ay11%20-%3E%20cdk%3B%20%0Ax11%20-%3E%20cdk%3B%20%0Afkb%20-%3E%20jfb%3B%20%0Ajdh%20-%3E%20jfb%3B%20%0Ax31%20-%3E%20kqm%3B%20%0Ay31%20-%3E%20kqm%3B%20%0Ay13%20-%3E%20fcm%3B%20%0Ax13%20-%3E%20fcm%3B%20%0Acfn%20-%3E%20sbb%3B%20%0Andk%20-%3E%20sbb%3B%20%0Ax04%20-%3E%20ppf%3B%20%0Ay04%20-%3E%20ppf%3B%20%0Ax31%20-%3E%20jwg%3B%20%0Ay31%20-%3E%20jwg%3B%20%0Afkt%20-%3E%20z26%3B%20%0Atpb%20-%3E%20z26%3B%20%0Ajth%20-%3E%20npq%3B%20%0Abvs%20-%3E%20npq%3B%20%0Akgf%20-%3E%20z36%3B%20%0Aftq%20-%3E%20z36%3B%20%0Ax25%20-%3E%20rjd%3B%20%0Ay25%20-%3E%20rjd%3B%20%0Abvs%20-%3E%20z32%3B%20%0Ajth%20-%3E%20z32%3B%20%0Afkt%20-%3E%20dbw%3B%20%0Atpb%20-%3E%20dbw%3B%20%0Abjv%20-%3E%20gvm%3B%20%0Ambk%20-%3E%20gvm%3B%20%0Ajdh%20-%3E%20z42%3B%20%0Afkb%20-%3E%20z42%3B%20%0Ay39%20-%3E%20jdk%3B%20%0Ax39%20-%3E%20jdk%3B%20%0Ax03%20-%3E%20dcf%3B%20%0Ay03%20-%3E%20dcf%3B%20%0Ay22%20-%3E%20pjd%3B%20%0Ax22%20-%3E%20pjd%3B%20%0Amqr%20-%3E%20kbs%3B%20%0Atpt%20-%3E%20kbs%3B%20%0Akvm%20-%3E%20qtv%3B%20%0Amtq%20-%3E%20qtv%3B%20%0Arjd%20-%3E%20dvh%3B%20%0Addt%20-%3E%20dvh%3B%20%0Afdr%20-%3E%20z34%3B%20%0Awpp%20-%3E%20z34%3B%20%0Ay17%20-%3E%20mbd%3B%20%0Ax17%20-%3E%20mbd%3B%20%0Ay33%20-%3E%20ktr%3B%20%0Ax33%20-%3E%20ktr%3B%20%0Aqnd%20-%3E%20vsb%3B%20%0Adcr%20-%3E%20vsb%3B%20%0Afdv%20-%3E%20z06%3B%20%0Avjf%20-%3E%20z06%3B%20%0Angh%20-%3E%20vbt%3B%20%0Arfr%20-%3E%20vbt%3B%20%0Atgm%20-%3E%20z03%3B%20%0Aqtf%20-%3E%20z03%3B%20%0Ay30%20-%3E%20wbp%3B%20%0Ax30%20-%3E%20wbp%3B%20%0Atvj%20-%3E%20dmp%3B%20%0Avnj%20-%3E%20dmp%3B%20%0A%0A%7D
 */
