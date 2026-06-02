export function generateCsvTemplate() {
  const headers = ['Name', 'Email', 'Programme', 'Batch', 'DOB', 'CurrentRole', 'Company', 'Industry', 'WorkExperience'];
  const row1 = ['John Doe', 'john.doe@example.com', 'IPMX', '2025', '1990-05-15', 'Product Manager', 'Google', 'Technology', '5 years of experience in product management'];
  const row2 = ['Jane Smith', 'jane.smith@example.com', 'PGPSM', '2025', '15/08/1992', 'Consultant', 'McKinsey', 'Consulting', ''];
  
  const csvContent = [
    headers.join(','),
    row1.map(val => `"${val}"`).join(','),
    row2.map(val => `"${val}"`).join(',')
  ].join('\\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'gurukul_students_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
