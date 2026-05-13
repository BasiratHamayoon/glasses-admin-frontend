// ShopModal.jsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createShop, updateShop } from "@/redux/actions/shopActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ShopModal = ({ isOpen, onClose, initialData = null, isLoading = false }) => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const defaultForm = {
    name: "",
    shopType: "RETAIL",
    status: "ACTIVE",
    description: "",
    address: {
      city: "",
      state: "",
      pincode: "",
      street: "",
    },
    contact: {
      phone: "",
      email: "",
    },
    settings: {
      invoicePrefix: "INV",
      printReceipt: true,
      dailyClosingRequired: true,
    },
  };

  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        setFormData({
          ...defaultForm,
          ...initialData,
          address: { ...defaultForm.address, ...(initialData.address || {}) },
          contact: { ...defaultForm.contact, ...(initialData.contact || {}) },
          settings: { ...defaultForm.settings, ...(initialData.settings || {}) },
        });
      } else {
        setFormData(defaultForm);
      }
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t("shopNameRequired");
    if (!formData.contact.phone.trim()) newErrors.phone = t("phoneRequired");
    if (!formData.address.city.trim()) newErrors.city = t("cityRequired");
    if (!formData.address.state.trim()) newErrors.state = t("stateRequired");
    if (!formData.address.pincode.trim()) newErrors.pincode = t("pincodeRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(t("fillRequiredFields"));
      return;
    }
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));
      const systemFields = [
        "_id", "id", "__v", "createdAt", "updatedAt",
        "fullAddress", "employeesCount", "financialSummary",
        "posDevices", "workingHours", "code", "slug",
        "manager", "createdBy", "updatedBy",
        "isActive", "allowPOSAccess", "allowSuperAdminAccess",
        "openingDate", "closingDate", "gstNumber", "panNumber",
        "licenseNumber", "drugLicenseNumber", "fssaiNumber",
        "bankDetails", "images", "logo", "maxPOSDevices",
        "financialSummary", "staffSummary", "staff", "wallet",
      ];
      systemFields.forEach((field) => delete payload[field]);

      if (payload.contact?.phone) {
        payload.contact.phone = payload.contact.phone.replace(/\D/g, "");
      }

      if (initialData?._id) {
        await dispatch(updateShop({ id: initialData._id, data: payload })).unwrap();
        toast.success(t("shopUpdated"));
      } else {
        await dispatch(createShop(payload)).unwrap();
        toast.success(t("shopCreated"));
      }
      onClose(true);
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || t("operationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-white dark:bg-[#111111] border ${
      hasError ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"
    } p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] transition-colors font-medium text-black dark:text-white`;

  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";
  const errorClass = "text-[9px] text-red-500 font-bold mt-1 uppercase tracking-wider";

  const saveAllowed =
    !loading &&
    formData.name.trim() !== "" &&
    formData.contact.phone.trim() !== "" &&
    formData.address.city.trim() !== "" &&
    formData.address.state.trim() !== "" &&
    formData.address.pincode.trim() !== "";

  const isEdit = !!initialData;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 size={28} className="animate-spin text-[#E9B10C]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
            {t("loadingModal")}
          </span>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>{t("shopName")} *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass(errors.name)}
              />
              {errors.name && <p className={errorClass}>{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass}>{t("shopType")}</label>
              <select
                value={formData.shopType}
                onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
                className={inputClass(false)}
              >
                <option value="RETAIL">{t("retail")}</option>
                <option value="WHOLESALE">{t("wholesale")}</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>{t("status")}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={inputClass(false)}
              >
                <option value="ACTIVE">{t("active")}</option>
                <option value="CLOSED">{t("closed")}</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>{t("phone")} *</label>
              <input
                type="text"
                value={formData.contact.phone}
                onChange={(e) =>
                  setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })
                }
                className={inputClass(errors.phone)}
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4">
              {t("location")}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>{t("streetAddress")}</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })
                  }
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className={labelClass}>{t("city")} *</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })
                  }
                  className={inputClass(errors.city)}
                />
                {errors.city && <p className={errorClass}>{errors.city}</p>}
              </div>

              <div>
                <label className={labelClass}>{t("state")} *</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })
                  }
                  className={inputClass(errors.state)}
                />
                {errors.state && <p className={errorClass}>{errors.state}</p>}
              </div>

              <div>
                <label className={labelClass}>{t("pincode")} *</label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })
                  }
                  className={inputClass(errors.pincode)}
                  placeholder="e.g. 110001"
                  maxLength={10}
                />
                {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}
              </div>

              <div>
                <label className={labelClass}>{t("email")}</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })
                  }
                  className={inputClass(false)}
                />
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4">
                {t("configuration")}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>{t("invoicePrefix")}</label>
                  <input
                    type="text"
                    value={formData.settings.invoicePrefix}
                    onChange={(e) =>
                      setFormData({ ...formData, settings: { ...formData.settings, invoicePrefix: e.target.value } })
                    }
                    className={inputClass(false)}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.printReceipt}
                    onChange={(e) =>
                      setFormData({ ...formData, settings: { ...formData.settings, printReceipt: e.target.checked } })
                    }
                    className="accent-[#E9B10C] w-3 h-3"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                    {t("autoPrintReceipts")}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.settings.dailyClosingRequired}
                    onChange={(e) =>
                      setFormData({ ...formData, settings: { ...formData.settings, dailyClosingRequired: e.target.checked } })
                    }
                    className="accent-[#E9B10C] w-3 h-3"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                    {t("requireDailyClosing")}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-6 py-2 text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {t("cancel")}
          </button>

          <button
            type="submit"
            disabled={!saveAllowed}
            className={`flex items-center gap-2 px-6 py-2 text-[10px] uppercase font-bold rounded-sm transition-colors ${
              saveAllowed
                ? "bg-[#E9B10C] text-black hover:bg-[#d4a00a] cursor-pointer"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : t("save")}
          </button>
        </div>
      </form>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => onClose(false)}
      title={isEdit ? t("editShop") : t("addShop")}
      maxWidth="max-w-2xl"
    >
      {renderContent()}
    </BaseModal>
  );
};