/*
A Note on Style:
When writing a function using the parseThroughFolder function, make sure the curr_spreadsheet is always the first parameter
*/


/**
 * Copies a specified sheet into all files of a given folder. Ignores any files that are specified.
 *
 * @param {string} folder_id is the id of the folder you want to parse through
 * @param {string} func is the function we want to perform on each spreadsheet in the folder
 * @param {string} args is a list of arguments that func will take besides the current spreadsheet
 */
function parseThroughFolder(folder_id, func, args)
{
  var source_folder = DriveApp.getFolderById(folder_id);
  var folder_files = source_folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  var curr_file; 
  
  args = typeof args !== 'undefined' ? args : [];

  while (folder_files.hasNext()) 
  {
    curr_file = folder_files.next();
    var curr_spreadsheet = SpreadsheetApp.openById(curr_file.getId());

    if(args.length > 0)
    {
        args.unshift(curr_spreadsheet);
        func.apply(this, args);
        args.shift();  
    }
    else
    {
        func(curr_spreadsheet);
    }

  }
}

/**
 * Copies a specified sheet into all files of a given folder. Ignores any files that are specified.
 *
 * @param {string} sheet_name is the name of the sheet you would like to copy on the current Spreadsheet.
 * @param {string} targer_folder_id is the id of the target folder
 * @param {string} file_names_to_ignore is a list of file_names that we should not copy the sheet into. 
 * By default, this only contains the current active spreadsheet name
 */
function copySheetToAllFilesInFolder(sheet_name, folder_id, filenames_to_ignore)
{   
    var args = [sheet_name, filenames_to_ignore];
    parseThroughFolder(folder_id, copy_, args);
}

function copy_(target_spreadsheet, sheet_name, filenames_to_ignore)
{ 
    var source = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_to_copy = source.getSheetByName(sheet_name);
  
    filenames_to_ignore = typeof filenames_to_ignore !== 'undefined' ? filenames_to_ignore : [source.getName()];
  
    if (!contains(filenames_to_ignore, target_spreadsheet.getName()))
    {
        try
        {
            sheet_to_copy.copyTo(target_spreadsheet);
            target_spreadsheet.getSheets()[target_spreadsheet.getSheets().length-1].setName(sheet_name);
        }
        catch(err)
        {
            source.toast(err);
        }
    }
}
/**
 * Checks to see if the target is contained within an array.
 *
 * @param {string} arr_to_search is an unsorted array you would like to search.
 * @param {string} target is the element to search the array for.
 * @return {boolean} true if the target exists in the array and false if it doesn't.
 */
function contains(arr_to_search, target)
{
  
  for(var i = 0; i < arr_to_search.length; i++)
  {
    if(arr_to_search[i] == target)
    {
      return true;
    }
  }
  
  return false;
}

/**
 * Duplicates a specified sheet 11 times, and appropriately titles them for each branch.
 * Make sure the sheet you want to copy does not already have the name of one of the branches, otherwise there will be an error.
 * @param {string} sheet_name is the sheet you want to duplicate
 */
function duplicateSheets(sheet_name)
{
  var source = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = source.getSheetByName(sheet_name);
  
  var branches = ["AST", "BK", "CH", "FP", "JA", "JH", "OP", "PC", "RH", "SUN", "SUT"];
  
  for (var i = 0; i < branches.length; i++)
  {
    
    try
    {
        var copy = sheet.copyTo(source);
        copy.setName(branches[i]);
    }
    catch(err)
    {
        source.toast(err);
    }

  }
}

/**
 * Finds the first whole empty row in  the specified range
 * 
 * @param {string} range is the range you wish to check
 * @param {string} start_row is the first_row of our range, by default it starts with 1. Specify if otherwise.
 * @return {number} the last row in the data range
 */
function getFirstEmptyRowWholeRow(range, start_row) 
{
    start_row = typeof start_row !== 'undefined' ? start_row : 1;
    var offset = start_row-1;

    var values = range.getValues();
  
    for (var row = 0; row < values.length; row++) 
    {
      if (!values[row].join(""))
      {
        return (row+1 + offset);
      }
    }

    range.getSheet().getParent().toast("ERROR: Could not find empty row in given data range");
}

/**
 * Creates a new spreadsheet with all names and URL's of all files in the folder. 
 * 
 * @param {string} folder_id is the id of the folder you want to parse through
 */
function createUrlSheetForFolder(folder_id)
{
    var folder = DriveApp.getFolderById(folder_id);
    var filename = "Urls " + folder.getName();
  
    var new_ss = createSpreadsheetInFolder(filename, folder);
    var sheet = new_ss.getActiveSheet();
    sheet.appendRow(["Sheet Name", "Urls"]);
    sheet.setName(filename);
    
    args = [sheet];
    parseThroughFolder(folder_id, pasteUrlToSheet_, args)
    formatUrlSheet_(sheet);
}

function formatUrlSheet_(sheet)
{
    var start = sheet.getLastRow()+1
    var num = sheet.getMaxRows() - start + 1;
    sheet.deleteRows(start, num);

    start = sheet.getLastColumn()+1
    num = sheet.getMaxColumns() - start + 1;
    sheet.deleteColumns(start, num);

    var range = sheet.getRange(1,1,1,2);

    var style = SpreadsheetApp.newTextStyle()
    .setBold(true)
    .build();

    range.setBackground("#c9daf8");
    range.setTextStyle(style);

}

function pasteUrlToSheet_(curr_ss, sheet)
{
    if(curr_ss.getName() != sheet.getParent().getName())
    {
        name = curr_ss.getName();
        link = curr_ss.getUrl();
        sheet.appendRow([name, link]);
    }
  
}

function createSpreadsheetInFolder(filename, folder)
{
    var file = SpreadsheetApp.create(filename);
    var copyFile = DriveApp.getFileById(file.getId());
    folder.addFile(copyFile);
    DriveApp.getRootFolder().removeFile(copyFile);
    
    return file;
}