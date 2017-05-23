let stream = require('stream');


const TAX_TABLE = [
    { min : 0,      max : 18200,    taxBase : 0,    taxPerDollar : 0},
    { min : 18201,  max : 37000,    taxBase : 0,    taxPerDollar : 0.19 },
    { min : 37001,  max : 80000,    taxBase : 3572, taxPerDollar : 0.325 },
    { min : 80001,  max : 180000,   taxBase : 17547,taxPerDollar : 0.37 },
    { min : 180001, max : Number.MAX_VALUE, taxBase : 54547, taxPerDollar : 0.45 }
]


/**
 *
 * Input format:
 *      firstName
 *      lastName
 *      annualSalary
 *      superRate
 *      payPeriod
 *
 * Output format:
 *      payPeriod               - per calendar month
 *      grossIncome             - annual salary/12 months
 *      incomeTax               - based on the tax table
 */
class PayTransformer extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(data, encoding, callback) {
        let taxInfo = this._getTaxInfo(data.annualSalary);

        let result = {
            payPeriod : data.payPeriod,
            grossIncome : Math.round(data.annualSalary/12),
            incomeTax : Math.round( (taxInfo.taxBase + (data.annualSalary - taxInfo.min)*taxInfo.taxPerDollar)/12 )
        };

        callback(null, data);
    };

    _getTaxInfo(salary) {
        for (let info of TAX_TABLE)
            if (salary >= info.min && salary <= info.max)
                return info;

        throw new Error("Tax information was not found");
    }
}

module.exports = PayTransformer;