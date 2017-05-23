const PayTransformer = require('./pay-transformer');
const ReaderCSV = require('./reader-csv');

// Constants
const INPUT_DIR = __dirname + "/../samples/input";
const OUTPUT_DIR = __dirname + "/../samples/output";


// Streams
let inputStream = new ReaderCSV(INPUT_DIR + "/sample01.csv");
let transformer = new PayTransformer();

// Error handlers
inputStream.on('error', function(err){
    console.log('Mistake in the input: ', err.message);
});

transformer.on('error', function(err){
    console.log('Mistake in transformations: ', err.message);
});

// Routing
inputStream
    .pipe(transformer);