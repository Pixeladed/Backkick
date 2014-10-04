![#Backkick](http://i.imgur.com/8oEhvzK.png)
---
###Installation

    $ npm install backkick
   
---
###Purpose
Are you tired of hacing to type `<!DOCTYPE html>` and linking all your css and js files to your html file?

Backkick will do it for you, it will even create a html file if you don't have one!

---
   
###Usage

    $ backkick options

    
----

###Options

You can only use 1 of the 2 options:

####1. path/to/folder

This will run backkick on the folder provided. If leave blank or use library option instead, backkick will run on the folder of which you are at on the terminal.

	$ backkick /Users/someone/Desktop/myproject 

####2. [libraries]

This option will download and link the libraries listed inside `[]` separated by `,`

**Avalaible libraries:** normalize ; jquery ; angular ; dojo ; ext ; mootools ; three ; backbone ; yue

	$ backkick [jquery,normalize,yue]

----
###Changelog

**0.1.0**

- Official Release
- Fixed bug where backkick requires option

**0.0.5**

- Shortened generated html file name to 3 decimal places
- Generate html file in correct path
- Remove found files logging
- Change option values
- Add support for libraries

**0.0.3**

- add option for directory

**0.0.2**

- Add README.md

**0.0.1**

- Include mapping for nested folders
- First commit
- Add indentation to html file
- Support for html4

---

###Contributers

**Project Github**
[Github Backkick](https://github.com/Pixeladed/Backkick)

**Creator**
[@vietminhle](https://twitter.com/vietminhle)

