import React, { useEffect, useState } from 'react'
import { Wallet, ArrowDown, ArrowUp, Eye, EyeOff, TrendingUp,TrendingDown,AlertCircle
} from 'lucide-react'
import ErrorHandler from '../Layouts/ErrorHandler'
import Pagination from '../Layouts/Pagination'
import Loading from '../Layouts/Loading'
import UserSidebar from './User/UserSidebar'
import PsychologistSidebar from './Psychologist/PsychologistSidebar'
import Navbar from './Navbar'

const WalletComponent = ({ role, TransactionApi, WalletBalanceApi }) => {
  const [walletData, setWalletData] = useState({
    actualBalance: 0,
    lockedBalance: 0
  });
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [transactionType, setTransactionType] = useState('all')
  const [showBalance, setShowBalance] = useState(true)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0)
  };

  const fetchWalletBalance = async () => {
    try {
      if (WalletBalanceApi) {
        const data = await WalletBalanceApi();
        setWalletData({
          actualBalance: data.balance || 0,
          lockedBalance: data.locked_balance || 0
        });
      }
    } catch (error) {
      ErrorHandler(error);
    }
  };

  const fetchTransactions = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const params = transactionType !== 'all' ? transactionType : undefined;
      const data = await TransactionApi(page, params);
      setTransactions(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
  }, [currentPage, transactionType]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleTypeFilter = (type) => {
    setTransactionType(type);
    setCurrentPage(1);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gray-50 flex">
        {role === 'user' ? <UserSidebar /> : <PsychologistSidebar />}
        <div className="flex-1 lg:ml-64">
          <Navbar />
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-8 w-8 text-blue-600" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
                      <p className="text-gray-600">Manage your transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-sm">{showBalance ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                <div className={`grid gap-6 ${role === 'user' ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                  <div className="bg-green-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-100 text-sm">Available Balance</span>
                      <TrendingUp className="h-5 w-5 text-green-200" />
                    </div>
                    <p className="text-2xl font-bold">
                      {showBalance ? formatCurrency(walletData.actualBalance) : '••••••'}
                    </p>
                  </div>

                  {role !== 'user' && (
                    <div className="bg-orange-600 p-6 rounded-lg text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-100 text-sm">Locked Balance</span>
                        <TrendingDown className="h-5 w-5 text-orange-200" />
                      </div>
                      <p className="text-2xl font-bold">
                        {showBalance ? formatCurrency(walletData.lockedBalance) : '••••••'}
                      </p>
                      <p className="text-orange-200 text-xs mt-1">Pending transactions</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                  
                  <select
                    value={transactionType}
                    onChange={(e) => handleTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Transactions</option>
                    <option value="credit">Credits</option>
                    <option value="debit">Debits</option>
                  </select>
                </div>

                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            tx.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {tx.transaction_type === 'credit' ? (
                              <ArrowDown className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowUp className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {tx.description || 'Transaction'}
                            </p>
                            {tx.name && (
                              <p className="text-sm text-gray-500">{tx.name}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className={`font-semibold ${
                            tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {tx.transaction_type === 'credit' ? '+' : '-'}
                            {formatCurrency(tx.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Balance: {formatCurrency(tx.balance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions found</p>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default WalletComponent