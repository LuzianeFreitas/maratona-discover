const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("transactions", JSON.stringify(transactions))
    }
}

/* const transactions = [
    {
        description: 'Luz',
        amount: -50000,
        date: '02/01/2021',
    },
    {
        description: 'Criação de Website',
        amount: 500000,
        date: '02/01/2021',
    },
    {
        description: 'Internet',
        amount: -20000,
        date: '02/01/2021',
    },
]
*/

const Transaction = {
    // Atalho de todas as transações
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes() {
        let income = 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })
        return income
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })
        return expense
    },
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    // index é a posição do array no qual a transação está guardada
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `

                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                </td>
        `

        return html
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    },
    formatAmount(value) {
        value = Number(value) * 100

        return Math.round(value)
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        // `` -> template literals
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    validateFields() {
        // Desestruturação
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor preencha todos os campos!!")
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            // Verifica se os campos estão vazios
            Form.validateFields()

            // Formata os valores dos campos para salvar
            const transaction = Form.formatValues()

            // Salva os valores
            Form.saveTransaction(transaction)

            // Limpa os campos depois de salvar
            Form.clearFields()

            // Fechar o modal
            Modal.close()

            // Atualizando a aplicação
            // App.reload()
        } catch (error) {
            // Modificar depois para modal
            alert(error.message)
            // let message = error.message
            // if (message === "Por favor preencha todos os campos!!")
            //     ModalAlert.openModal(message)

        }

    }
}

const ModalAlert = {
    openModal(message) {
        document.querySelector('.modal-message').classList.add('active')

        const p = document.createElement('p')
        p.innerHTML = message
        document.getElementById('modal').appendChild(p)
    },
    closeModal() {
        document.querySelector('.modal-message').classList.remove('active')

        let nodes = document.getElementsByTagName("p");

        for (let i = 0, len = nodes.length; i != len; ++i) {
            nodes[0].parentNode.removeChild(nodes[0]);
        }

    }
}

const App = {
    init() {
        // addTransaction é passada como um atalho
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()

// Transaction.add({
//     description: 'Mercado',
//     amount: -10000,
//     date: '03/01/2021',
// })

//Transaction.remove(3)

// Storage.get()