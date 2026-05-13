"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPrescription } from "@/redux/actions/customerActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const PrescriptionModal = ({ isOpen, onClose, customer }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [modalReady, setModalReady] = useState(false);
  const [activeTab, setActiveTab] = useState("eyes");

  const { items: shops = [] } = useSelector(
    state => state.shops?.shops || { items: [] }
  );

  const defaultEye = { spherical: 0, cylindrical: 0, axis: 0, add: 0, pd: "" };

  const defaultForm = {
    type: "DISTANCE",
    rightEye: { ...defaultEye },
    leftEye: { ...defaultEye },
    pd: "",
    shop: "",
    doctorName: "",
    clinicName: "",
    notes: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen && customer) {
      setModalReady(false);
      setFormData(defaultForm);
      setActiveTab("eyes");
      setTimeout(() => setModalReady(true), 50);
    }
  }, [isOpen, customer]);

  const handleEyeChange = (eye, field, value) => {
    setFormData(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: Number(value) },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));

      if (!payload.shop) delete payload.shop;
      payload.customer = customer._id;

      const cleanEye = (eyeObj) => {
        Object.keys(eyeObj).forEach(key => {
          if (eyeObj[key] === "" || eyeObj[key] === null) {
            delete eyeObj[key];
          } else {
            eyeObj[key] = Number(eyeObj[key]);
          }
        });
        return Object.keys(eyeObj).length > 0 ? eyeObj : undefined;
      };

      if (payload.rightEye) payload.rightEye = cleanEye(payload.rightEye);
      if (payload.leftEye) payload.leftEye = cleanEye(payload.leftEye);

      if (payload.pd === "" || payload.pd === null) {
        delete payload.pd;
      } else {
        payload.pd = Number(payload.pd);
      }

      await dispatch(createPrescription(payload)).unwrap();
      toast.success(t("prescriptionAdded"));
      onClose(true);
    } catch (err) {
      const msg =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || err?.message || t("operationFailed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-[#111111] border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] font-bold outline-none rounded-sm focus:border-[#E9B10C] transition-colors text-black dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const labelClass =
    "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  if (!customer) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={`${t("addPrescription")}: ${customer.firstName}`}
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
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4">
            {["eyes", "details"].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "border-[#E9B10C] text-[#E9B10C]"
                    : "border-transparent text-neutral-500"
                }`}
              >
                {tab === "eyes" ? t("eyePowers") : t("clinicDetails")}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-2">
            {activeTab === "eyes" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t("prescriptionType")}</label>
                    <select
                      required
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className={inputClass}
                    >
                      <option value="DISTANCE">{t("distance")}</option>
                      <option value="NEAR">{t("nearReading")}</option>
                      <option value="BIFOCAL">{t("bifocal")}</option>
                      <option value="PROGRESSIVE">{t("progressive")}</option>
                      <option value="CONTACT_LENS">{t("contactLens")}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t("totalPD")}</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={formData.pd}
                      onChange={e => setFormData({ ...formData, pd: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a]">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-3">
                    {t("rightEyeOD")}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["spherical", "cylindrical", "axis", "add"].map(field => (
                      <div key={field}>
                        <label className={labelClass}>{field.toUpperCase().slice(0, 3)}</label>
                        <input
                          type="number"
                          step="0.25"
                          inputMode="decimal"
                          value={formData.rightEye[field]}
                          onChange={e => handleEyeChange("rightEye", field, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-sm bg-neutral-50 dark:bg-[#0a0a0a]">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-3">
                    {t("leftEyeOS")}
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["spherical", "cylindrical", "axis", "add"].map(field => (
                      <div key={field}>
                        <label className={labelClass}>{field.toUpperCase().slice(0, 3)}</label>
                        <input
                          type="number"
                          step="0.25"
                          inputMode="decimal"
                          value={formData.leftEye[field]}
                          onChange={e => handleEyeChange("leftEye", field, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("doctorName")}</label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("clinicName")}</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={e => setFormData({ ...formData, clinicName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("examinedAtShop")}</label>
                  <select
                    value={formData.shop}
                    onChange={e => setFormData({ ...formData, shop: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{t("externalClinic")}</option>
                    {shops.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>{t("prescriptionNotes")}</label>
                  <textarea
                    rows="3"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-sm transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#E9B10C] text-black text-[10px] uppercase font-bold rounded-sm flex items-center gap-2 hover:bg-[#d4a00a] transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : t("savePrescription")}
              </button>
            </div>
          </form>
        </>
      )}
    </BaseModal>
  );
};