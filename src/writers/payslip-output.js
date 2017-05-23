/**
 * Module writes information about an employee's payslip to the screen
 */
const stringify = require('csv-stringify');
const stream = require('stream');


/**
 * Writes information into the screen
 *
 * Input format:
 *      payPeriod               - per calendar month
 *      grossIncome             - annual salary/12 months
 *      incomeTax               - based on the tax table
 *      netIncome               - gross income - income tax
 *      superIncome             - gross income x super rate
 */
class PayslipOutput extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(data, encoding, callback) {
        let input = [ [data.payPeriod, data.grossIncome, data.incomeTax, data.netIncome, data.superIncome] ];
        stringify(input, (err, output) => {
            console.log(output.substring(0,output.length-1));
            callback(null, data);
        });
    }
}

module.exports = { PayslipOutput : PayslipOutput };