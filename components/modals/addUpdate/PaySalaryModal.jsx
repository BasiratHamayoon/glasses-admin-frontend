"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { addSalaryPayment } from "@/redux/actions/salaryActions";

export const PaySalaryModal = ({ isOpen, onClose, employee, month, year, existingSalary, onPay }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    basicSalary: 0,
    workingDays: 26,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    overtimeHours: 0,
    allowances: { hra: 0, da: 0, ta: 0, medical: 0, special: 0, other: 0 },
    earnings: { overtime: 0, bonus: 0, incentive: 0, commission: 0, arrears: 0, other: 0 },
    deductions: { pf: 0, esi: 0, professionalTax: 0, tds: 0, loanRecovery: 0, advanceRecovery: 0, penalty: 0, lateDeduction: 0, leaveDeduction: 0, other: 0 },
    paymentMethod: "CASH",
    transactionId: "",
    receiptNumber: "",
    notes: "",
    bonusAmount: 0,
    customDeduction: 0,
    deductionReason: "",
  });

  useEffect(() => {
    if (isOpen && employee) {
      if (existingSalary) {
        setFormData(prev => ({
          ...prev,
          basicSalary: existingSalary.basicSalary || existingSalary.netSalary || 0,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          basicSalary: employee.salaryStructure?.basicSalary || 0,
        }));
      }
    }
  }, [isOpen, employee, existingSalary]);

  if (!employee) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (existingSalary) {
        await onPay({
          salaryId: existingSalary._id,
          amount: formData.basicSalary + formData.bonusAmount - formData.customDeduction,
          paymentMethod: formData.paymentMethod,
          transactionReference: formData.transactionId,
        });
      } else {
        const paymentData = {
          employee: employee._id,
          month: parseInt(month),
          year: parseInt(year),
          basicSalary: formData.basicSalary,
          workingDays: formData.workingDays,
          presentDays: formData.presentDays,
          absentDays: formData.absentDays,
          leaveDays: formData.leaveDays,
          overtimeHours: formData.overtimeHours,
          allowances: formData.allowances,
          earnings: { ...formData.earnings, bonus: formData.bonusAmount },
          deductions: { ...formData.deductions, other: formData.customDeduction },
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
          receiptNumber: formData.receiptNumber,
          paymentDate: new Date(),
          bankDetails: employee.bankDetails || { accountName: "", accountNumber: "", bankName: "", ifscCode: "" },
          notes: formData.deductionReason ? `${formData.notes || ''} | Deduction Reason: ${formData.deductionReason}` : formData.notes,
        };
        
        await dispatch(addSalaryPayment(paymentData)).unwrap();
        toast.success(t("salaryPaidSuccess") || "Salary paid successfully");
        
        // Tell the parent to completely clear the search filter!
        onClose(true); 
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || t("paymentError") || "Payment failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2.5 text-[11px] font-medium outline-none rounded-sm focus:border-[#E9B10C] transition-colors";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500 tracking-wider";

  const grossSalary = formData.basicSalary + formData.bonusAmount;
  const netSalary = grossSalary - formData.customDeduction;

  return (
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={t("paySalary") || "Pay Salary"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 mb-4 sticky top-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[8px] uppercase font-bold text-neutral-400">{t("employee") || "Employee"}</p>
              <p className="text-[14px] font-black mt-1">{employee.firstName} {employee.lastName}</p>
              <p className="text-[9px] text-neutral-500 mt-0.5">{employee.employeeId}</p>
              {employee.salaryStructure && <p className="text-[8px] text-neutral-400 mt-1">Structure: {employee.salaryStructure.name}</p>}
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase font-bold text-neutral-400">{t("monthYear") || "Month & Year"}</p>
              <p className="text-[11px] font-bold mt-1">{new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</p>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>{t("basicSalary") || "Basic Salary"} *</label>
          <input type="number" required min="0" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelClass}>{t("bonus") || "Bonus"}</label><input type="number" min="0" value={formData.bonusAmount} onChange={(e) => setFormData({ ...formData, bonusAmount: Number(e.target.value) })} className={inputClass} /></div>
          <div><label className={labelClass}>{t("deduction") || "Deduction"}</label><input type="number" min="0" value={formData.customDeduction} onChange={(e) => setFormData({ ...formData, customDeduction: Number(e.target.value) })} className={inputClass} /></div>
        </div>

        {formData.customDeduction > 0 && (
          <div><label className={labelClass}>{t("deductionReason") || "Deduction Reason"}</label><input type="text" value={formData.deductionReason} onChange={(e) => setFormData({ ...formData, deductionReason: e.target.value })} className={inputClass} placeholder="e.g., Leave without pay, Penalty, etc." /></div>
        )}

        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
          <p className="text-[9px] uppercase font-bold mb-3 text-neutral-500">{t("attendance") || "Attendance"}</p>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelClass}>{t("workingDays") || "Working Days"}</label><input type="number" min="1" max="31" value={formData.workingDays} onChange={(e) => setFormData({ ...formData, workingDays: Number(e.target.value) })} className={inputClass} /></div>
            <div><label className={labelClass}>{t("presentDays") || "Present Days"}</label><input type="number" min="0" max="31" value={formData.presentDays} onChange={(e) => setFormData({ ...formData, presentDays: Number(e.target.value) })} className={inputClass} /></div>
            <div><label className={labelClass}>{t("absentDays") || "Absent Days"}</label><input type="number" min="0" max="31" value={formData.absentDays} onChange={(e) => setFormData({ ...formData, absentDays: Number(e.target.value) })} className={inputClass} /></div>
          </div>
        </div>

        <div className="bg-[#E9B10C]/10 p-4 rounded-sm border border-[#E9B10C]/20">
          <div className="flex justify-between items-center mb-2"><span className="text-[9px] uppercase font-bold text-neutral-500">{t("basicSalary") || "Basic Salary"}</span><span className="text-[12px] font-bold">SAR {formData.basicSalary.toLocaleString()}</span></div>
          <div className="flex justify-between items-center mb-2"><span className="text-[9px] uppercase font-bold text-neutral-500">{t("bonus") || "Bonus"}</span><span className="text-[12px] font-bold text-green-600">+SAR {formData.bonusAmount.toLocaleString()}</span></div>
          <div className="flex justify-between items-center mb-2"><span className="text-[9px] uppercase font-bold text-neutral-500">{t("grossSalary") || "Gross Salary"}</span><span className="text-[12px] font-bold">SAR {grossSalary.toLocaleString()}</span></div>
          <div className="flex justify-between items-center mb-2"><span className="text-[9px] uppercase font-bold text-neutral-500">{t("deduction") || "Deduction"}</span><span className="text-[12px] font-bold text-red-500">-SAR {formData.customDeduction.toLocaleString()}</span></div>
          <div className="flex justify-between items-center pt-2 border-t border-[#E9B10C]/20 mt-2"><span className="text-[10px] uppercase font-black">{t("netPayable") || "Net Payable"}</span><span className="text-[16px] font-black text-[#E9B10C]">SAR {netSalary.toLocaleString()}</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t("paymentMethod") || "Payment Method"} *</label>
            <select required value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className={inputClass}>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div><label className={labelClass}>{t("transactionId") || "Transaction ID"}</label><input type="text" value={formData.transactionId} onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })} className={inputClass} placeholder="Optional" /></div>
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-[#111111] py-3">
          <button type="button" onClick={() => onClose(false)} className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white text-[10px] uppercase font-bold rounded-sm hover:bg-neutral-300 transition-colors">{t("cancel") || "Cancel"}</button>
          <button type="submit" disabled={loading || formData.basicSalary <= 0} className="flex items-center gap-2 px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm hover:bg-[#d6a00b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />} {existingSalary ? (t("updatePayment") || "Update Payment") : (t("payNow") || "Pay Now")}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};