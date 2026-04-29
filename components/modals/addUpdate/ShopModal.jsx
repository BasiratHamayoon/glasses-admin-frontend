"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createShop, updateShop } from "@/redux/actions/shopActions";
import { BaseModal } from "../BaseModal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ShopModal = ({ isOpen, onClose, initialData = null }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const defaultForm = {
    name: "",
    code: "",
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
      setErrors({});
      setActiveTab("basic");
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Shop name is required";
    if (!formData.code.trim()) newErrors.code = "Shop code is required";
    if (!formData.contact.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.city.trim()) newErrors.city = "City is required";
    if (!formData.address.state.trim()) newErrors.state = "State is required";
    if (!formData.address.pincode.trim()) newErrors.pincode = "Pincode is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      if (!formData.address.pincode.trim()) {
        setActiveTab("basic");
        toast.error("Please fill in all required fields including Pincode");
      }
      return;
    }
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));
      const systemFields = ["_id", "id", "__v", "createdAt", "updatedAt", "fullAddress", "employeesCount", "financialSummary", "posDevices", "workingHours"];
      systemFields.forEach((field) => delete payload[field]);
      if (payload.contact?.phone) payload.contact.phone = payload.contact.phone.replace(/\D/g, "");

      if (initialData?._id) {
        await dispatch(updateShop({ id: initialData._id, data: payload })).unwrap();
        toast.success("Shop updated successfully");
      } else {
        await dispatch(createShop(payload)).unwrap();
        toast.success("Shop created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-white dark:bg-[#111111] border ${hasError ? "border-red-500" : "border-neutral-300 dark:border-neutral-700"} p-2 text-[11px] outline-none rounded-sm focus:border-[#E9B10C] font-medium`;

  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";
  const errorClass = "text-[9px] text-red-500 font-bold mt-1 uppercase tracking-wider";

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Shop" : "Add New Shop"} maxWidth="max-w-2xl">
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4">
        {["basic", "config"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab ? "border-[#E9B10C] text-[#E9B10C]" : "border-transparent text-neutral-500"
            }`}
          >
            {tab === "basic" ? "Basic Profile" : "Configuration"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Shop Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              <div>
                <label className={labelClass}>Shop Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className={`${inputClass(errors.code)} uppercase`}
                  placeholder="e.g. BR-01"
                />
                {errors.code && <p className={errorClass}>{errors.code}</p>}
              </div>

              <div>
                <label className={labelClass}>Shop Type</label>
                <select
                  value={formData.shopType}
                  onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
                  className={inputClass(false)}
                >
                  <option value="RETAIL">Retail</option>
                  <option value="WHOLESALE">Wholesale</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Primary Phone *</label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                  className={inputClass(errors.phone)}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={inputClass(false)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#E9B10C] mb-4">Location</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                    className={inputClass(false)}
                  />
                </div>

                <div>
                  <label className={labelClass}>City *</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className={inputClass(errors.city)}
                  />
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>

                <div>
                  <label className={labelClass}>State *</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    className={inputClass(errors.state)}
                  />
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>

                <div>
                  <label className={labelClass}>Pincode *</label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                    className={inputClass(errors.pincode)}
                    placeholder="e.g. 110001"
                    maxLength={10}
                  />
                  {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                    className={inputClass(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Invoice Prefix</label>
              <input
                type="text"
                value={formData.settings.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, invoicePrefix: e.target.value } })}
                className={inputClass(false)}
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.settings.printReceipt}
                onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, printReceipt: e.target.checked } })}
                className="accent-[#E9B10C] w-4 h-4"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">Auto Print Receipts</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.settings.dailyClosingRequired}
                onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, dailyClosingRequired: e.target.checked } })}
                className="accent-[#E9B10C] w-4 h-4"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest">Require Daily Closing</span>
            </label>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-transparent text-[10px] uppercase font-bold text-neutral-500 border border-neutral-300 dark:border-neutral-700 rounded-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#E9B10C] text-[10px] uppercase font-bold text-black rounded-sm disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Save Shop"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};