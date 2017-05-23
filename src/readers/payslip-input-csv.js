/**
 * Module reads information about an employee from a CSV file
 */
const fs = require('fs');
const parse = require('csv-parse');
const transform = require('stream-transform');


/**
 * Reads CSV file, converts each row into JSON-object and sends it into the pipe
 */
class PayslipInputCSV extends parse.Parser {
    constructor(filename) {
        super({delimiter: ','});

        // file -> parser -> transformation
        this._pipe = fs.createReadStream(filename)
            .pipe(this)
            .pipe(transform(function(record, callback){
                // Converts to an appropriate format
                callback(null, {
                    firstName : record[0],
                    lastName : record[1],
                    annualSalary : parseInt(record[2]),
                    superRate : parseFloat(record[3]),
                    payPeriod : record[4]
                });
            }));
    }

    pipe(destination, options) {
        return this._pipe ? this._pipe.pipe(destination, options) : super.pipe(destination, options);
    }
}

module.exports = { PayslipInputCSV : PayslipInputCSV };