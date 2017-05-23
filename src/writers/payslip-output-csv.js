/**
 * Module writes information about an employee's payslip to a CSV file
 */
const fs = require('fs');
const stringify = require('csv-stringify');
const stream = require('stream');


/**
 * Writes information into the CSV file
 *
 * Input format:
 *      payPeriod               - per calendar month
 *      grossIncome             - annual salary/12 months
 *      incomeTax               - based on the tax table
 *      netIncome               - gross income - income tax
 *      superIncome             - gross income x super rate
 */
class PayslipOutputCSV extends stream.Transform {
    constructor(filename) {
        super({ objectMode: true });

        this._file = fs.createWriteStream(filename);
    }

    _transform(data, encoding, callback) {
        let input = [ [data.payPeriod, data.grossIncome, data.incomeTax, data.netIncome, data.superIncome] ];
        stringify(input, (err, output) => {
            this._file.write(output);
            callback(null, data);
        });
    }
}

module.exports = { PayslipOutputCSV : PayslipOutputCSV };