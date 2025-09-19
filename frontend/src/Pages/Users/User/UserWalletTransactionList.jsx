import React from 'react';
import WalletTransactionList from '../../../Components/Users/WalletTransactions';
import { WalletTransactionListApi } from '../../../api/walletApi';
import { WalletBalanceApi } from '../../../api/walletApi';

const UserWalletTransactionList = () => {
  return (<WalletTransactionList role="user" 
    TransactionApi={WalletTransactionListApi} WalletBalanceApi={WalletBalanceApi}/>)
};

export default UserWalletTransactionList;
