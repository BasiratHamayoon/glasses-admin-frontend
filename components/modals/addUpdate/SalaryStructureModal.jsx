"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSalaryStructure, updateSalaryStructure } from "@/redux/actions/salaryActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, ChevronRight } from "lucide-react";

const TABS = ["basic", "allowances", "deductions", "policies"];

const isBasicTabValid = (formData) => {
  return formData.name.trim() !== "" && formData.basicSalary > 0;
};

const isTabNextAllowed = (tabName, formData) => {
  if (tabName === "basic") return isBasicTabValid(formData);
  return true;
};

export const SalaryStructureModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const defaultForm = {
    name: "",
    code: "",
    description: "",
    basicSalary: "",
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    isActive: true,
    allowances: { hra: 0, da: 0, ta: 0, medical: 0, special: 0, other: 0 },
    deductions: { pf: 0, esi: 0, professionalTax: 0, tds: 0, other: 0 },
    commissionEnabled: false,
    commissionType: "PERCENTAGE",
    commissionRate: 0,
    overtimeEnabled: false,
    overtimeRatePerHour: 0,
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setModalReady(false);
      setActiveTabIndex(0);
      if (initialData) {
        setFormData({ ...defaultForm, ...initialData });
      } else {
        setFormData(defaultForm);
      }
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, initialData]);

  const handleNested = (group, field, value) => {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [field]: value === "" ? 0 : Number(value) },
    }));
  };

  const handleNext = () => {
    if (activeTabIndex < TABS.length - 1) setActiveTabIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeTabIndex > 0) setActiveTabIndex(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBasicTabValid(formData)) {
      setActiveTabIndex(0);
      toast.error(t("fillRequiredFields"));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        basicSalary: Number(formData.basicSalary) || 0,
      };
      if (initialData?._id) {
        await dispatch(updateSalaryStructure({ id: initialData._id, data: payload })).unwrap();
        toast.success(t("structureUpdated"));
      } else {
        await dispatch(createSalaryStructure(payload)).unwrap();
        toast.success(t("structureCreated"));
      }
      onClose(true);
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass = "block text-[9px] uppercase font-bold mb-1.5 text-neutral-500";

  const activeTab = TABS[activeTabIndex];
  const isLastTab = activeTabIndex === TABS.length - 1;
  const nextAllowed = isTabNextAllowed(activeTab, formData);
  const saveAllowed = !loading && isBasicTabValid(formData);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editSalaryStructure") : t("newSalaryStructure")}
      maxWidth="max-w-2xl"
    >
      {!modalReady ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      ) : (
        <>
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4 overflow-x-auto scrollbar-hide">
            {TABS.map((tab, idx) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTabIndex(idx)}
                className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTabIndex === idx
                    ? "border-[#E9B10C] text-[#E9B10C]"
                    : "border-transparent text-neutral-500"
                }`}
              >
                {t(tab) || tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-2">
            {activeTab === "basic" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>{t("structureName")} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("code")}</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className={`${inputClass} uppercase`}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("basicSalary")} (⃁) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    inputMode="decimal"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("workingDaysPerMonth")}</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    inputMode="numeric"
                    value={formData.workingDaysPerMonth}
                    onChange={(e) => setFormData({ ...formData, workingDaysPerMonth: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("workingHoursPerDay")}</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    inputMode="numeric"
                    value={formData.workingHoursPerDay}
                    onChange={(e) => setFormData({ ...formData, workingHoursPerDay: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{t("description")}</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {activeTab === "allowances" && (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(defaultForm.allowances).map(key => (
                  <div key={key}>
                    <label className={labelClass}>{key.toUpperCase()} (⃁)</label>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={formData.allowances[key]}
                      onChange={(e) => handleNested("allowances", key, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "deductions" && (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(defaultForm.deductions).map(key => (
                  <div key={key}>
                    <label className={labelClass}>{key.replace(/([A-Z])/g, " $1").toUpperCase()} (⃁)</label>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={formData.deductions[key]}
                      onChange={(e) => handleNested("deductions", key, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === "policies" && (
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.overtimeEnabled}
                      onChange={(e) => setFormData({ ...formData, overtimeEnabled: e.target.checked })}
                      className="w-3 h-3 accent-[#E9B10C]"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                      {t("enableOvertimePay")}
                    </span>
                  </label>
                  {formData.overtimeEnabled && (
                    <div>
                      <label className={labelClass}>{t("overtimeRatePerHour")} (⃁)</label>
                      <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        value={formData.overtimeRatePerHour}
                        onChange={(e) => setFormData({ ...formData, overtimeRatePerHour: Number(e.target.value) })}
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm">
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={formData.commissionEnabled}
                      onChange={(e) => setFormData({ ...formData, commissionEnabled: e.target.checked })}
                      className="w-3 h-3 accent-[#E9B10C]"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                      {t("enableCommission")}
                    </span>
                  </label>
                  {formData.commissionEnabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>{t("commissionType")}</label>
                        <select
                          value={formData.commissionType}
                          onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                          className={inputClass}
                        >
                          <option value="PERCENTAGE">{t("percentage")}</option>
                          <option value="FIXED">{t("fixedAmount")}</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>{t("rateAmount")}</label>
                        <input
                          type="number"
                          min="0"
                          inputMode="decimal"
                          value={formData.commissionRate}
                          onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
              <div className="flex gap-2">
                {activeTabIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    {t("back")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>

              {isLastTab ? (
                <button
                  type="submit"
                  disabled={!saveAllowed}
                  className={`px-6 py-2 text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 transition-colors ${
                    saveAllowed
                      ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : t("save")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!nextAllowed}
                  className={`px-6 py-2 text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 transition-colors ${
                    nextAllowed
                      ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                  }`}
                >
                  {t("next")}
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </BaseModal>
  );
};