document.addEventListener('DOMContentLoaded', init);
document.addEventListener('DOMContentLoaded', function() {
    const typeSelector = document.getElementById('type');
    const categoryIncome = document.getElementById('category_income');
    const categoryExpense = document.getElementById('category_expense');

    // Изначально скрываем оба списка категорий, пока не выбран тип
    categoryIncome.style.display = 'none';
    categoryExpense.style.display = 'none';

    typeSelector.addEventListener('change', function() {
        // Показываем или скрываем списки категорий в зависимости от выбранного типа
        if (this.value === 'income') {
            categoryIncome.style.display = '';
            categoryExpense.style.display = 'none';
        } else if (this.value === 'expense') {
            categoryIncome.style.display = 'none';
            categoryExpense.style.display = '';
        } else {
            // Если тип не выбран или не определен
            categoryIncome.style.display = 'none';
            categoryExpense.style.display = 'none';
        }
    });
});

function init() {
    document.getElementById('transaction-form').addEventListener('submit', addTransaction);
    loadTransactions();
}

function populateDateFilters() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Заполнение месяцев
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1; // Месяцы начинаются с 1
        option.textContent = month;
        option.selected = index === currentMonth; // Установка текущего месяца по умолчанию
        monthSelect.appendChild(option);
    });

    // Заполнение годов
    for (let year = currentYear - 10; year <= currentYear; year++) {
        const option = new Option(year, year);
        option.selected = year === currentYear; // Установка текущего года по умолчанию
        yearSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', populateDateFilters);

function filterByDate() {
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);

    const filteredTransactions = getTransactions().filter(transaction => {
        const date = new Date(transaction.date);
        return (month ? date.getMonth() + 1 === month : true) &&
            (year ? date.getFullYear() === year : true);
    });

    displayTransactions(filteredTransactions);
}

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000); // Создаёт уникальный ID на основе текущего времени и случайной строки
}

function addTransaction(event) {
    event.preventDefault();
    const typeSelector = document.getElementById('type');
    const typeText = typeSelector.options[typeSelector.selectedIndex].text; // Получаем текстовое описание типа
    let descriptionElement, descriptionText;
    if (typeText === 'Доход') {
        descriptionElement = document.getElementById('category_income');
    } else {
        descriptionElement = document.getElementById('category_expense');
    }
    descriptionText = descriptionElement.options[descriptionElement.selectedIndex].text; // Получаем текстовое описание категории
    const amount = parseFloat(document.getElementById('amount').value);

    const transactionId = generateId();
    const transaction = { id: transactionId, description: descriptionText, amount, type: typeText, date: new Date().toISOString() };
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);
    loadTransactions();
    document.getElementById('transaction-form').reset();
    updateCharts();
}

function loadTransactions() {
    const transactions = getTransactions();
    const tbody = document.getElementById('transactions-table').querySelector('tbody');
    tbody.innerHTML = ''; // Очистка текущего содержимого таблицы
    transactions.forEach((transaction) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = transaction.description;
        row.insertCell(1).textContent = transaction.amount.toFixed(2);
        row.insertCell(2).textContent = transaction.type;
        row.insertCell(3).textContent = new Date(transaction.date).toLocaleDateString();
        const deleteCell = row.insertCell(4);
        deleteCell.innerHTML = `<div class="delete-button" onclick="deleteTransaction('${transaction.id}')">—</div>`; // Добавление кнопки удаления
    });
    updateCharts();
}

function deleteTransaction(transactionId) {
    console.log("Deleting transaction with ID:", transactionId);
    let transactions = getTransactions();
    transactions = transactions.filter(transaction => String(transaction.id) !== String(transactionId));
    console.log("Remaining transactions:", transactions);
    saveTransactions(transactions);
    loadTransactions(); // Перезагрузка списка транзакций
    updateCharts();
}

function filterTransactions(filter) {
    const transactions = getTransactions();
    let filteredTransactions;
    if (filter === 'all') {
        filteredTransactions = transactions;
    } else if (filter === 'Доходы') {
        filteredTransactions = transactions.filter(transaction => transaction.type === 'Доход');
    } else if (filter === 'Расходы') {
        filteredTransactions = transactions.filter(transaction => transaction.type === 'Расход');
    }
    displayTransactions(filteredTransactions);
}

function displayTransactions(transactions) {
    const tbody = document.getElementById('transactions-table').querySelector('tbody');
    const noDataMessage = document.getElementById('no-data-message');
    const chartsContainer = document.getElementById('statistics');
    const filtersContainer = document.getElementById('filters');
    const addContainer = document.getElementById('transaction-form');


    tbody.innerHTML = '';

    if (transactions.length > 0) {
        transactions.forEach(transaction => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = transaction.description;
            row.insertCell(1).textContent = transaction.amount.toFixed(2);
            row.insertCell(2).textContent = transaction.type;
            row.insertCell(3).textContent = new Date(transaction.date).toLocaleDateString();

            const deleteCell = row.insertCell(4);
            deleteCell.innerHTML = `<div class="delete-button" onclick="deleteTransaction('${transaction.id}')">—</div>`;
        });
        document.getElementById('transactions-table').style.display = 'table'; // Показываем таблицу
        chartsContainer.style.display = 'block'; // Показываем графики
        noDataMessage.style.display = 'none'; // Скрываем сообщение
        filtersContainer.style.display = 'block';
        addContainer.style.display = 'block';
    } else {
        document.getElementById('transactions-table').style.display = 'none'; // Скрываем таблицу
        chartsContainer.style.display = 'none'; // Скрываем графики
        noDataMessage.style.display = 'block'; // Показываем сообщение
        filtersContainer.style.display = 'none';
        addContainer.style.display = 'none';
    }
}

function calculateTotals() {
    const transactions = getTransactions();
    const totals = transactions.reduce((acc, curr) => {
        const key = curr.type;
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += curr.amount;
        return acc;
    }, {});
    displayTotals(totals);
    updateCharts(totals);
}

function updateCharts() {
    const transactions = getTransactions();
    const incomeData = calculateCategoryTotalsByType(transactions, 'Доход');
    const expenseData = calculateCategoryTotalsByType(transactions, 'Расход');

    // Вычисление общих сумм доходов и расходов
    const totalIncome = Object.values(incomeData).reduce((sum, value) => sum + value, 0);
    const totalExpense = Object.values(expenseData).reduce((sum, value) => sum + value, 0);

    if (window.incomeChart && typeof window.incomeChart.destroy === 'function') {
        window.incomeChart.destroy();
    }
    if (window.expenseChart && typeof window.expenseChart.destroy === 'function') {
        window.expenseChart.destroy();
    }
    if (window.incomeExpenseChart && typeof window.incomeExpenseChart.destroy === 'function') {
        window.incomeExpenseChart.destroy();
    }

    // Создание столбчатой диаграммы для общего обзора доходов и расходов
    window.incomeExpenseChart = new Chart(document.getElementById('incomeExpenseChart'), {
        type: 'bar',
        data: {
            labels: ['Доходы', 'Расходы'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: ['#96a483', '#bab57b']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Создание круговых диаграмм для доходов и расходов по категориям
    window.incomeChart = new Chart(document.getElementById('incomeChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(incomeData),
            datasets: [{
                label: 'Доходы по категориям',
                data: Object.values(incomeData),
                backgroundColor: ['#FFC0CB', '#FFD6E0', '#FFE4ED', '#FFB6C1', '#FFDAE9']
            }]
        }
    });

    window.expenseChart = new Chart(document.getElementById('expenseChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(expenseData),
            datasets: [{
                label: 'Расходы по категориям',
                data: Object.values(expenseData),
                backgroundColor: ['#D4B1AA', '#BF7D6C', '#873D17', '#E1C9C1', '#CCA08B', '#B3856B', '#996655', '#AF6E4D', '#8C5035', '#723422', '#DDBBAA', '#CBA291', '#B28070', '#996157', '#774F3E', '#E2D4C8', '#F0E6DE', '#DDBB99', '#C7A785']
            }]
        }
    });


}


function calculateCategoryTotalsByType(transactions, type) {
    return transactions.filter(transaction => transaction.type === type)
        .reduce((acc, transaction) => {
            const key = transaction.description; // Используем описание как категорию
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += transaction.amount;
            return acc;
        }, {});
}

function displayTotals(totals) {
    console.log(`Total Income: ${totals.income.toFixed(2)}`);
    console.log(`Total Expenses: ${totals.expense.toFixed(2)}`);
}