import Transaction from '../models/Transaction';

import groupBy from '../utils/array/groupBy';

import isObjectEmpty from '../utils/object/isEmpty';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    // Group Transactions by type (income | outcome)
    const transactionsGroupByType = groupBy(this.transactions, 'type');

    let income = 0;
    let outcome = 0;
    let total = 0;

    // Check if object is empty
    if (isObjectEmpty(transactionsGroupByType)) {
      return { income, outcome, total };
    }

    // Calculate income | outcome
    Object.entries(transactionsGroupByType).forEach(([key, value]) => {
      switch (key) {
        case 'income':
          income = value.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.value;
          }, 0);
          break;
        case 'outcome':
          outcome = value.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.value;
          }, 0);
          break;
        default:
          break;
      }
    });

    // Calculate the total value
    total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
