#!/usr/bin/env node

var fs = require('fs');
var colors = require('colors');
var readline = require('readline');
var http = require('http');
var exec = require('child_process').exec;
var nestedDir = [];
var jsF = [];
var cssF = [];
var htmlFILE,explorePath = process.cwd();
var terminal = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});
var beginWF = "<!DOCTYPE html>\r\n<html>\r\n\t<head>\r\n\t\t<title> </title>";
var endWF = "\r\n\t</head>\r\n\t<body>\r\n\t\t\r\n\t</body>\r\n</html>";
var finalWF = '';
var optLib = [];
var libraries = {
	'normalize':{
		'url':'http://necolas.github.io/normalize.css/3.0.1/normalize.css',
		'name':'normalize.css',
		'type':'css'
	},
	'jquery':{
		'url':'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
		'name':'jquery.js',
		'type':'js'
	},
	'angular':{
		'url':'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.23/angular.min.js',
		'name':'angular.js',
		'type':'js'
	},
	'dojo':{
		'url':'http://ajax.googleapis.com/ajax/libs/dojo/1.10.0/dojo/dojo.js',
		'name':'dojo.js',
		'type':'js'
	},
	'ext':{
		'url':'http://ajax.googleapis.com/ajax/libs/ext-core/3.1.0/ext-core.js',
		'name':'ext.js',
		'type':'js'
	},
	'mootools':{
		'url':'http://ajax.googleapis.com/ajax/libs/mootools/1.5.0/mootools-yui-compressed.js',
		'name':'mootools.js',
		'type':'js'
	},
	'three':{
		'url':'http://ajax.googleapis.com/ajax/libs/threejs/r67/three.min.js',
		'name':'three.js',
		'type':'js'
	},
	'backbone':{
		'url':'http://backbonejs.org/backbone.js',
		'name':'backbone.js',
		'type':'js'
	},
	'yue':{
		'url':'http://rawgit.com/lepture/yue.css/master/yue.css',
		'name':'yue.css',
		'type':'css'
	}
}

log('   ');
log(' Backkick 0.1.0 '.inverse.black);
log('   ');

function download(name,url) {
	fs.writeFile(name,'');
	var file = fs.createWriteStream(name);
	var request = http.get(url, function(response) {
  		response.pipe(file);
	});
}

if (process.argv[2]) {
	if (process.argv[2] && process.argv[2].substr(0,1) != '[' && process.argv[2].substr(-1,1) != ']') {
		explorePath = process.argv[2];
	} else {
		optLib = process.argv[2].substring(1,process.argv[2].length-1).split(',');
		explorePath = process.cwd();
	}
}

for (v=0;v<optLib.length;v++) {
	if (libraries[optLib[v]]) {	
		download(libraries[optLib[v]].name,libraries[optLib[v]].url);
	} else {
		log('info'.inverse.red+' Library not supported');
		log('Looking in npm registry');
		exec('npm view '+optLib[v],function(err,stdout,stderr) {
			if (stdout.substr(-6,6) == 'code 0') {
				log('info'.inverse.red+'No npm modules found');
			} else {
				exec('npm install '+optLib[v-1],function(err2,stdout2,stderr2) {
					if (err2) {
						throw err2
						log('Something went wrong please try again');
					} else {
						log('info'.inverse.red+' Installed '+optLib[v-1]+' through npm');
					}
				});
			}
		});
	}
}

function log(input) {
	console.log(input);
}
function error(error) {
	// log('ERROR'.inverse.red+' '+error);
	return;
}
function mapDir(files) {
	for (i=0;i<files.length;i++) {
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

log('info'.inverse.red+' '+'explore directory'.blue);
fs.readdir(explorePath,function(err,files) {
	if (err) {
		error(err);
	} else {

		mapDir(files);

		log('JS FILES'.green+' '+jsF.toString().yellow);
		log('CSS FILES'.green+' '+cssF.toString().yellow);

		for (j=0;j<jsF.length;j++) {
			beginWF = beginWF + '\r\n\t\t<script type="text/javascript" src="'+jsF[j]+'"></script>';
		}
		for (c=0;c<cssF.length;c++) {
			beginWF = beginWF + '\r\n\t\t<link rel="stylesheet" type="text/css" href="'+cssF[c]+'"/>';
		}
		finalWF = beginWF + endWF;

		if (htmlFILE) {
			log('INPUT'.red+' '+htmlFILE);
			log('   ');
			fs.readFile(htmlFILE,'utf8',function(err,data) {
				if (err) {
					error(err);
				} else {
					if (data.length >= 1) {
						terminal.question('Do you want to overwrite data in html file? [ Y or N ] ',function(answer){
							terminal.close();
							if (answer.toLowerCase() == 'y') {
								log('WRITING FILE'.cyan+' '+htmlFILE.yellow);
								//WRITE INTO THE FILE HERE
								fs.writeFile(htmlFILE,finalWF);
								log('overwritten'.inverse.red);
							} else {
								log(' END PROCESS '.inverse.red);
								process.exit();
							}
						});
					} else {
						log('WRITING FILE'.cyan+' '+htmlFILE.yellow);
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
			htmlFILE = "Backkick "+Math.round(Math.random()*1000)/1000+'.html';
			log('info'.inverse.red+' '+'create '+htmlFILE);
			fs.writeFile(explorePath+'/'+htmlFILE,finalWF,function(err) {
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


