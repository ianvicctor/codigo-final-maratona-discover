const Modal = {
    open(){
      // Abrir modal
      // Adicionar a class active ao modal
      document
      .querySelector('.modal-overlay')
      .classList
      .add('active')
      
    },
    close(){
      // Fechar o modal 
      // Remover a class active do modal
      document
      .querySelector('.modal-overlay')
      .classList
      .remove('active')
    }
  }    

// Cria um Storage (espécie de banco de dados do navegador)
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
    }
}
  
// Cria um array para descrever os itens da tabela de transações.
// const transactions = 

//Cria uma variavel para a matemática das transações.
const Transaction = {
    //Refatorando a variavel Array transactions acima
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        // pegar todas as transações 
        // para cada transação,
        Transaction.all.forEach(transaction => {
            // se ela for maior que zero
            if(transaction.amount > 0 ) {
                // somar a uma variável e retornar a variável
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses() {
        let expense = 0;
        // pegar todas as transações 
        // para cada transação,
        Transaction.all.forEach(transaction => {
            // se ela for maior que zero
            if(transaction.amount < 0 ) {
                // somar a uma variável e retornar a variável
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total() {
            // entradas - saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Pega o "transactions" e coloca no HTML (substituir os dados do HTML com os dados do Javascript)
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
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
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação ">
              </td>
        `

        return html
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`  
    },

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
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            // recebendo os valores 
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getValues()
            // verificar se todas as informações foram preenchidas
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {      
                throw new Error("Por favor, preencha todos os campos")
            }
    },  

    // formatar os dados para salvar
    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date 
        }
    },
    
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {        
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            // salvar
            Transaction.add(transaction)
            // apagar os dados do formulário
            Form.clearFields()
            // modal feche
            Modal.close()
            // atualizar a aplicação   
            //Já tem um app.reload no add.transaction
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {

        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        
        DOM.updateBalance()  

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()