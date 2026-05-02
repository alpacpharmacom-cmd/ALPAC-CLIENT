export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Format rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(fieldName => {
        let value = row[fieldName];
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          value = '';
        } 
        // Handle Date objects
        else if (value instanceof Date) {
          if (isNaN(value.getTime())) {
            value = '';
          } else {
            // Standard format: YYYY-MM-DD HH:mm:ss
            value = value.toISOString().replace('T', ' ').split('.')[0];
          }
        }
        // Handle other objects (arrays, nested objects)
        else if (typeof value === 'object') {
          value = JSON.stringify(value);
        } 
        // Handle primitives
        else {
          value = String(value);
        }

        // Escape quotes and handle commas
        return `"${value.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
