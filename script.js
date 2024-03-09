let totalMoney, daysLeft, dailyAverage, remainingMoney;
let expenses = [];
let conversionRate = 74.5; // Replace with the current conversion rate
let currentPage = 1;
let rowsPerPage = 10;

function calculateAverage() {
    debugger;
    totalMoney = parseFloat(document.getElementById('totalMoney').value);
    daysLeft = parseInt(document.getElementById('daysLeft').value);

    if (isNaN(totalMoney) || isNaN(daysLeft) || totalMoney <= 0 || daysLeft <= 0) {
        alert('Please enter valid values for total money and days left.');
        return;
    }

    dailyAverage = totalMoney / daysLeft;

    document.getElementById('averageDisplay').style.display = 'block';
    document.getElementById('dailyAverage').innerText = `₹${(dailyAverage)}`;

    generateDaysTable();
}


function generateDaysTable() {
    let table = document.getElementById('daysTable');
    table.innerHTML = '<tr><th>Date</th><th>Day</th><th>Remaining Days</th><th>Expense</th><th>Difference</th></tr>';

    let currentDate = new Date();

    let startIndex = (currentPage - 1) * rowsPerPage;
    let endIndex = startIndex + rowsPerPage;

    for (let i = startIndex; i < endIndex && i < daysLeft; i++) {
        let row = table.insertRow(-1);
        let dateCell = row.insertCell(0);
        let dayCell = row.insertCell(1);
        let remainingDaysCell = row.insertCell(2);
        let expenseCell = row.insertCell(3);
        let differenceCell = row.insertCell(4);

        dateCell.innerText = currentDate.toDateString();
        dayCell.innerText = getDayOfWeek(currentDate.getDay());
        remainingDaysCell.innerText = daysLeft - i;

        let input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Enter expense';
        expenseCell.appendChild(input);

        differenceCell.innerText = '-';

        currentDate.setDate(currentDate.getDate() + 1);
    }

    table.style.display = 'table';
    updatePagination();
}


function updatePagination() {
    let totalPages = Math.ceil(daysLeft / rowsPerPage);
    document.getElementById('pagination').style.display = 'block';
    document.getElementById('currentPage').innerText = currentPage;

    if (currentPage === 1) {
        document.querySelector('#pagination button:first-child').disabled = true;
    } else {
        document.querySelector('#pagination button:first-child').disabled = false;
    }

    if (currentPage === totalPages) {
        document.querySelector('#pagination button:last-child').disabled = true;
    } else {
        document.querySelector('#pagination button:last-child').disabled = false;
    }
}

function changePage(offset) {
    currentPage += offset;
    generateDaysTable();
    updatePagination();

}


function getDayOfWeek(dayIndex) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}

function submitExpenses() {
    let inputs = document.querySelectorAll('#daysTable input');
    expenses = Array.from(inputs).map(input => parseFloat(input.value) || 0);

    if (expenses.some(isNaN) || expenses.some(amount => amount < 0)) {
        alert('Please enter valid expense amounts for each day.');
        return;
    }

    updateSummary();
}

function updateSummary() {
    debugger;
    let totalSpent = expenses.reduce((acc, curr) => acc + curr, 0);
    remainingMoney = totalMoney - totalSpent;

    let summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `<p>Total Money Left: $${remainingMoney.toFixed(2)}</p>`;

    if (expenses.length === daysLeft) {
        let lessOrMore = totalSpent < totalMoney ? 'less' : 'more';
        let difference = Math.abs(totalMoney - totalSpent);
        summaryDiv.innerHTML = `<p>Total Money Left: ₹${(remainingMoney)}</p>`;

    }

    summaryDiv.style.display = 'block';
    updateDifference();
}

function updateDifference() {
    let table = document.getElementById('daysTable');
    for (let i = 0; i < daysLeft; i++) {
        let differenceCell = table.rows[i + 1].cells[4];
        let difference = expenses[i] - dailyAverage;
        differenceCell.innerText = difference.toFixed(2);
    }
}


// Function to save data to Local Storage
function saveDataToLocalStorage() {
    let dataToSave = {
        totalMoney: totalMoney,
        daysLeft: daysLeft,
        expenses: expenses
    };

    localStorage.setItem('expenseData', JSON.stringify(dataToSave));
}

// Function to load data from Local Storage
function loadDataFromLocalStorage() {
    let savedData = localStorage.getItem('expenseData');

    if (savedData) {
        let parsedData = JSON.parse(savedData);
        totalMoney = parsedData.totalMoney;
        daysLeft = parsedData.daysLeft;
        expenses = parsedData.expenses;

        // Update the UI with the loaded data
        document.getElementById('totalMoney').value = totalMoney;
        document.getElementById('daysLeft').value = daysLeft;

        calculateAverage();

        let expenseInputs = document.querySelectorAll('#daysTable input');
        for (let i = 0; i < expenses.length && i < expenseInputs.length; i++) {
            expenseInputs[i].value = expenses[i];
        }

        updateSummary();
    }
}


