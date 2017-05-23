/**
 * Module writes information about an employee's payslip to the screen
 */
const stream = require('stream');


/**
 * Writes information into the screen
 *
 * Input format:
 *      firstName, lastName, annualSalary, superRate, payPeriod,
 *      payPeriod, grossIncome, incomeTax, netIncome, superIncome
 */
class PayslipOutput extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(data, encoding, callback) {
        console.log(JSON.stringify(data));
        callback(null, data);
    }
}

module.exports = { PayslipOutput : PayslipOutput };