import React from 'react';
import WalletTransactionList from '../../../Components/Users/WalletTransactions';
import { WalletBalanceApi, WalletTransactionListApi } from '../../../api/walletApi';

const PsychologistWallet = () => {
  return (<WalletTransactionList role="psycholoigist" 
    TransactionApi={WalletTransactionListApi} WalletBalanceApi={WalletBalanceApi}/>)
};

export default PsychologistWallet;
