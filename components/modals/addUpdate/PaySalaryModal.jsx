"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { addSalaryPayment } from "@/redux/actions/salaryActions";

export const PaySalaryModal = ({ isOpen, onClose, employee, month, year, existingSalary, onPay }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const defaultForm = {
    basicSalary: "",
    workingDays: 26,
    presentDays: 26,
    absentDays: 0,
    leaveDays: 0,
    overtimeHours: 0,
    allowances: { hra: 0, da: 0, ta: 0, medical: 0, special: 0, other: 0 },
    earnings: { overtime: 0, bonus: 0, incentive: 0, commission: 0, arrears: 0, other: 0 },
    deductions: {
      pf: 0, esi: 0, professionalTax: 0, tds: 0,
      loanRecovery: 0, advanceRecovery: 0, penalty: 0,
      lateDeduction: 0, leaveDeduction: 0, other: 0,
    },
    paymentMethod: "CASH",
    transactionId: "",
    receiptNumber: "",
    notes: "",
    bonusAmount: "",
    customDeduction: "",
    deductionReason: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen && employee) {
      setModalReady(false);
      const baseSalary = existingSalary?.basicSalary
        || existingSalary?.netSalary
        || employee.salaryStructure?.basicSalary
        || "";
      setFormData({ ...defaultForm, basicSalary: baseSalary });
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, employee, existingSalary]);

  const basicSalary = Number(formData.basicSalary) || 0;
  const bonusAmount = Number(formData.bonusAmount) || 0;
  const customDeduction = Number(formData.customDeduction) || 0;
  const grossSalary = basicSalary + bonusAmount;
  const netSalary = grossSalary - customDeduction;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (basicSalary <= 0) {
      toast.error(t("basicSalaryRequired"));
      return;
    }
    setLoading(true);
    try {
      if (existingSalary) {
        await onPay({
          salaryId: existingSalary._id,
          amount: netSalary,
          paymentMethod: formData.paymentMethod,
          transactionReference: formData.transactionId,
        });
      } else {
        const paymentData = {
          employee: employee._id,
          month: parseInt(month),
          year: parseInt(year),
          basicSalary,
          workingDays: formData.workingDays,
          presentDays: formData.presentDays,
          absentDays: formData.absentDays,
          leaveDays: formData.leaveDays,
          overtimeHours: formData.overtimeHours,
          allowances: formData.allowances,
          earnings: { ...formData.earnings, bonus: bonusAmount },
          deductions: { ...formData.deductions, other: customDeduction },
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionId,
          receiptNumber: formData.receiptNumber,
          paymentDate: new Date(),
          bankDetails: employee.bankDetails || {
            accountName: "", accountNumber: "", bankName: "", ifscCode: "",
          },
          notes: formData.deductionReason
            ? `${formData.notes || ""} | ${t("deductionReason")}: ${formData.deductionReason}`
            : formData.notes,
        };

        await dispatch(addSalaryPayment(paymentData)).unwrap();
        toast.success(t("salaryPaidSuccess"));
        onClose(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || t("paymentError");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2.5 text-[11px] font-medium outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass =
    "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500 tracking-wider";

  return (
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={t("paySalary")} maxWidth="max-w-2xl">
      {!employee || !modalReady ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800 sticky top-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[8px] uppercase font-bold text-neutral-400">{t("employee")}</p>
                <p className="text-[14px] font-black mt-1 text-black dark:text-white">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-[9px] text-neutral-500 mt-0.5">{employee.employeeId}</p>
                {employee.salaryStructure && (
                  <p className="text-[8px] text-neutral-400 mt-1">
                    {t("structure")}: {employee.salaryStructure.name}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase font-bold text-neutral-400">{t("monthYear")}</p>
                <p className="text-[11px] font-bold mt-1 text-black dark:text-white">
                  {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t("basicSalary")} (⃁) *</label>
            <input
              type="number"
              required
              min="1"
              inputMode="decimal"
              value={formData.basicSalary}
              onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("bonus")} (⃁)</label>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={formData.bonusAmount}
                onChange={(e) => setFormData({ ...formData, bonusAmount: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("deduction")} (⃁)</label>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={formData.customDeduction}
                onChange={(e) => setFormData({ ...formData, customDeduction: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {customDeduction > 0 && (
            <div>
              <label className={labelClass}>{t("deductionReason")}</label>
              <input
                type="text"
                value={formData.deductionReason}
                onChange={(e) => setFormData({ ...formData, deductionReason: e.target.value })}
                className={inputClass}
                placeholder={t("deductionReasonPlaceholder")}
              />
            </div>
          )}

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <p className="text-[9px] uppercase font-bold mb-3 text-neutral-500">{t("attendance")}</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>{t("workingDays")}</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  inputMode="numeric"
                  value={formData.workingDays}
                  onChange={(e) => setFormData({ ...formData, workingDays: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("presentDays")}</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  inputMode="numeric"
                  value={formData.presentDays}
                  onChange={(e) => setFormData({ ...formData, presentDays: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("absentDays")}</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  inputMode="numeric"
                  value={formData.absentDays}
                  onChange={(e) => setFormData({ ...formData, absentDays: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-[#E9B10C]/10 p-4 rounded-sm border border-[#E9B10C]/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] uppercase font-bold text-neutral-500">{t("basicSalary")}</span>
              <span className="text-[12px] font-bold flex items-center gap-1">
                ⃁ {basicSalary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] uppercase font-bold text-neutral-500">{t("bonus")}</span>
              <span className="text-[12px] font-bold text-green-600 flex items-center gap-1">
                + ⃁ {bonusAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] uppercase font-bold text-neutral-500">{t("grossSalary")}</span>
              <span className="text-[12px] font-bold flex items-center gap-1">
                ⃁ {grossSalary.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] uppercase font-bold text-neutral-500">{t("deduction")}</span>
              <span className="text-[12px] font-bold text-red-500 flex items-center gap-1">
                - ⃁ {customDeduction.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E9B10C]/20 mt-2">
              <span className="text-[10px] uppercase font-black text-black dark:text-white">{t("netPayable")}</span>
              <span className="text-[16px] font-black text-[#E9B10C] flex items-center gap-1">
                ⃁ {netSalary.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("paymentMethod")} *</label>
              <select
                required
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className={inputClass}
              >
                <option value="CASH">{t("cash")}</option>
                <option value="BANK_TRANSFER">{t("bankTransfer")}</option>
                <option value="CHEQUE">{t("cheque")}</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("transactionId")}</label>
              <input
                type="text"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                className={inputClass}
                placeholder={t("optional")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-[#111111] py-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white text-[10px] uppercase font-bold rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading || basicSalary <= 0}
              className="flex items-center gap-2 px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm hover:bg-[#d6a00b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <span>⃁</span>}
              {existingSalary ? t("updatePayment") : t("payNow")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};