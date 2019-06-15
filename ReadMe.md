# gsutils
This project is a js file that functions as a google script library containing several quality of life and utility functions.
It is designed to make developing in apps script more convenient.

## Function List
- [parseThroughFolder(folder_id, func, args)](#parseThroughFolder)
- [copySheetToAllFilesInFolder(sheet_name, folder_id, file_names_to_ignore)](#copySheetToAllFilesInFolder)
- [contains(list_to_search, target)](#contains)
- [duplicateSheets(sheet_to_be_duplicated, new_sheet_names)](#duplicateSheets)
- [getFirstEmptyRowWholeRow(range, start_row)](#getFirstEmptyRowWholeRow)
- [createUrlSheetForFolder(folder_id)](#createUrlSheetForFolder)
- [createSpreadsheetInFolder(filename, folder)](#createSpreadsheetInFolder)
- [getParentFolder(id)](#getParentFolder)

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

This will print the names of all spreadsheets in the folder.

```
**filenames_to_ignore** {list} :  ifilenames that we should not copy the sheet into. 
By default, this is empty.

**_When writing a function as a parameter for parseThroughFolder, make sure the curr_spreadsheet is always the first parameter_**

## copySheetToAllFilesInFolder
(sheet_name, folder_id, filenames_to_ignore)

Copies one sheet in a spreadsheet to all spreadsheets in a folder. Ignores all filenames specified. If a folder has other files within in that are not spreadsheets, they will automatically be ignored. If some kind of error occurs, it will displayed in a toast window on the active spreadsheet. The new sheet will be given the name of the sheet you are copying.

**sheet_name** {string} : name of the sheet you want to copy.

**folder_id** {string} : id of the folder you wish to parse through.

**filenames_to_ignore** {list} : filenames to not copy the tab to. Contains the name of the source spreadsheet by default. If you want to pass some additional filenames, you must make sure that the name of the current spreadsheet is still included or there will be an error. For example: 

``` javascript

var source = SpreadsheetApp.getActiveSpreadsheet();
var sheet_name = "some sheet name";
var folder_id = "some folder id";

//ERROR
copySheetToAllFilesInFolder(sheet_name, folder_id, ["some file", "some other file"]);

//CORRECT
copySheetToAllFilesInFolder(sheet_name, folder_id, [source.getName(), "some file", "some other file"]);

```

## contains
(list_to_search, target)

Performs a linear search on all items in the list, and stops once it gets to the target. Worst case runtime is O(n).

**arr_to_search** {any data structure with array-like indexing} : data structure to be searched.

**target** {element} : element being searched for.

## duplicateSheets
(sheet_name, new_sheet_names)

Duplicates a sheet_name an n number of times, where n = new_sheet_names.length. The sheets will be named in the order they appear in new_sheet_names. If some kind of error occurs, it will displayed in a toast window on the active spreadsheet. 

**sheet_name** {string} : name of the sheet to be duplicated.

**new_sheet_names** {any data structure with array-like indexing} : contains the names of the new sheets. The length of this will also determine how many files new sheets are made. By default this is ["AST", "BK", "CH", "FP", "JA", "JH", "OP", "PC", "RH", "SUN", "SUT"].

## getFirstEmptyRowWholeRow
(range, start_row)

Returns the first empty row in the given data range. If it cannot find the last row, an error will pop up in a toast window on the active spreadsheet. 

**range** the range to look through. This range could be a single column or the entire sheet.

**start_row** the first row of your data range. By default this is 1. This is to ensure that the return value you get is the actual row index for the sheet and not just the row index for the data range passed.

## createUrlSheetForFolder
(folder_id)

Creates a spreadsheet with the name and URL of all spreadsheets in the given folder. The newly created spreadsheet will be inside the given folder and will be named "Urls + given folder name". It will have one sheet titled "Urls" with two columns. The name of all sheets on column 1, and the url of the corresponding sheet on column 2. The first row will contain the header.

**folder_id** {string} : id of the folder you wish to create the sheet for.
By default, this is the id of the parent folder of the active spreadsheet.

## createSpreadsheetInFolder
(filename, folder_id)

Creates a spreadsheet with the name filename, in the given folder. Also returns this file object.

**filename** {string} : name of the new spreadsheet you want to create.

**folder_id** {string} : id of the folder you wish to create the sheet for.

## getParentFolder
(id)

Returns the folder object that is the parent of the given id

**id** {string} : id of a spreadsheet that is within the folder you want. By default, this is the id of the active spreadsheet.