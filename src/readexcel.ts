const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs').promises;


export default async function readExcelFromURL(url: string) {
    try {
      // Fetch the Excel file
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
      });
  
  
      // Read the file into a workbook
      const workbook = XLSX.read(response.data, { type: 'buffer' });
  
      // Get the first sheet name
      const sheetName = workbook.SheetNames[0];
  
      // Get the worksheet
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert the worksheet to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);
  
      const ids = data[0];
      const idName: (string | number)[] = Object.values(ids);
      let results: { [key: string]: string }[] = [];

      data.forEach((row: Record<string, any>) => {
        if (row['__EMPTY'] !== 1 && row['A']) {
          const values = Object.values(row);
          const value = values.reduce((acc, value, index) => {
            const key = idName[index as number];
              if (key && index === 0) {
                acc['number'] = value;
              } else if (key && index !== 0) {
                acc[key] = value;
              }
            return acc;
          }, {}) as { [key: string]: string };

          results.push(value);
        }
      })

      console.log(results)
      return (results);
    } catch (error) {
      console.error('Error reading Excel file from URL:', error);
    }
  }