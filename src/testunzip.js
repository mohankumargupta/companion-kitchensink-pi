unzip = require('unzip');
fs = require('fs');
arg = 'C:\\Users\\mohan\\Downloads\\New folder1';
outputFilename = 'C:\\Users\\mohan\\Downloads\\New folder1\\master.zip';
fs.createReadStream(outputFilename).pipe(unzip.Extract({ path: arg }));