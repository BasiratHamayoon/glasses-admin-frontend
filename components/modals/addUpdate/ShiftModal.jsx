"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShift, updateShift } from "@/redux/actions/employeeActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export const ShiftModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const shops = useSelector(state => state.shops?.shops?.items || []);

  const defaultForm = {
    name: "",
    code: "",
    description: "",
    shop: "",
    startTime: "",
    endTime: "",
    breakDuration: 60,
    lateGracePeriod: 15,
    earlyLeaveGracePeriod: 15,
    halfDayHours: 4,
    overtimeEnabled: false,
    overtimeRate: 1.5,
    minOvertimeHours: 1,
    applicableDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      setModalReady(false);
      if (initialData) {
        setFormData({ ...defaultForm, ...initialData, shop: initialData.shop?._id || "" });
      } else {
        setFormData(defaultForm);
      }
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, initialData]);

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      applicableDays: prev.applicableDays.includes(day)
        ? prev.applicableDays.filter(d => d !== day)
        : [...prev.applicableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.shop) delete payload.shop;
      if (!payload.code) delete payload.code;

      if (initialData?._id) {
        await dispatch(updateShift({ id: initialData._id, data: payload })).unwrap();
        toast.success(t("shiftUpdated"));
      } else {
        await dispatch(createShift(payload)).unwrap();
        toast.success(t("shiftCreated"));
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
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={initialData ? t("editShift") : t("createShift")}
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
        <form onSubmit={handleSubmit} className="space-y-4 p-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>{t("shiftName")} *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Morning Shift"
              />
            </div>

            <div>
              <label className={labelClass}>{t("startTime")} *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("endTime")} *</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t("breakDurationMins")}</label>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={formData.breakDuration}
                onChange={e => setFormData({ ...formData, breakDuration: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{t("assignToShop")}</label>
              <select
                value={formData.shop}
                onChange={e => setFormData({ ...formData, shop: e.target.value })}
                className={inputClass}
              >
                <option value="">{t("universalAllShops")}</option>
                {shops.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <label className={labelClass}>{t("applicableDays")}</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {DAYS.map(day => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-sm border transition-colors ${
                    formData.applicableDays.includes(day)
                      ? "bg-[#E9B10C] text-black border-[#E9B10C]"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

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
              {loading ? <Loader2 size={14} className="animate-spin" /> : t("save")}
            </button>
          </div>
        </form>
      )}
    </BaseModal>
  );
};