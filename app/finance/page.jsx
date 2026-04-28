"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus, Loader2, Undo2, XCircle } from "lucide-react"; 

import { 
  fetchTransactions, fetchExpenses, fetchFinancialSummary, fetchCashFlowReports, fetchProfitLossReports,
  approveExpense, payExpense, rejectExpense, reconcileTransaction, reverseTransaction,
  fetchCategoryWiseExpense, fetchMonthlyComparison, fetchShopWiseReport
} from "@/redux/actions/financeActions";

import { fetchShops } from "@/redux/actions/shopActions";

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

export default function FinancePage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState("transactions");
  
  const [txnFilters, setTxnFilters] = useState({ search: '', type: [], paymentMethod: [], isReconciled: [] });
  const [expFilters, setExpFilters] = useState({ search: '', status: [], category: [] });

  const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
  const [isAddTransactionOpen, setAddTransactionOpen] = useState(false);
  const [reportModal, setReportModal] = useState({ isOpen: false, type: 'CASH_FLOW' });
  const [viewTxn, setViewTxn] = useState({ isOpen: false, data: null });
  const [viewExpense, setViewExpense] = useState({ isOpen: false, data: null });

  const [reconcileModal, setReconcileModal] = useState({ isOpen: false, txn: null, loading: false });
  const [reverseModal, setReverseModal] = useState({ isOpen: false, txn: null, reason: '', loading: false });

  const [approveModal, setApproveModal] = useState({ isOpen: false, exp: null, loading: false });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, exp: null, reason: '', loading: false });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const debounceTimer = useRef(null);
  const initFetched = useRef(false);

  const { transactions, expenses, reports } = useSelector(state => state.finance);

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchShops({ limit: 100 }));
      initFetched.current = true;
    }
  }, [dispatch]);

  const loadData = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      dispatch(fetchFinancialSummary());

      if (activeTab === 'transactions') dispatch(fetchTransactions({ ...txnFilters, page: currentPage, limit: itemsPerPage }));
      if (activeTab === 'expenses') dispatch(fetchExpenses({ ...expFilters, page: currentPage, limit: itemsPerPage }));
      
      if (activeTab === 'charts') {
        dispatch(fetchCategoryWiseExpense());
        dispatch(fetchMonthlyComparison());
        dispatch(fetchShopWiseReport());
      }

      if (activeTab === 'reports') {
        dispatch(fetchCashFlowReports());
        dispatch(fetchProfitLossReports());
      }
    }, 300);
  }, [dispatch, activeTab, currentPage, txnFilters, expFilters]);

  useEffect(() => { 
    loadData(); 
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [loadData]); 

  const handleRequestReconcile = (txn) => setReconcileModal({ isOpen: true, txn, loading: false });
  
  const confirmReconcile = async () => {
    setReconcileModal(prev => ({ ...prev, loading: true }));
    try { 
      await dispatch(reconcileTransaction({ id: reconcileModal.txn._id, data: { notes: "Admin Reconciled" } })).unwrap(); 
      toast.success("Reconciled Successfully"); 
      setReconcileModal({ isOpen: false, txn: null, loading: false });
      loadData(); 
    } 
    catch (err) { 
      toast.error("Failed to reconcile"); 
      setReconcileModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRequestReverse = (txn) => setReverseModal({ isOpen: true, txn, reason: '', loading: false });

  const confirmReverse = async () => {
    setReverseModal(prev => ({ ...prev, loading: true }));
    try { 
      await dispatch(reverseTransaction({ id: reverseModal.txn._id, data: { reason: reverseModal.reason } })).unwrap(); 
      toast.success("Reversed Successfully"); 
      setReverseModal({ isOpen: false, txn: null, reason: '', loading: false });
      loadData(); 
    } 
    catch (err) { 
      toast.error("Failed to reverse"); 
      setReverseModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRequestApprove = (exp) => setApproveModal({ isOpen: true, exp, loading: false });

  const confirmApprove = async () => {
    setApproveModal(prev => ({ ...prev, loading: true }));
    try { 
      await dispatch(approveExpense(approveModal.exp._id)).unwrap(); 
      toast.success("Expense Approved"); 
      setApproveModal({ isOpen: false, exp: null, loading: false });
      loadData(); 
    } 
    catch (err) { 
      toast.error("Failed to approve"); 
      setApproveModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRequestReject = (exp) => setRejectModal({ isOpen: true, exp, reason: '', loading: false });

  const confirmReject = async () => {
    setRejectModal(prev => ({ ...prev, loading: true }));
    try { 
      await dispatch(rejectExpense({ id: rejectModal.exp._id, data: { reason: rejectModal.reason } })).unwrap(); 
      toast.success("Expense Rejected"); 
      setRejectModal({ isOpen: false, exp: null, reason: '', loading: false });
      loadData(); 
    } 
    catch (err) { 
      toast.error("Failed to reject"); 
      setRejectModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePayExpense = async (exp) => {
    try { await dispatch(payExpense({ id: exp._id, data: { amount: exp.dueAmount, paymentMethod: "BANK_TRANSFER" } })).unwrap(); toast.success("Expense Paid"); loadData(); } 
    catch (err) { toast.error("Payment Failed"); }
  };

  if (transactions.loading && !transactions.items.length && !reports.summary) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      
      <FinanceStats summary={reports.summary?.summary} />

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 w-full">
        <div className="flex bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-x-auto scrollbar-hide shadow-sm w-full xl:w-auto">
          {[
            { id: "transactions", label: t("transactions") || "Transactions" }, 
            { id: "expenses", label: t("expenses") || "Expenses" }, 
            { id: "charts", label: t("chartsAnalytics") || "Charts & Analytics" },
            { id: "reports", label: t("financialReports") || "Financial Reports" }
            ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }} className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${activeTab === tab.id ? 'bg-[#E9B10C] text-black shadow-sm' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
          {activeTab === 'transactions' && (
            <button onClick={() => setAddTransactionOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0">
              <Plus size={14} strokeWidth={3} /> <span className="text-[10px] uppercase font-black tracking-widest">Log Transaction</span>
            </button>
          )}
          {activeTab === 'expenses' && (
            <button onClick={() => setAddExpenseOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0">
              <Plus size={14} strokeWidth={3} /> <span className="text-[10px] uppercase font-black tracking-widest">Log Expense</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        
        {activeTab === 'transactions' && (
          <>
            <FinanceFilter type="transaction" filters={txnFilters} setFilters={setTxnFilters} onApply={() => { setCurrentPage(1); loadData(); }} onClear={() => { setTxnFilters({ search: '', type: [], paymentMethod: [], isReconciled: [] }); setCurrentPage(1); setTimeout(loadData, 100); }} />
            
            <TransactionTable 
              data={transactions.items} 
              loading={transactions.loading} 
              onView={(item) => setViewTxn({isOpen: true, data: item})} 
              onReconcile={handleRequestReconcile} 
              onReverse={handleRequestReverse} 
            />
            
            <BasePagination currentPage={currentPage} totalPages={transactions.pagination?.totalPages || 1} onPageChange={setCurrentPage} />
          </>
        )}

        {activeTab === 'expenses' && (
          <>
            <FinanceFilter type="expense" filters={expFilters} setFilters={setExpFilters} onApply={() => { setCurrentPage(1); loadData(); }} onClear={() => { setExpFilters({ search: '', status: [], category: [] }); setCurrentPage(1); setTimeout(loadData, 100); }} />
            
            <ExpenseTable 
              data={expenses.items} 
              loading={expenses.loading} 
              onView={(item) => setViewExpense({ isOpen: true, data: item })} 
              onApprove={handleRequestApprove}
              onReject={handleRequestReject}
              onPay={handlePayExpense} 
            />
            
            <BasePagination currentPage={currentPage} totalPages={expenses.pagination?.totalPages || 1} onPageChange={setCurrentPage} />
          </>
        )}

        {/* ONLY THE TWO CHARTS FROM YOUR ORIGINAL CODE */}
        {activeTab === 'charts' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyComparisonChart data={reports.monthlyComparison} loading={reports.loading} />
              <DailyTrendChart data={reports.summary?.dailyTrend} loading={reports.loading} />
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="p-6 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-[#E9B10C]">Cash Flow Reports</h3><button onClick={() => setReportModal({ isOpen: true, type: 'CASH_FLOW' })} className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase font-bold rounded-sm hover:bg-[#E9B10C] transition-colors">+ Generate New</button></div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-64 scrollbar-hide">
                {reports.cashFlow?.length === 0 ? <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center py-6">No reports generated.</p> : reports.cashFlow?.map(r => (
                  <div key={r._id} className="py-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center hover:bg-white dark:hover:bg-[#111111] px-2 rounded-sm cursor-pointer transition-colors">
                    <div><span className="block text-[10px] font-bold uppercase">{r.reportNumber}</span><span className="text-[8px] font-bold text-neutral-500 block">{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</span></div>
                    <span className={`text-[10px] font-black ${r.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>SAR {r.netCashFlow?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-4"><h3 className="text-[11px] font-black uppercase tracking-widest text-[#E9B10C]">Profit & Loss Statements</h3><button onClick={() => setReportModal({ isOpen: true, type: 'PROFIT_LOSS' })} className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] uppercase font-bold rounded-sm hover:bg-[#E9B10C] transition-colors">+ Generate New</button></div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-64 scrollbar-hide">
                {reports.profitLoss?.length === 0 ? <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center py-6">No statements generated.</p> : reports.profitLoss?.map(r => (
                  <div key={r._id} className="py-3 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center hover:bg-white dark:hover:bg-[#111111] px-2 rounded-sm cursor-pointer transition-colors">
                    <div><span className="block text-[10px] font-bold uppercase">{r.reportNumber}</span><span className="text-[8px] font-bold text-neutral-500 block">{new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}</span></div>
                    <span className={`text-[10px] font-black ${r.netProfitAfterTax >= 0 ? 'text-green-500' : 'text-red-500'}`}>SAR {r.netProfitAfterTax?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ExpenseModal isOpen={isAddExpenseOpen} onClose={() => { setAddExpenseOpen(false); loadData(); }} />
      <TransactionModal isOpen={isAddTransactionOpen} onClose={() => { setAddTransactionOpen(false); loadData(); }} />
      <TransactionViewModal isOpen={viewTxn.isOpen} onClose={() => setViewTxn({isOpen: false, data: null})} data={viewTxn.data} />
      <ExpenseViewModal isOpen={viewExpense.isOpen} onClose={() => setViewExpense({ isOpen: false, data: null })} data={viewExpense.data} />
      <GenerateReportModal isOpen={reportModal.isOpen} onClose={() => setReportModal({ isOpen: false, type: 'CASH_FLOW' })} reportType={reportModal.type} onSuccess={loadData} />
      
      <ConfirmationModal 
        isOpen={reconcileModal.isOpen} 
        onClose={() => setReconcileModal({ ...reconcileModal, isOpen: false })} 
        onConfirm={confirmReconcile} 
        loading={reconcileModal.loading} 
        title={t("confirmReconcileTitle") || "Reconcile Transaction"}
        message={t("confirmReconcileMessage") || "Are you sure you want to reconcile this transaction? This will mark it as verified in the system."}
        confirmText={t("reconcile") || "Reconcile"}
        warningText={t("confirmActionWarning") || "Please confirm your action."}
        confirmClass="bg-blue-500 hover:bg-blue-600 text-white"
        iconColor="text-blue-500"
      />

      <BaseModal isOpen={reverseModal.isOpen} onClose={() => setReverseModal({ ...reverseModal, isOpen: false })} title={t('reverseTransactionTitle') || "Reverse Transaction"}>
        <div className="flex flex-col items-center justify-center p-4 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
          <Undo2 size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-2">
            {t('confirmReverseMessage') || "Are you sure you want to reverse this transaction? Please provide a reason below. This action cannot be undone."}
          </p>
          <input 
            type="text"
            value={reverseModal.reason}
            onChange={(e) => setReverseModal({ ...reverseModal, reason: e.target.value })}
            placeholder={t('reversalReasonPlaceholder') || "Enter reason for reversal..."}
            className="w-full mt-4 mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E9B10C] focus:border-[#E9B10C] transition-all"
          />
          <div className="flex gap-3 w-full justify-center">
            <button onClick={() => setReverseModal({ ...reverseModal, isOpen: false })} disabled={reverseModal.loading} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm">
              {t('cancel') || 'Cancel'}
            </button>
            <button onClick={confirmReverse} disabled={reverseModal.loading || !reverseModal.reason.trim()} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 rounded-sm min-w-[120px] bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              {reverseModal.loading ? <Loader2 size={14} className="animate-spin" /> : (t('reverse') || 'Reverse')}
            </button>
          </div>
        </div>
      </BaseModal>

      <ConfirmationModal 
        isOpen={approveModal.isOpen} 
        onClose={() => setApproveModal({ ...approveModal, isOpen: false })} 
        onConfirm={confirmApprove} 
        loading={approveModal.loading} 
        title={t("confirmApproveTitle") || "Approve Expense"}
        message={t("confirmApproveMessage") || "Are you sure you want to approve this expense? This will authorize it for payment."}
        confirmText={t("approve") || "Approve"}
        warningText={t("confirmActionWarning") || "Please confirm your action."}
        confirmClass="bg-green-500 hover:bg-green-600 text-white"
        iconColor="text-green-500"
      />

      <BaseModal isOpen={rejectModal.isOpen} onClose={() => setRejectModal({ ...rejectModal, isOpen: false })} title={t('rejectExpenseTitle') || "Reject Expense"}>
        <div className="flex flex-col items-center justify-center p-4 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
          <XCircle size={48} className="text-red-500 mb-4 opacity-80" />
          <p className="text-[12px] text-black dark:text-white font-medium mb-2">
            {t('confirmRejectMessage') || "Are you sure you want to reject this expense? Please provide a reason below."}
          </p>
          <input 
            type="text"
            value={rejectModal.reason}
            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
            placeholder={t('rejectionReasonPlaceholder') || "Enter reason for rejection..."}
            className="w-full mt-4 mb-6 bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#E9B10C] focus:border-[#E9B10C] transition-all"
          />
          <div className="flex gap-3 w-full justify-center">
            <button onClick={() => setRejectModal({ ...rejectModal, isOpen: false })} disabled={rejectModal.loading} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm">
              {t('cancel') || 'Cancel'}
            </button>
            <button onClick={confirmReject} disabled={rejectModal.loading || !rejectModal.reason.trim()} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 rounded-sm min-w-[120px] bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              {rejectModal.loading ? <Loader2 size={14} className="animate-spin" /> : (t('reject') || 'Reject')}
            </button>
          </div>
        </div>
      </BaseModal>

    </div>
  );
}