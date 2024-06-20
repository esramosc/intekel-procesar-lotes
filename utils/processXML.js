const xml2js = require('xml2js');
const fs = require('fs');
const {createExpenseDetail} = require('./bluespend');

// Function to parse XML content and extract desired information
const processFile = (filePath, expenseId) => {
  console.log('expenseId: ', expenseId);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const parser = new xml2js.Parser();
    parser.parseString(data, async (parsingErr, result) => {
      if (parsingErr) {
        console.error(`Error parsing XML file ${filePath}:`, parsingErr);
        return;
      }

      const cfdiComprobante = result['cfdi:Comprobante'];
      const emisor = result['cfdi:Comprobante']['cfdi:Emisor'];
      const receptor = result['cfdi:Comprobante']['cfdi:Receptor'];
      const cfdiConceptos = result['cfdi:Comprobante']['cfdi:Conceptos'];
      const cfdiImpuestos = result['cfdi:Comprobante']['cfdi:Impuestos'];
      let totalImpuestos = 0;
      for (const impuesto of cfdiImpuestos) {
        totalImpuestos += parseFloat(impuesto['$'].TotalImpuestosTrasladados);
      }
      let conceptos = [];
      for (const concepto of cfdiConceptos) {
        for (const element of concepto['cfdi:Concepto']) {
          conceptos.push(element);
        }
      }
      
      const extractedInfo = {
        emisor: emisor[0]['$'],
        receptor: receptor[0]['$'],
        total: cfdiComprobante['$'].Total,
        subTotal: cfdiComprobante['$'].SubTotal,
        totalImpuestos: totalImpuestos,
        conceptos: conceptos
      };

      // Send the processed information to the REST API
      await createExpenseDetail(extractedInfo, expenseId);
    });
  });
}

exports.processFile = processFile;