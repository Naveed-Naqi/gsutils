# gsutils
This project is a js file that functions as a google script library containing several quality of life and utility functions.
It is designed to make developing in apps script more convenient.

## Function List
- [parseThroughFolder(folder_id, func, args)](#parseThroughFolder)
- [copySheetToAllFilesInFolder(sheet_name, folder_id, file_names_to_ignore)](#copySheetToAllFilesInFolder)
- [contains](#contains)
- duplicateSheets
- getFirstEmptyRowWholeRow
- createUrlSheetForFolder
- createSpreadsheetInFolder

## parseThroughFolder
(folder_id, func, args)

Parses through a folder and performs some function on each spreadsheet in that folder. 

**folder_id** {string} : id of the folder you wish to parse through.

**func_** {function} : function you wish to apply to each spreadsheet in the folder. 

**args** {list} : Any additional arguments that func may require aside from the current spreadsheet.
Empty by default. If the only argument that func takes is the current spreadsheet, then leave this empty. For example:

```javascript
var folder_id = "some folder id";
parseThroughFolder(folder_id, printName);

function printName(spreadsheet)
{
    console.log(spreadsheet.getName());
}

```

This will print the names of all spreadsheets in the folder.

**When writing a function as a parameter for parseThroughFolder, make sure the curr_spreadsheet is always the first parameter**

## copySheetToAllFilesInFolder
(sheet_name, folder_id, filenames_to_ignore)

Copies one sheet in a spreadsheet to all spreadsheets in a folder. Ignores all filenames specified. If a folder has other files within in that are not spreadsheets, they will automatically be ignored.

**sheet_name** {string} : name of the sheet you want to copy.

**folder_id** {string} : id of the folder you wish to parse through.

**filenames_to_ignore** {list} : filenames to not copy the tab to.