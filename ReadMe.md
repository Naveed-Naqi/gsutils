## gsutils
This project is a js file that functions as a google script library containing several quality of life and utility functions.
It is designed to make developing in apps script more convenient.

## Function List
- [parseThroughFolder(folder_id, func, args)](#parseThroughFolder)
- copySheetToAllFilesInFolder
- contains
- duplicateSheets
- getFirstEmptyRowWholeRow
- createUrlSheetForFolder
- createSpreadsheetInFolder

## parseThroughFolder
(folder_id, func, args)

This function parses through a folder and performs some function on each spreadsheet in that folder. 

**folder_id** is the id of the folder you wish to parse through
**func_ is** the function you wish to apply to each spreadsheet in the folder
**args** is a list of additional arguments that func may require aside from the current spreadsheet.
By default args contains on the name of the current active spreadsheet. If you want the function to also apply to the  current active spreadsheet, then pass an empty list as a parameter. For example: 

''' javascript
parseThroughFolder(folder_id, printName, []);
'''