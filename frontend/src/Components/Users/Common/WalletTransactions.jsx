import React, { useEffect, useState } from "react";
import { Wallet,ArrowDown,ArrowUp,Eye,EyeOff,TrendingUp,TrendingDown,AlertCircle,} from "lucide-react";
import ErrorHandler from "../../Layouts/ErrorHandler";
import Pagination from "../../Layouts/Pagination";
import Loading from "../../Layouts/Loading";
import UserSidebar from "../User/UserSidebar";
import PsychologistSidebar from "../Psychologist/PsychologistSidebar";
import Navbar from "./Navbar";
import { CheckPendingPayoutApi,PayoutApi,} from "../../../api/walletApi";
import { toast } from "react-toastify";
import BankDetailsModal from "../../Admin/BankDetailsModal";

const WalletComponent = ({ role, TransactionApi, WalletBalanceApi }) => {
  const [walletData, setWalletData] = useState({
    actualBalance: 0,
    lockedBalance: 0,
    bankDetails: null,
  });

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [transactionType, setTransactionType] = useState("all");
  const [showBalance, setShowBalance] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    bank_account_no: "",
    ifsc_code: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPendingPayout, setHasPendingPayout] = useState(false);

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amt || 0);

  
  const fetchWalletBalance = async () => {
    try {
      if (!WalletBalanceApi) return;

      const data = await WalletBalanceApi();

      setWalletData({
        actualBalance: data.balance || 0,
        lockedBalance: data.locked_balance || 0,
        bankDetails: data.bank_details || null,
      });

      setFormData((prev) => ({
        ...prev,
        bank_account_no: data.bank_details?.bank_account_no || "",
        ifsc_code: data.bank_details?.ifsc_code || "",
      }));
    } catch (error) {
      ErrorHandler(error);
    }
  };
  const fetchTransactions = async (page = currentPage) => {
    setIsLoading(true);
    try {
      const typeParam = transactionType !== "all" ? transactionType : undefined;
      const data = await TransactionApi(page, typeParam);

      setTransactions(data.results || []);
      setTotalPages(Math.ceil((data.count || 1) / 10));
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPending = async () => {
    try {
      const data = await CheckPendingPayoutApi();
      setHasPendingPayout(data?.has_pending || false);
    } catch (error) {
      ErrorHandler(error)
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions();
    checkPending();
  }, [currentPage, transactionType]);

  useEffect(() => {
    if (!isModalOpen) checkPending();
  }, [isModalOpen]);

  const handlePayout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.amount || formData.amount <= 0) {
      toast.error("Enter a valid payout amount");
      setIsSubmitting(false);
      return;
    }

    if (formData.amount > walletData.actualBalance) {
      toast.error("Insufficient balance");
      setIsSubmitting(false);
      return;
    }

    try {
      await PayoutApi(formData);
      toast.success("Payout request submitted successfully");
      setIsModalOpen(false);
      setHasPendingPayout(true);

      fetchWalletBalance();
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Loading isLoading={isLoading}>
      <div className="min-h-screen bg-gray-50 pt-16">
        <Navbar />

        <div className="ml-0 lg:ml-64 transition-all duration-300">
          {role === "user" ? <UserSidebar /> : <PsychologistSidebar />}

          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-8 w-8 text-blue-600" />
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Wallet
                      </h1>
                      <p className="text-gray-600">Manage your transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBalance((prev) => !prev)}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    {showBalance ? <EyeOff /> : <Eye />}
                    <span className="text-sm">
                      {showBalance ? "Hide" : "Show"}
                    </span>
                  </button>
                </div>
                <div
                  className={`grid gap-6 ${
                    role === "user"
                      ? "grid-cols-1 max-w-md mx-auto"
                      : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  <div className="bg-green-600 p-6 rounded-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-100 text-sm">
                        Available Balance
                      </span>
                      <TrendingUp />
                    </div>
                    <p className="text-2xl font-bold">
                      {showBalance
                        ? formatCurrency(walletData.actualBalance)
                        : "••••••"}
                    </p>
                  </div>

                  {role !== "user" && (
                    <>
                      <div className="bg-orange-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-orange-100 text-sm">
                            Locked Balance
                          </span>
                          <TrendingDown />
                        </div>
                        <p className="text-2xl font-bold">
                          {showBalance
                            ? formatCurrency(walletData.lockedBalance)
                            : "••••••"}
                        </p>
                        <p className="text-orange-200 text-xs mt-1">
                          Pending transactions
                        </p>
                      </div>

                      <div className="flex justify-end items-center">
                        <button
                          onClick={() => {
                            if (!hasPendingPayout) setIsModalOpen(true);
                          }}
                          disabled={hasPendingPayout}
                          className="px-3 py-2 bg-blue-100  rounded-lg hover:bg-blue-200 font-bold disabled:opacity-50"
                        >
                          {hasPendingPayout ? "Pending..." : "Payout"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Transaction History
                  </h2>

                  <select
                    value={transactionType}
                    onChange={(e) => {
                      setTransactionType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="credit">Credits</option>
                    <option value="debit">Debits</option>
                  </select>
                </div>

                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              tx.transaction_type === "credit"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {tx.transaction_type === "credit" ? (
                              <ArrowDown className="text-green-600" />
                            ) : (
                              <ArrowUp className="text-red-600" />
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900">
                              {tx.description || "Transaction"}
                            </p>
                            {tx.name && (
                              <p className="text-sm text-gray-500">{tx.name}</p>
                            )}
                          </div>
                        </div>

                        <p
                          className={`font-semibold ${
                            tx.transaction_type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {tx.transaction_type === "credit" ? "+" : "-"}
                          {formatCurrency(tx.amount)}
                        </p>
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

      <BankDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        walletData={walletData}
        hasPendingPayout={hasPendingPayout}
        fromData={formData}
        setFromData={setFormData}
        handlePayout={handlePayout}
        isSubmitting={isSubmitting}
      />
    </Loading>
  );
};

export default WalletComponent;
