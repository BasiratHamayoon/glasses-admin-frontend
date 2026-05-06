"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, createEmployeeWithUser, updateEmployee } from "@/redux/actions/employeeActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const EmployeeModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const shops = useSelector(state => state.shops?.shops?.items || []);
  const shifts = useSelector(state => state.employees?.shifts?.items || []);

  const defaultForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    designation: "",
    department: "SALES",
    primaryShop: "",
    defaultShift: "",
    createAccount: false,
    password: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setModalReady(false);
      if (initialData) {
        setFormData({
          ...defaultForm,
          firstName: initialData.firstName || "",
          lastName: initialData.lastName || "",
          phone: initialData.phone || "",
          email: initialData.email || "",
          designation: initialData.designation || "",
          department: initialData.department || "SALES",
          primaryShop: initialData.primaryShop?._id || "",
          defaultShift: initialData.defaultShift?._id || "",
          createAccount: false,
          password: "",
        });
      } else {
        setFormData(defaultForm);
      }
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };

      if (!payload.primaryShop) delete payload.primaryShop;
      if (!payload.defaultShift) delete payload.defaultShift;
      if (!payload.lastName) delete payload.lastName;
      if (!payload.email) delete payload.email;
      if (payload.phone) payload.phone = payload.phone.replace(/\D/g, "");

      if (initialData?._id) {
        delete payload.createAccount;
        delete payload.password;
        await dispatch(updateEmployee({ id: initialData._id, data: payload })).unwrap();
        toast.success(t("employeeUpdated"));
      } else {
        if (formData.createAccount) {
          if (!formData.email || !formData.password) {
            toast.error(t("emailPasswordRequired"));
            return;
          }
          await dispatch(createEmployeeWithUser(payload)).unwrap();
          toast.success(t("employeeAndAccountCreated"));
        } else {
          delete payload.createAccount;
          delete payload.password;
          await dispatch(createEmployee(payload)).unwrap();
          toast.success(t("employeeCreated"));
        }
      }
      onClose(true);
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.response?.data?.message || err?.message || t("operationFailed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-medium outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editEmployee") : t("addEmployee")}
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
        <form onSubmit={handleSubmit} className="space-y-6 p-2">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {t("personalAndContact")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("firstName")} *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("lastName")}</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("phone")} *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("email")}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              {t("employmentDetails")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("designation")} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Cashier"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t("department")}</label>
                <select
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className={inputClass}
                >
                  <option value="SALES">{t("sales")}</option>
                  <option value="OPTOMETRY">Optometry</option>
                  <option value="OPERATIONS">Operations</option>
                  <option value="ACCOUNTS">Accounts</option>
                  <option value="MANAGEMENT">Management</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("primaryShopAssignment")}</label>
                <select
                  value={formData.primaryShop}
                  onChange={e => setFormData({ ...formData, primaryShop: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t("headOffice")}</option>
                  {shops.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("assignShift")}</label>
                <select
                  value={formData.defaultShift}
                  onChange={e => setFormData({ ...formData, defaultShift: e.target.value })}
                  className={inputClass}
                >
                  <option value="">{t("noSpecificShift")}</option>
                  {shifts.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.startTime} - {s.endTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {!initialData && (
            <div className="bg-neutral-50 dark:bg-[#0a0a0a] p-4 rounded-sm border border-neutral-200 dark:border-neutral-800">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input
                  type="checkbox"
                  checked={formData.createAccount}
                  onChange={e => setFormData({ ...formData, createAccount: e.target.checked })}
                  className="accent-[#E9B10C] w-3 h-3"
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-black dark:text-white">
                  {t("createSystemLoginAccount")}
                </span>
              </label>
              {formData.createAccount && (
                <div>
                  <label className={labelClass}>{t("assignPassword")} *</label>
                  <input
                    type="password"
                    required={formData.createAccount}
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className={inputClass}
                    placeholder={t("minSixChars")}
                  />
                  <span className="text-[8px] text-neutral-500 mt-1 block">
                    {t("loginEmailNote")}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : t("saveEmployee")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};