"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, Loader2, Undo2, XCircle } from "lucide-react";

import {
  fetchTransactions, fetchExpenses, fetchFinancialSummary,
  fetchCashFlowReports, fetchProfitLossReports,
  approveExpense, payExpense, rejectExpense,
  reconcileTransaction, reverseTransaction,
  fetchCategoryWiseExpense, fetchMonthlyComparison, fetchShopWiseReport,
} from "@/redux/actions/financeActions";
import { invalidateSummary } from "@/redux/slices/financeSlice";

import { FinanceFilter } from "@/components/filters/FinanceFilter";
import { TransactionTable } from "@/components/tables/TransactionTable";
import { ExpenseTable } from "@/components/tables/ExpenseTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { FinanceStats } from "@/components/cards/statCards/FinanceStats";
import { DailyTrendChart, MonthlyComparisonChart } from "@/components/charts/FinanceCharts";
import { ExpenseModal } from "@/components/modals/addUpdate/ExpenseModal";
import { TransactionModal } from "@/components/modals/addUpdate/TransactionModal";
import { TransactionViewModal } from "@/components/modals/view/TransactionViewModal";
import { GenerateReportModal } from "@/components/modals/addUpdate/GenerateReportModal";
import { ExpenseViewModal } from "@/components/modals/view/ExpenseViewModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";
import { BaseModal } from "@/components/modals/BaseModal";

const ITEMS_PER_PAGE = 15;

const initialTxnFilters = {
  search: "", type: [], paymentMethod: [], isReconciled: [], startDate: "", endDate: "",
};
const initialExpFilters = {
  search: "", status: [], category: [], paymentMethod: [], startDate: "", endDate: "",
};

function buildTxnParams(filters, page) {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.type?.length) params.type = filters.type.join(",");
  if (filters.paymentMethod?.length) params.paymentMethod = filters.paymentMethod.join(",");
  if (filters.isReconciled?.length) params.isReconciled = filters.isReconciled[0];
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return params;
}

function buildExpParams(filters, page) {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.status?.length) params.status = filters.status.join(",");
  if (filters.category?.length) params.category = filters.category.join(",");
  if (filters.paymentMethod?.length) params.paymentMethod = filters.paymentMethod.join(",");
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return params;
}

export default function FinancePage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("transactions");
  const [txnFilters, setTxnFilters] = useState(initialTxnFilters);
  const [expFilters, setExpFilters] = useState(initialExpFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);
  const [reportModal, setReportModal] = useState({ isOpen: false, type: "CASH_FLOW" });
  const [viewTxn, setViewTxn] = useState({ isOpen: false, data: null });
  const [viewExpense, setViewExpense] = useState({ isOpen: false, data: null });
  const [reconcileModal, setReconcileModal] = useState({ isOpen: false, txn: null, loading: false });
  const [reverseModal, setReverseModal] = useState({ isOpen: false, txn: null, reason: "", loading: false });
  const [approveModal, setApproveModal] = useState({ isOpen: false, exp: null, loading: false });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, exp: null, reason: "", loading: false });

  const debounceTimer = useRef(null);
  const initialFetchDone = useRef(false);
  const skipNextPageEffect = useRef(true);
  const activeTabRef = useRef("transactions");
  const txnFiltersRef = useRef(initialTxnFilters);
  const expFiltersRef = useRef(initialExpFilters);
  const pageRef = useRef(1);

  const { transactions, expenses, reports } = useSelector((state) => state.finance);

  const runFetch = useCallback((tab, page, txnF, expF) => {
    if (tab === "transactions") {
      dispatch(fetchTransactions(buildTxnParams(txnF, page)));
    } else if (tab === "expenses") {
      dispatch(fetchExpenses(buildExpParams(expF, page)));
    } else if (tab === "charts") {
      dispatch(fetchCategoryWiseExpense());
      dispatch(fetchMonthlyComparison());
      dispatch(fetchShopWiseReport());
    } else if (tab === "reports") {
      dispatch(fetchCashFlowReports());
      dispatch(fetchProfitLossReports());
    }
  }, [dispatch]);

  useEffect(() => { txnFiltersRef.current = txnFilters; }, [txnFilters]);
  useEffect(() => { expFiltersRef.current = expFilters; }, [expFilters]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;
    skipNextPageEffect.current = true;
    dispatch(fetchFinancialSummary());
    runFetch("transactions", 1, initialTxnFilters, initialExpFilters);
  }, []);

  useEffect(() => {
    if (!reports.summaryInitialized && !reports.summaryLoading && initialFetchDone.current) {
      dispatch(fetchFinancialSummary());
    }
  }, [reports.summaryInitialized]);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(activeTabRef.current, currentPage, txnFiltersRef.current, expFiltersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!initialFetchDone.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(activeTab, 1, txnFiltersRef.current, expFiltersRef.current);
  }, [activeTab]);

  useEffect(() => {
    if (!initialFetchDone.current) return;
    if (activeTabRef.current !== "transactions") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      dispatch(fetchTransactions(buildTxnParams(txnFilters, 1)));
    }, 300);
  }, [
    txnFilters.search, txnFilters.type, txnFilters.paymentMethod,
    txnFilters.isReconciled, txnFilters.startDate, txnFilters.endDate,
  ]);

  useEffect(() => {
    if (!initialFetchDone.current) return;
    if (activeTabRef.current !== "expenses") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      dispatch(fetchExpenses(buildExpParams(expFilters, 1)));
    }, 300);
  }, [
    expFilters.search, expFilters.status, expFilters.category,
    expFilters.paymentMethod, expFilters.startDate, expFilters.endDate,
  ]);

  const refreshCurrentTab = useCallback(() => {
    runFetch(
      activeTabRef.current,
      pageRef.current,
      txnFiltersRef.current,
      expFiltersRef.current
    );
  }, [runFetch]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleClearTxnFilters = () => {
    setTxnFilters(initialTxnFilters);
    setCurrentPage(1);
  };

  const handleClearExpFilters = () => {
    setExpFilters(initialExpFilters);
    setCurrentPage(1);
  };

  const handleExpenseModalClose = (didSave) => {
    setAddExpenseOpen(false);
    if (didSave) refreshCurrentTab();
  };

  const handleTransactionModalClose = (didSave) => {
    setAddTransactionOpen(false);
    if (didSave) refreshCurrentTab();
  };

  const confirmReconcile = async () => {
    setReconcileModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(
        reconcileTransaction({ id: reconcileModal.txn._id, data: { notes: "Admin Reconciled" } })
      ).unwrap();
      toast.success(t("reconciledSuccess"));
      setReconcileModal({ isOpen: false, txn: null, loading: false });
    } catch {
      toast.error(t("reconcileFailed"));
      setReconcileModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const confirmReverse = async () => {
    setReverseModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(
        reverseTransaction({ id: reverseModal.txn._id, data: { reason: reverseModal.reason } })
      ).unwrap();
      toast.success(t("reversedSuccess"));
      setReverseModal({ isOpen: false, txn: null, reason: "", loading: false });
    } catch {
      toast.error(t("reverseFailed"));
      setReverseModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const confirmApprove = async () => {
    setApproveModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(approveExpense(approveModal.exp._id)).unwrap();
      toast.success(t("expenseApproved"));
      setApproveModal({ isOpen: false, exp: null, loading: false });
    } catch {
      toast.error(t("approveFailed"));
      setApproveModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const confirmReject = async () => {
    setRejectModal((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(
        rejectExpense({ id: rejectModal.exp._id, data: { reason: rejectModal.reason } })
      ).unwrap();
      toast.success(t("expenseRejected"));
      setRejectModal({ isOpen: false, exp: null, reason: "", loading: false });
    } catch {
      toast.error(t("rejectFailed"));
      setRejectModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePayExpense = async (exp) => {
    try {
      await dispatch(
        payExpense({ id: exp._id, data: { amount: exp.dueAmount, paymentMethod: "BANK_TRANSFER" } })
      ).unwrap();
      toast.success(t("expensePaid"));
    } catch {
      toast.error(t("paymentFailed"));
    }
  };

  if (!initialFetchDone.current && transactions.loading && !transactions.items.length) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <FinanceStats summary={reports.summary?.summary} />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide w-full xl:w-auto">
          {[
            { id: "transactions", labelKey: "transactions" },
            { id: "expenses", labelKey: "expenses" },
            { id: "charts", labelKey: "chartsAnalytics" },
            { id: "reports", labelKey: "financialReports" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === "transactions" && (
            <button
              type="button"
              onClick={() => setAddTransactionOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">
                {t("logTransaction")}
              </span>
            </button>
          )}
          {activeTab === "expenses" && (
            <button
              type="button"
              onClick={() => setAddExpenseOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black tracking-widest">
                {t("logExpense")}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "transactions" && (
          <>
            <FinanceFilter
              type="transaction"
              filters={txnFilters}
              setFilters={setTxnFilters}
              onClear={handleClearTxnFilters}
            />
            <TransactionTable
              data={transactions.items}
              loading={transactions.loading}
              onView={(item) => setViewTxn({ isOpen: true, data: item })}
              onReconcile={(txn) => setReconcileModal({ isOpen: true, txn, loading: false })}
              onReverse={(txn) =>
                setReverseModal({ isOpen: true, txn, reason: "", loading: false })
              }
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={transactions.pagination?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "expenses" && (
          <>
            <FinanceFilter
              type="expense"
              filters={expFilters}
              setFilters={setExpFilters}
              onClear={handleClearExpFilters}
            />
            <ExpenseTable
              data={expenses.items}
              loading={expenses.loading}
              onView={(item) => setViewExpense({ isOpen: true, data: item })}
              onApprove={(exp) => setApproveModal({ isOpen: true, exp, loading: false })}
              onReject={(exp) =>
                setRejectModal({ isOpen: true, exp, reason: "", loading: false })
              }
              onPay={handlePayExpense}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={expenses.pagination?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "charts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyComparisonChart
                data={reports.monthlyComparison}
                loading={reports.monthlyLoading}
              />
              <DailyTrendChart
                data={reports.summary?.dailyTrend}
                loading={reports.summaryLoading}
              />
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#E9B10C]">
                  {t("cashFlowReports")}
                </h3>
                <button
                  type="button"
                  onClick={() => setReportModal({ isOpen: true, type: "CASH_FLOW" })}
                  className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase font-bold rounded-sm hover:bg-[#E9B10C] transition-colors"
                >
                  + {t("generateNew")}
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-64 scrollbar-hide">
                {reports.cashFlowLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-[#E9B10C]" />
                  </div>
                ) : !reports.cashFlow?.length ? (
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center py-6">
                    {t("noReportsGenerated")}
                  </p>
                ) : (
                  reports.cashFlow.map((r) => (
                    <div
                      key={r._id}
                      className="py-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center hover:bg-white dark:hover:bg-[#111111] px-2 rounded-sm cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="block text-[10px] font-bold uppercase">
                          {r.reportNumber}
                        </span>
                        <span className="text-[8px] font-bold text-neutral-500 block">
                          {new Date(r.startDate).toLocaleDateString()} -{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black flex items-center gap-1 ${
                          r.netCashFlow >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ⃁ {r.netCashFlow?.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="p-6 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#E9B10C]">
                  {t("profitLossStatements")}
                </h3>
                <button
                  type="button"
                  onClick={() => setReportModal({ isOpen: true, type: "PROFIT_LOSS" })}
                  className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase font-bold rounded-sm hover:bg-[#E9B10C] transition-colors"
                >
                  + {t("generateNew")}
                </button>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-64 scrollbar-hide">
                {reports.profitLossLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 size={20} className="animate-spin text-[#E9B10C]" />
                  </div>
                ) : !reports.profitLoss?.length ? (
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center py-6">
                    {t("noStatementsGenerated")}
                  </p>
                ) : (
                  reports.profitLoss.map((r) => (
                    <div
                      key={r._id}
                      className="py-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center hover:bg-white dark:hover:bg-[#111111] px-2 rounded-sm cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="block text-[10px] font-bold uppercase">
                          {r.reportNumber}
                        </span>
                        <span className="text-[8px] font-bold text-neutral-500 block">
                          {new Date(r.startDate).toLocaleDateString()} -{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black flex items-center gap-1 ${
                          r.netProfitAfterTax >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ⃁ {r.netProfitAfterTax?.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ExpenseModal isOpen={isAddExpenseOpen} onClose={handleExpenseModalClose} />
      <TransactionModal isOpen={isAddTransactionOpen} onClose={handleTransactionModalClose} />
      <TransactionViewModal
        isOpen={viewTxn.isOpen}
        onClose={() => setViewTxn({ isOpen: false, data: null })}
        data={viewTxn.data}
      />
      <ExpenseViewModal
        isOpen={viewExpense.isOpen}
        onClose={() => setViewExpense({ isOpen: false, data: null })}
        data={viewExpense.data}
      />
      <GenerateReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, type: "CASH_FLOW" })}
        reportType={reportModal.type}
        onSuccess={() => {
          dispatch(fetchCashFlowReports());
          dispatch(fetchProfitLossReports());
        }}
      />

      <ConfirmationModal
        isOpen={reconcileModal.isOpen}
        onClose={() => setReconcileModal({ ...reconcileModal, isOpen: false })}
        onConfirm={confirmReconcile}
        loading={reconcileModal.loading}
        message={t("confirmReconcileMessage")}
      />

      <BaseModal
        isOpen={reverseModal.isOpen}
        onClose={() => setReverseModal({ ...reverseModal, isOpen: false })}
        title={t("reverseTransactionTitle")}
      >
        <div
          className="flex flex-col items-center p-4 text-center"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <Undo2 size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-4">
            {t("confirmReverseMessage")}
          </p>
          <input
            type="text"
            value={reverseModal.reason}
            onChange={(e) =>
              setReverseModal({ ...reverseModal, reason: e.target.value })
            }
            placeholder={t("reversalReasonPlaceholder")}
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() => setReverseModal({ ...reverseModal, isOpen: false })}
              disabled={reverseModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={confirmReverse}
              disabled={reverseModal.loading || !reverseModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reverseModal.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("reverse")
              )}
            </button>
          </div>
        </div>
      </BaseModal>

      <ConfirmationModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ ...approveModal, isOpen: false })}
        onConfirm={confirmApprove}
        loading={approveModal.loading}
        message={t("confirmApproveMessage")}
      />

      <BaseModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ ...rejectModal, isOpen: false })}
        title={t("rejectExpenseTitle")}
      >
        <div
          className="flex flex-col items-center p-4 text-center"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-4">
            {t("confirmRejectMessage")}
          </p>
          <input
            type="text"
            value={rejectModal.reason}
            onChange={(e) =>
              setRejectModal({ ...rejectModal, reason: e.target.value })
            }
            placeholder={t("rejectionReasonPlaceholder")}
            className="w-full mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-[11px] focus:outline-none focus:border-[#E9B10C] transition-colors"
          />
          <div className="flex gap-3 w-full justify-center">
            <button
              type="button"
              onClick={() => setRejectModal({ ...rejectModal, isOpen: false })}
              disabled={rejectModal.loading}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={confirmReject}
              disabled={rejectModal.loading || !rejectModal.reason.trim()}
              className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rejectModal.loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("reject")
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}