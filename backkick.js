#!/usr/bin/env node

var fs = require('fs');
var colors = require('colors');
var readline = require('readline');
var nestedDir = [];
var jsF = [];
var cssF = [];
var htmlFILE,explorePath;
var terminal = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});
var beginWF = "<!DOCTYPE html>\r\n<html>\r\n\t<head>\r\n\t\t<title> </title>";
var endWF = "\r\n\t</head>\r\n\t<body>\r\n\t\t\r\n\t</body>\r\n</html>";
var finalWF = '';

if (process.argv[2]) {
	explorePath = process.argv[2];
} else {
	explorePath = process.cwd();
}

function log(input) {
	console.log(input);
}
function error(error) {
	log('ERROR'.inverse.red+' '+error);
}
function mapDir(files) {
	for (i=0;i<files.length;i++) {
		log('file'+' '+files[i].yellow);
		if (files[i].substr(-3,3) == '.js') {
			jsF.push(files[i]);
		} else if (files[i].substr(-4,4) == '.css') {
			cssF.push(files[i]);
		} else if (files[i].substr(-5,5) == '.html') {
			if (!htmlFILE) {
				htmlFILE = explorePath+'/'+files[i];
			}
		} else if (files[i].indexOf('.') < 0) {
			fs.readdir(explorePath+'/'+files[i],function(err,nestedFiles) {
				if (err) {
					error(err);
				} else {
					mapDir(nestedFiles);
				}
			});
		}
	}
}

log('   ');
log(' Backkick 0.0.1 '.inverse.black);
log('   ');
log('info'.inverse.red+' '+'explore directory'.blue);
fs.readdir(explorePath,function(err,files) {
	if (err) {
		error(err);
	} else {

		mapDir(files);

		log('JS FILES'.green+' '+jsF);
		log('CSS FILES'.green+' '+cssF);

		for (j=0;j<jsF.length;j++) {
			beginWF = beginWF + '\r\n\t\t<script type="text/javascript" src="'+jsF[j]+'"></script>';
			finalWF = beginWF + endWF;
		}
		for (c=0;c<cssF.length;c++) {
			beginWF = beginWF + '\r\n\t\t<link rel="stylesheet" type="text/css" href="'+cssF[c]+'"/>';
			finalWF = beginWF + endWF;
		}

		if (htmlFILE) {
			log('INPUT'.red+' '+htmlFILE);
			fs.readFile(htmlFILE,'utf8',function(err,data) {
				if (err) {
					error(err);
				} else {
					if (data.length >= 1) {
						terminal.question('Do you want to overwrite data in '+htmlFILE+'? [ Y or N ] ',function(answer){
							terminal.close();
							if (answer.toLowerCase() == 'y') {
								log(' WRITING FILE '.cyan+' '+htmlFILE.yellow);
								//WRITE INTO THE FILE HERE
								fs.writeFile(htmlFILE,finalWF);
								log('overwritten'.inverse.red);
							} else {
								log(' END PROCESS '.inverse.red);
								process.exit();
							}
						});
					} else {
						log(' WRITING FILE '.cyan+' '+htmlFILE.yellow);
						//WRITE INTO THE FILE HERE
						fs.writeFile(htmlFILE,finalWF,function(err) {
							if (err) {
								error(err);
							} else {
								log('blank write'.inverse.blue);
								process.exit();
							}
						});
					}
				}
			});
		} else {
			//WRITE TO FILE HERE
			log('INPUT'.red+' none');
			htmlFILE = "Backkick "+Math.random()+'.html';
			log('info'.inverse.red+' '+'create '+htmlFILE);
			fs.writeFile(htmlFILE,finalWF,function(err) {
				if (err) {
					error(err);
				} else {
					log('normal write'.inverse.green);
					process.exit();
				}
			});
		}

	}
});


