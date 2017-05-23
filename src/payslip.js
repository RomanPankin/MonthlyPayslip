/**
 * Module calculates an employee's payslip
 */
let stream = require('stream');


/**
 * Taxes' table
 */
const TAX_TABLE = [
    { min : 0,      max : 18200,    taxBase : 0,    taxPerDollar : 0},
    { min : 18201,  max : 37000,    taxBase : 0,    taxPerDollar : 0.19 },
    { min : 37001,  max : 80000,    taxBase : 3572, taxPerDollar : 0.325 },
    { min : 80001,  max : 180000,   taxBase : 17547,taxPerDollar : 0.37 },
    { min : 180001, max : Number.MAX_VALUE, taxBase : 54547, taxPerDollar : 0.45 }
]

/**
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
 *      netIncome               - gross income - income tax
 *      superIncome             - gross income x super rate
 */
class Payslip extends stream.Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(data, encoding, callback) {
        let result = Payslip.calculate(data);

        callback(null, result);
    };

    static calculate(data) {
        if (!data) return null;

        let taxInfo = null;
        let annualSalary = data.annualSalary;

        // Find tax information
        for (let info of TAX_TABLE)
            if (annualSalary >= info.min && annualSalary <= info.max) {
                taxInfo = info;
                break;
            }

        if (!taxInfo)
            throw new Error("Tax information was not found");

        // Calculate result
        let grossIncome = Math.round(annualSalary/12);
        let incomeTax = Math.round( (taxInfo.taxBase + (annualSalary - taxInfo.min)*taxInfo.taxPerDollar)/12 );
        let netIncome = grossIncome - incomeTax;
        let superIncome = Math.round(grossIncome * data.superRate);

        return {
            payPeriod : data.payPeriod,
            grossIncome : grossIncome,
            incomeTax : incomeTax,
            netIncome : netIncome,
            superIncome : superIncome
        };
    }
}

module.exports = { Payslip : Payslip };