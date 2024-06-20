const fs = require('fs');
const path = require('node:path');
const processXML = require('./utils/processXML');
const logger = require('./utils/logger');
const {createExpense} = require('./utils/bluespend');

let isUserFolder = false;
let checkingDescription = '';
let isFirstXml = true;
let projectName = '';
let userName = '';

async function readDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      const theFilePath = filePath.split('\\');
      if (theFilePath.length === 5) {
        checkingDescription = `${theFilePath[2]} - ${theFilePath[3]} - ${theFilePath[4]}`;
        isUserFolder = true;
      } else {
        isUserFolder = false;
        isFirstXml = true;
        userName = '';
      }
      
      // Recursively call for subdirectories
      readDirectory(filePath);
    } else if (filePath.endsWith('.xml') && isUserFolder) {
      const filename = path.basename(file).split('_');
      logger.info(`Iniciando a procesar filename: ${path.basename(file)}`);
      if (isFirstXml) {
        projectName = filename[1];
        userName = filename[0].split('-')[1];
        isFirstXml = false;
        // console.log('projectName: ', projectName);
        // console.log('userName: ', userName);
      }
      if (path.basename(file).indexOf('CAJA') >= 0) {
        // // Process XML file
        const params = {
          project: projectName
        };
        const expenseId = await createExpense(params);
        processXML.processFile(filePath, expenseId);
        break; // Solo para pruebas
      }
      
    }
  }
}

const directoryPath = process.env.DIRECTORY_PATH;

// Start processing files in the directory
readDirectory(directoryPath);
