import React, { useEffect, useState } from 'react';
import { WalletTransactionListApi } from '../../../api/walletApi';
import ErrorHandler from '../../../Components/Layouts/ErrorHandler';
import Pagination from '../../../Components/Layouts/Pagination';
import Loading from '../../../Components/Layouts/Loading';
import UserSidebar from '../../../Components/Users/User/UserSidebar';
import Navbar from '../../../Components/Users/Navbar';
import { ArrowDown, ArrowUp, Wallet, AlertCircle } from 'lucide-react';

const WalletTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState('credit');
  const page_size = 6;

  const FetchTransactions = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const data = await WalletTransactionListApi(page, type);
      setTransactions(data.results);
      setTotalPages(Math.ceil(data.count / page_size));
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FetchTransactions();
  }, [currentPage, type]);

  const handlePageChange = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCurrentPage(1);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gray-100 flex">
        <UserSidebar />
        <div className="flex-1 lg:ml-64 transition-all duration-300">
          <Navbar />
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
                <Wallet className="h-7 w-7 text-teal-600 mr-2" />
                Wallet Transactions
              </h2>

              {/* Filter Tabs */}
              <div className="mb-6 flex flex-wrap gap-3">
                {['credit', 'debit'].map((txType) => (
                  <button
                    key={txType}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                      ${type === txType
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md hover:from-teal-600 hover:to-teal-700'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    onClick={() => handleTypeChange(txType)}
                  >
                    {txType.charAt(0).toUpperCase() + txType.slice(1)}
                  </button>
                ))}
              </div>

              {/* Transactions List */}
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl shadow flex items-center justify-between"
                    >
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{tx.description || 'No Reason Provided'}</div>
                        <div className="text-sm text-gray-500">Balance: ₹{tx.balance}</div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center justify-end text-xl font-bold ${
                            tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.transaction_type === 'credit' ? (
                            <ArrowDown className="w-5 h-5 mr-1" />
                          ) : (
                            <ArrowUp className="w-5 h-5 mr-1" />
                          )}
                          ₹{tx.amount}
                        </div>
                        <div className="text-xs text-gray-400 uppercase">{tx.transaction_type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white shadow-lg rounded-xl flex flex-col items-center justify-center">
                  <AlertCircle className="h-20 w-20 text-gray-300 mb-6" />
                  <p className="text-gray-700 text-xl font-medium mb-2">No {type} transactions found.</p>
                  <p className="text-gray-500 text-base">Try switching the filter or check back later.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
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
    </Loading>
  );
};

export default WalletTransactionList;
