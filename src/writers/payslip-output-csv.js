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
 *      firstName, lastName, annualSalary, superRate, payPeriod,
 *      payPeriod, grossIncome, incomeTax, netIncome, superIncome
 */
class PayslipOutputCSV extends stream.Transform {
    constructor(filename) {
        super({ objectMode: true });

        this._file = fs.createWriteStream(filename);
    }

    _transform(data, encoding, callback) {
        let input = [[
            `${data.firstName} ${data.lastName}`,
            data.payPeriod,
            data.grossIncome,
            data.incomeTax,
            data.netIncome,
            data.superIncome
        ]];

        stringify(input, (err, output) => {
            this._file.write(output);
            callback(null, data);
        });
    }
}

module.exports = { PayslipOutputCSV : PayslipOutputCSV };