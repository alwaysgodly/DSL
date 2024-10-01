let transactions = [];

function updateDashboard() {
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const balance = totalIncome - totalExpenses;

    document.getElementById('income').innerText = `Income: ₹${totalIncome.toFixed(2)}`;
    document.getElementById('expenses').innerText = `Expenses: ₹${totalExpenses.toFixed(2)}`;
    document.getElementById('balance').innerText = `Balance: ₹${balance.toFixed(2)}`;
}

function addTransaction(event) {
    event.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    let domain = '';
    if (type === 'expense') {
        domain = document.getElementById('domain').value;
    }

    if (description.trim() === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    const transaction = {
        id: Date.now(),
        type,
        domain,
        description,
        amount
    };

    transactions.push(transaction);
    addTransactionToList(transaction);
    updateDashboard();

    document.getElementById('transaction-form').reset();
    toggleDomainSelection();
}

function addTransactionToList(transaction) {
    const list = document.getElementById('transaction-list');
    const listItem = document.createElement('li');
    listItem.classList.add(transaction.type === 'income' ? 'income-item' : 'expense-item');

    listItem.innerHTML = `
        ${transaction.description} - ₹${transaction.amount.toFixed(2)} ${transaction.type === 'expense' ? `(${transaction.domain})` : ''}
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
        <button onclick="removeTransaction(${transaction.id})">Remove</button>
    `;

    list.appendChild(listItem);
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    renderTransactionList();
    updateDashboard();
}

function editTransaction(id) {
    const transaction = transactions.find(transaction => transaction.id === id);

    document.getElementById('type').value = transaction.type;
    if (transaction.type === 'expense') {
        document.getElementById('domain').value = transaction.domain;
    }
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;

    removeTransaction(id);
    toggleDomainSelection();
}

function renderTransactionList() {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    transactions.forEach(addTransactionToList);
}

function toggleDomainSelection() {
    const type = document.getElementById('type').value;
    const expenseDomains = document.getElementById('expense-domains');

    if (type === 'expense') {
        expenseDomains.style.display = 'block';
    } else {
        expenseDomains.style.display = 'none';
    }
}

document.getElementById('transaction-form').addEventListener('submit', addTransaction);
document.getElementById('type').addEventListener('change', toggleDomainSelection);
