import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  id: string;
  title: string;
  value: number;
  type: string;
  category: Category;
  created_at: Date;
  updated_at: Date;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactionList = this.find();

    (await transactionList).map(transaction => {
      if (transaction.type === 'income') {
        balance.income += transaction.value;
      }
      if (transaction.type === 'outcome') {
        balance.outcome += transaction.value;
      }

      return balance;
    });
    balance.total = +balance.income - balance.outcome;

    return balance;
  }
}

export default TransactionsRepository;
