import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    // Check if type is income | outcome
    if (!['income', 'outcome'].includes(type)) {
      throw Error('type must be income or outcome');
    }

    // Check the balance before create a new transaction
    if (type === 'outcome' && value > total) {
      throw Error(
        "It wasn't possible to create a new transaction. Please, check if you have enough credit before proceed with this action.",
      );
    }
    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
