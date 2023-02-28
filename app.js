import QRCode from 'qrcode-generator';

let employeesJSON = {};

function addEmployee() {
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const positionInput = document.getElementById("positionInput");
  const salaryInput = document.getElementById("salaryInput");

  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const position = positionInput.value;
  const salary = parseFloat(salaryInput.value);

  const employeeKey = `${firstName}_${lastName}`;
  const employeeData = {
    position: position,
    salary: salary,
    scanTimes: []
  };

  employeesJSON[employeeKey] = employeeData;

  const qrCode = new QRCode(document.getElementById(`${firstName}${lastName}-qrCode`), {
    text: `Employee: ${firstName} ${lastName}\nVisit us at bread-7.github.io`,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  qrCode.makeCode();

  firstNameInput.value = "";
  lastNameInput.value = "";
  positionInput.value = "";
  salaryInput.value = "";
}

function viewEmployeeData() {
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');
    const beginDate = new Date(document.getElementById('startDateInput').value);
    const endDate = new Date(document.getElementById('endDateInput').value);
    const selectedEmployee = selectEmployeeDropdown.value;
    const employeeKey = selectedEmployee.replace(/\s+/g, '_');
    const employee = employeesJSON[employeeKey];
    const payRate = employee.hourlySalary;
    const employeeData = document.getElementById('qrCodeModal');
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    const workedHours = [];
  
    if (beginDate > endDate) {
      employeeData.innerHTML = '<p>Invalid date range</p>';
      return;
    }
  
    if (!employee) {
      employeeData.innerHTML = '<p>No employee data found</p>';
      return;
    }
  
    let scanDates = [];
    for (const scanKey in employee) {
      if (scanKey.includes('scan_')) {
        const scanDate = new Date(employee[scanKey]);
        if (scanDate >= beginDate && scanDate <= endDate) {
          scanDates.push(scanDate);
        }
      }
    }
  
    if (scanDates.length % 2 !== 0) {
      employeeData.innerHTML = '<p>Invalid scan data</p>';
      return;
    }
  
    let totalHours = 0;
    for (let i = 0; i < scanDates.length; i += 2) {
      const timeDiff = scanDates[i + 1] - scanDates[i];
      const hoursWorked = timeDiff / (1000 * 60 * 60);
      workedHours.push(hoursWorked);
      totalHours += hoursWorked;
    }
  
    const payAmount = totalHours * payRate;
  
    let html = '';
    html += `<p>Name: ${employeeName}</p>`;
    html += `<p>Position: ${employee.position}</p>`;
    html += `<p>Hourly Salary: $${payRate.toFixed(2)}</p>`;
    html += '<p>Scan Dates:</p>';
    html += '<ul>';
    scanDates.forEach(scanDate => {
      html += `<li>${scanDate.toLocaleString()}</li>`;
    });
    html += '</ul>';
    html += '<p>Worked Hours:</p>';
    html += '<ul>';
    workedHours.forEach(hoursWorked => {
      html += `<li>${hoursWorked.toFixed(2)} hours</li>`;
    });
    html += '</ul>';
    html += `<p>Total Pay: $${payAmount.toFixed(2)}</p>`;
  
    employeeData.innerHTML = html;
  }
  

function removeEmployee() {
  const employeeSelect = document.getElementById("employeeSelect");

  const employeeKey = employeeSelect.value;
  delete employeesJSON[employeeKey];

  employeeSelect.remove(employeeSelect.selectedIndex);
}

document.getElementById("addEmployeeForm").addEventListener("submit", event => {
  event.preventDefault();
  addEmployee();
});

document.getElementById("viewEmployeeDataForm").addEventListener("submit", event => {
  event.preventDefault();
  viewEmployeeData();
});

document.getElementById("removeEmployeeForm").addEventListener("submit", event => {
  event.preventDefault();
  removeEmployee();
});

for (const employeeKey in employeesJSON) {
    const [firstName, lastName] = employeeKey.split('_');
    const fullName = `${firstName} ${lastName}`;
    const selectOption = document.createElement('option');
    selectOption.value = employeeKey;
    selectOption.text = fullName;
    selectEmployeeDropdown.appendChild(selectOption);
}  