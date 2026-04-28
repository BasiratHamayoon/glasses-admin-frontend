"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct } from "@/redux/actions/productActions";
import { fetchCategories } from "@/redux/actions/categoryActions";
import { BaseModal } from "../BaseModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, Star } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

export const ProductModal = ({ isOpen, onClose, initialData = null }) => {
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';
  
  const { items: categories = [] } = useSelector(state => state.categories || {});
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const defaultForm = {
    name: "", sku: "", barcode: "", productType: "FRAME", 
    category: "", brand: "", gender: "UNISEX", ageGroup: "ADULT",
    description: "", costPrice: 0, sellingPrice: 0, mrp: 0, 
    discount: 0, discountType: "PERCENTAGE", taxRate: 0,
    tags: "", images: [],
    frameSpecs: { frameWidth: "", frameShape: "", frameMaterial: "", frameType: "" },
    lensSpecs: { lensType: "", lensMaterial: "" }
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) {
        dispatch(fetchCategories({}));
      }
      
      if (initialData) {
        setFormData({
          ...defaultForm,
          ...initialData,
          category: initialData.category?._id || initialData.category || "",
          brand: initialData.brand?._id || initialData.brand || "",
          tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : "",
          images: initialData.images || [],
          frameSpecs: { ...defaultForm.frameSpecs, ...(initialData.frameSpecs || {}) },
          lensSpecs: { ...defaultForm.lensSpecs, ...(initialData.lensSpecs || {}) }
        });
      } else {
        setFormData(defaultForm);
      }
      setActiveTab('basic');
    }
  }, [isOpen, initialData, categories.length, dispatch]);

  const handleNestedChange = (group, field, value) => {
    setFormData(prev => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
  };

  const handleSystemImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return { url: base64, isPrimary: false };
        })
      );

      setFormData(prev => {
        const updated = [...prev.images, ...newImages];
        if (updated.length > 0 && !updated.find(img => img.isPrimary)) {
          updated[0].isPrimary = true;
        }
        return { ...prev, images: updated };
      });
    } catch (err) {
      toast.error("Failed to read images");
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.find(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => {
      const updated = prev.images.map((img, i) => ({ ...img, isPrimary: i === index }));
      return { ...prev, images: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = JSON.parse(JSON.stringify(formData));
      
      payload.tags = payload.tags ? payload.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      if (!payload.barcode) delete payload.barcode;
      if (!payload.brand) delete payload.brand;

      Object.keys(payload.frameSpecs).forEach(k => { if (!payload.frameSpecs[k]) delete payload.frameSpecs[k]; });
      if (Object.keys(payload.frameSpecs).length === 0) delete payload.frameSpecs;

      Object.keys(payload.lensSpecs).forEach(k => { if (!payload.lensSpecs[k]) delete payload.lensSpecs[k]; });
      if (Object.keys(payload.lensSpecs).length === 0) delete payload.lensSpecs;

      if (initialData?._id) {
        await dispatch(updateProduct({ id: initialData._id, data: payload })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product created successfully');
      }
      
      onClose(true); 
    } catch (err) {
      toast.error(err?.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-[#111111] text-black dark:text-white border border-neutral-300 dark:border-neutral-700 p-2 text-[11px] outline-none focus:border-[#E9B10C] transition-colors rounded-sm";
  const labelClass = "block text-[9px] uppercase tracking-widest font-bold mb-1.5 text-neutral-500";

  return (
    <BaseModal isOpen={isOpen} onClose={() => onClose(false)} title={initialData ? 'Edit Product' : 'Add Product'} maxWidth="max-w-3xl">
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-4 pb-2 gap-4 overflow-x-auto scrollbar-hide">
        {['basic', 'media', 'pricing', 'frameSpecs', 'lensSpecs'].map(tab => (
          <button 
            key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`text-[9px] uppercase tracking-[0.2em] font-black pb-2 border-b-2 whitespace-nowrap transition-all ${activeTab === tab ? 'border-[#E9B10C] text-[#E9B10C]' : 'border-transparent text-neutral-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className={labelClass}>Name *</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>SKU *</label><input type="text" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className={inputClass} /></div>
            <div><label className={labelClass}>Barcode</label><input type="text" value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Product Type *</label>
              <select required value={formData.productType} onChange={e => setFormData({...formData, productType: e.target.value})} className={inputClass}>
                {['FRAME', 'SUNGLASSES', 'LENS', 'ACCESSORY'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClass}>
                <option value="">Select...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className={inputClass}>
                {['UNISEX', 'MALE', 'FEMALE', 'KIDS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Age Group</label>
              <select value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value})} className={inputClass}>
                {['ADULT', 'KIDS', 'TEEN', 'ALL'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className={labelClass}>Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={inputClass} /></div>
          </div>
        )}

        {activeTab === 'media' && (
           <div className="flex flex-col gap-4">
             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
               <UploadCloud className="w-8 h-8 mb-2 text-neutral-400" />
               <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Click to Select Images from System</span>
               <input type="file" multiple accept="image/*" className="hidden" onChange={handleSystemImageSelect} />
             </label>

             {formData.images.length > 0 && (
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                 {formData.images.map((img, index) => (
                   <div key={index} className={`relative group rounded-sm overflow-hidden border-2 ${img.isPrimary ? 'border-[#E9B10C]' : 'border-transparent'}`}>
                     <SafeImage src={img.url} className="w-full h-32 object-cover bg-neutral-100" />
                     
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                       <button type="button" onClick={() => setPrimaryImage(index)} className="px-3 py-1 bg-white text-black text-[8px] uppercase tracking-widest font-black rounded-sm hover:bg-[#E9B10C] transition-colors">
                         Set Primary
                       </button>
                       <button type="button" onClick={() => removeImage(index)} className="px-3 py-1 bg-red-500 text-white text-[8px] uppercase tracking-widest font-black rounded-sm hover:bg-red-600 transition-colors">
                         Remove
                       </button>
                     </div>
                     {img.isPrimary && <div className="absolute top-1 left-1 bg-[#E9B10C] text-black text-[7px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1"><Star size={8} className="fill-black" /> Primary</div>}
                   </div>
                 ))}
               </div>
             )}
           </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Cost Price (SAR) *</label><input type="number" required min="0" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} className={inputClass} /></div>
            <div><label className={labelClass}>Selling Price (SAR) *</label><input type="number" required min="0" value={formData.sellingPrice} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})} className={inputClass} /></div>
            <div><label className={labelClass}>Discount</label><input type="number" min="0" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className={inputClass} /></div>
            <div><label className={labelClass}>Discount Type</label><select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className={inputClass}><option value="PERCENTAGE">Percentage (%)</option><option value="FIXED">Fixed Amount (SAR)</option></select></div>
          </div>
        )}

        {activeTab === 'frameSpecs' && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Frame Shape</label><select value={formData.frameSpecs.frameShape} onChange={e => handleNestedChange('frameSpecs', 'frameShape', e.target.value)} className={inputClass}><option value="">Select...</option>{['RECTANGLE', 'ROUND', 'OVAL', 'SQUARE', 'CAT_EYE', 'AVIATOR', 'WAYFARER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className={labelClass}>Frame Material</label><select value={formData.frameSpecs.frameMaterial} onChange={e => handleNestedChange('frameSpecs', 'frameMaterial', e.target.value)} className={inputClass}><option value="">Select...</option>{['METAL', 'PLASTIC', 'ACETATE', 'TITANIUM', 'CARBON_FIBER'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            <div><label className={labelClass}>Frame Type</label><select value={formData.frameSpecs.frameType} onChange={e => handleNestedChange('frameSpecs', 'frameType', e.target.value)} className={inputClass}><option value="">Select...</option>{['FULL_RIM', 'HALF_RIM', 'RIMLESS'].map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>)}</select></div>
            <div><label className={labelClass}>Frame Width (mm)</label><input type="number" value={formData.frameSpecs.frameWidth} onChange={e => handleNestedChange('frameSpecs', 'frameWidth', Number(e.target.value))} className={inputClass} /></div>
          </div>
        )}

        {activeTab === 'lensSpecs' && (
           <div className="grid grid-cols-2 gap-4">
             <div><label className={labelClass}>Lens Type</label><select value={formData.lensSpecs.lensType} onChange={e => handleNestedChange('lensSpecs', 'lensType', e.target.value)} className={inputClass}><option value="">Select...</option>{['SINGLE_VISION', 'BIFOCAL', 'PROGRESSIVE', 'READING', 'POLARIZED'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
             <div><label className={labelClass}>Lens Material</label><select value={formData.lensSpecs.lensMaterial} onChange={e => handleNestedChange('lensSpecs', 'lensMaterial', e.target.value)} className={inputClass}><option value="">Select...</option>{['CR39', 'POLYCARBONATE', 'TRIVEX', 'GLASS'].map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
           </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <button type="button" onClick={() => onClose(false)} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded-sm">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#E9B10C] text-black hover:bg-[#d4a00a] transition-colors flex items-center gap-2 rounded-sm">
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};