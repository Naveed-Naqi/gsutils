/**
 * Copies a specified sheet into all files of a given folder. Ignores any files that are specified.
 *
 * @param {string} folder_id is the id of the folder you want to parse through
 * @param {string} func is the function we want to perform on each spreadsheet in the folder
 * @param {string} args is a list of arguments that func will take besides the current spreadsheet
 * @param {string} filenames_to_ignore is a list of filenames that we should not copy the sheet into. 
 * By default, this only contains the current active spreadsheet name
 */
function parseThroughFolder(folder_id, func, args, filenames_to_ignore)
{
    filenames_to_ignore = typeof filenames_to_ignore !== 'undefined' ? filenames_to_ignore : [];
    args = typeof args !== 'undefined' ? args : [];

    var source_folder = DriveApp.getFolderById(folder_id);
    var folder_files = source_folder.getFilesByType(MimeType.GOOGLE_SHEETS);
    var curr_file; 

    while (folder_files.hasNext()) 
    {
        curr_file = folder_files.next();
        var curr_spreadsheet = SpreadsheetApp.openById(curr_file.getId());

        if(!contains(filenames_to_ignore, curr_spreadsheet.getName()))
        {
            try
            {
                performFunction_(curr_spreadsheet, func, args);
            }
            catch(err)
            {
                Logger.log(err + " : " + curr_spreadsheet.getUrl())
            }
        }
    }
}

function performFunction_(curr_spreadsheet, func, args)
{
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

/**
 * Copies a specified sheet into all files of a given folder. Ignores any files that are specified.
 *
 * @param {string} sheet_name is the name of the sheet you would like to copy on the current Spreadsheet.
 * @param {string} targer_folder_id is the id of the target folder
 * @param {string} filenames_to_ignore is a list of filenames that we should not copy the sheet into. 
 * By default, this only contains the current active spreadsheet name
 */
function copySheetToAllSpreadsheetsInFolder(sheet_name, folder_id, filenames_to_ignore)
{   
    var args = [sheet_name];
    var source = SpreadsheetApp.getActiveSpreadsheet();

    filenames_to_ignore = typeof filenames_to_ignore !== 'undefined' ? filenames_to_ignore : [source.getName()];
    
    parseThroughFolder(folder_id, copy_, args, filenames_to_ignore);
}

function copy_(target_spreadsheet, sheet_name)
{ 
    var source = SpreadsheetApp.getActiveSpreadsheet();
    var sheet_to_copy = source.getSheetByName(sheet_name);
  
    sheet_to_copy.copyTo(target_spreadsheet);
    target_spreadsheet.getSheets()[target_spreadsheet.getSheets().length-1].setName(sheet_name);
    
}
/**
 * Checks to see if the target is contained within an array.
 *
 * @param {string} list_to_search is an unsorted array you would like to search.
 * @param {string} target is the element to search the array for.
 * @return {boolean} true if the target exists in the array and false if it doesn't.
 */
function contains(list_to_search, target)
{
  
  for(var i = 0; i < list_to_search.length; i++)
  {
    if(list_to_search[i] == target)
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
function duplicateSheets(sheet_name, new_sheet_names)
{
  var source = SpreadsheetApp.getActiveSpreadsheet()
  var sheet_to_be_duplicated = source.getSheetByName(sheet_name);

  new_sheet_names = typeof args !== 'undefined' ? new_sheet_names : ["AST", "BK", "CH", "FP", "JA", "JH", "OP", "PC", "RH", "SUN", "SUT"];
  
  for (var i = 0; i < branches.length; i++)
  {
    
    try
    {
        var copy = sheet_to_be_duplicated.copyTo(source);
        copy.setName(new_sheet_names[i]);
    }
    catch(err)
    {
        Logger.log(source.getUrl() + " : " + err);
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
 * @param {string} folder_id is the id of the folder you want to parse through. 
 * By default, this is the id of the parent folder of the active spreadsheet.
 */
function createUrlSheetForFolder(folder_id)
{
    folder_id = typeof folder_id !== 'undefined' ? folder_id : getParentFolder().getId();

    var folder = DriveApp.getFolderById(folder_id);
    var filename = "Urls " + folder.getName();
  
    var new_ss = createSpreadsheetInFolder(filename, folder_id);
    var sheet = new_ss.getActiveSheet();
    //sheet.appendRow(["Sheet Name", "Urls"]);
    sheet.setName("Urls");
    
    args = [sheet];
    parseThroughFolder(folder_id, pasteUrlToSheet_, args)
    addUrlSheetHeader_(sheet);
    formatUrlSheet_(sheet);
}

function addUrlSheetHeader_(sheet)
{
    sheet.getDataRange().sort(1);
    sheet.insertRowsBefore(1, 1);
    sheet.getRange(1, 1).setValue("Sheet Name");
    sheet.getRange(1, 2).setValue("Urls");
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

/**
 * Creates a spreadsheet, named filename, in the folder specified by folder_id.
 * 
 * @param {string} filename the name you  want for the new spreadsheet.
 * @param {string} folder_id the id of the folder you want to create the sheet in.
 * @return {file} the new file object that you have created.
 */
function createSpreadsheetInFolder(filename, folder_id)
{   
    var folder = DriveApp.getFolderById(folder_id);
    var file = SpreadsheetApp.create(filename);
    var copy_file = DriveApp.getFileById(file.getId());
    folder.addFile(copy_file);
    DriveApp.getRootFolder().removeFile(copy_file);
    
    return file;
}

function deleteSheetFromAllSpreadsheetsInFolder(sheet_name, folder_id)
{
    args = [sheet_name];
    parseThroughFolder(folder_id, deleteSheet_, args, filenames_to_ignore);
}

function deleteSheet_(spreadsheet, sheet_name)
{
    var sheet_to_delete = spreadsheet.getSheetByName(sheet_name);

    try
    {
        spreadsheet.deleteSheet(sheet_to_delete);
    }
    catch(err)
    {
        Logger.log(spreadsheet.getUrl() + " : " + err);
    }
}

/**
 * Gets the folder object that is the parent of the given folder id.
 * 
 * @param {string} id is the id of a spreadsheet contained within the folder you want. 
 * By default, this id is the current active spreadsheet.
 */
function getParentFolder(id)
{
    id = typeof id !== 'undefined' ? id : SpreadsheetApp.getActiveSpreadsheet().getId();

   return DriveApp.getFileById(id).getParents().next();
}

/**
 * Gets files that were updated in the last n minutes where n is the duration
 * 
 * @param {string} folder_id id of the folder you want to create the sheet in. 
 * By default, this is the parent folder id of the current active spreadsheet.
 * @param {int} duration the number of minutes. 
 */
function getFilesJustUpdated(folder_id , duration)
{
    folder_id = typeof id !== 'undefined' ? folder_id : getParentFolder().getId();

    var updated_files = [];
    var args = [duration, updated_files];
    parseThroughFolder(folder_id, getUpdatedfile_, args);
    return updated_files;
}

function getUpdatedfile_(curr_spreadsheet, duration, updated_files)
{
    const MILLISECONDS_PER_MIN = 60000;

    if (new Date() - curr_spreadsheet.getLastUpdated() > duration * MILLISECONDS_PER_MIN) 
    {
        updated_files.push(curr_spreadsheet);
    }
}

function copyFolder(folder_to_copy, target_folder)
{
    var args = [curr_spreadsheet, target_folder];
    parseThroughFolder(folder_to_copy.getId(), copyFileToFolder_, args);
}

function copyFileToFolder_(curr_spreadsheet, target_folder)
{
    const name = curr_spreadsheet.getName();
    curr_spreadsheet.makeCopy(name, target_folder);
}

