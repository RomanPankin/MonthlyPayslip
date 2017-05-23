const stream = require('stream');

const Payslip = require('../src/payslip').Payslip;
const PayslipInputCSV = require('../src/readers/payslip-input-csv').PayslipInputCSV;
const PayslipOutputCSV = require('../src/writers/payslip-output-csv').PayslipOutputCSV;


const DAVID_RUDD_OUTPUT = {
    firstName : "David",
    lastName : "Rudd",
    annualSalary : 60050,
    superRate : 0.09,
    payPeriod : "01 March - 31 March",
    grossIncome : 5004,
    incomeTax : 922,
    netIncome : 4082,
    superIncome : 450
};

const RYAN_CHEN_OUTPUT = {
    firstName : "Ryan",
    lastName : "Chen",
    annualSalary : 120000,
    superRate : 0.1,
    payPeriod : "01 March - 31 March",
    grossIncome : 10000,
    incomeTax : 2696,
    netIncome : 7304,
    superIncome : 1000
};

describe('Tests for the Payslip class.', () => {
    it('David Rudd', () => {
        let input = {
            firstName : "David",
            lastName : "Rudd",
            annualSalary : 60050,
            superRate : 0.09,
            payPeriod : "01 March - 31 March"
        };

        expect(Payslip.calculate(input)).toEqual(DAVID_RUDD_OUTPUT);
    });

    it('Ryan Chen', () => {
        let input = {
            firstName : "Ryan",
            lastName : "Chen",
            annualSalary : 120000,
            superRate : 0.1,
            payPeriod : "01 March - 31 March"
        };

        expect(Payslip.calculate(input)).toEqual(RYAN_CHEN_OUTPUT);
    });
});

describe('Crash tests for the Payslip class.', () => {
    it('NULL-object', () => {
        expect(Payslip.calculate(null)).toEqual(null);
    });

    it('Empty object', () => {
        expect(Payslip.calculate({})).toEqual(null);
    });
});

describe('CSV input test - sample01.csv.', () => {
    const EXPECTED_DATA = [DAVID_RUDD_OUTPUT, RYAN_CHEN_OUTPUT];
    let receivedData = [];

    beforeEach(function(done) {
        new PayslipInputCSV(__dirname + '/../samples/input/sample01.csv')
            .pipe(new Payslip())
            .pipe(new stream.Transform({
                writableObjectMode: true,

                transform(data, encoding, callback) {
                    receivedData.push(data);
                    callback(null, "");
                }
            }))
            .on('error', (err) => {
                done();
            })
            .on('finish', () => {
                done();
            });
    });

    it('Check values', () => {
        expect(receivedData).toEqual(EXPECTED_DATA);
    });
});

describe('Wrong input file - sample01.xlsx.', () => {
    let errorSign = false;

    beforeEach(function(done) {
        new PayslipInputCSV(__dirname + '/../samples/input/sample01.xlsx')
            .on('error', (err) => {
                errorSign = true;
                done();
            })
            .on('finish', () => {
                errorSign = false;
                done();
            });
    });

    it('Should be exception', () => {
        expect(errorSign).toEqual(true);
    });
});