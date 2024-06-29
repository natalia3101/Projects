describe('Initial load', () => {
    it('should hide category selectors on initial load', () => {
        document.body.innerHTML = `<select id="type"><option></option></select>
                                 <select id="category_income" style="display:none;"></select>
                                 <select id="category_expense" style="display:none;"></select>`;
        require('./script'); // Имитация загрузки скрипта
        expect(document.getElementById('category_income').style.display).toBe('none');
        expect(document.getElementById('category_expense').style.display).toBe('none');
    });
});

describe('User interaction', () => {
    it('should display the correct category selector when type is chosen', () => {
        document.body.innerHTML = `<select id="type"><option value="income">Income</option>
                                 <option value="expense">Expense</option></select>
                                 <select id="category_income" style="display:none;"></select>
                                 <select id="category_expense" style="display:none;"></select>`;
        require('./script'); // Подключаем скрипт, который добавляет обработчики событий
        const typeSelector = document.getElementById('type');
        typeSelector.value = 'income';
        typeSelector.dispatchEvent(new Event('change'));
        expect(document.getElementById('category_income').style.display).toBe('');
        expect(document.getElementById('category_expense').style.display).toBe('none');
    });
});

describe('Transaction management', () => {
    it('should add a new transaction correctly', () => {
        const { addTransaction, getTransactions } = require('./transactions');
        const newTransaction = { id: 1, amount: 100, type: 'income' };
        addTransaction(newTransaction);
        const transactions = getTransactions();
        expect(transactions).toContainEqual(newTransaction);
    });

    it('should delete a transaction correctly', () => {
        const { deleteTransaction, getTransactions, saveTransactions } = require('./transactions');
        saveTransactions([{ id: 1, amount: 100, type: 'income' }]);
        deleteTransaction(1);
        const transactions = getTransactions();
        expect(transactions).toEqual([]);
    });
});