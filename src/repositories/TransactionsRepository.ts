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
      return { income: 0, outcome: 0, total: 0 };
    }

    // Check if income was grouped
    if (transactionsGroupByType.income) {
      // Use reducer to sum accumulated values of income
      income = transactionsGroupByType.income.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.value;
        },
        0,
      );
    }

    // Check if outcome was grouped
    if (transactionsGroupByType.outcome) {
      // Use reducer to sum accumulated values of outcome
      outcome = transactionsGroupByType.outcome.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.value;
        },
        0,
      );
    }

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
