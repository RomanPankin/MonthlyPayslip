/**
 * Entry point
 */
const payslip = require('./payslip');
const reader = require('./readers/payslip-input-csv');
const writer = require('./writers/payslip-output-csv');
const writer_screen = require('./writers/payslip-output');


// Streams
let inputStream = new reader.PayslipInputCSV(__dirname + "/../samples/input/sample01.csv");
let outputStream = new writer.PayslipOutputCSV(__dirname + "/../samples/output/sample01.csv");
let outputStream2 = new writer_screen.PayslipOutput(__dirname + "/../samples/output/sample01zzz.csv");
let transformer = new payslip.Payslip();


// Error handlers
inputStream.on('error', function(err){
    console.log('Mistake in the input: ', err.message);
});

outputStream.on('error', function(err){
    console.log('Mistake in the output: ', err.message);
});

outputStream2.on('error', function(err){
    console.log('Mistake in the output: ', err.message);
});

transformer.on('error', function(err){
    console.log('Mistake in transformations: ', err.message);
});


// Routing: line from the input file -> calculations |-> line to the output file
//                                                   |-> line to the screen
inputStream
    .pipe(transformer)
    .pipe(outputStream)
    .pipe(outputStream2)
;