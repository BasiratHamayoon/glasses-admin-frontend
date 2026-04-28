"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { fetchShops, deleteShop, getShopById } from "@/redux/actions/shopActions";

import { ShopFilter } from "@/components/filters/ShopFilter";
import { ShopCard } from "@/components/cards/ShopCard";
import { BasePagination } from "@/components/pagination/BasePagination"; 
import { ShopStats } from "@/components/cards/statCards/ShopStats";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";

import { ShopModal } from "@/components/modals/addUpdate/ShopModal";
import { ShopViewModal } from "@/components/modals/view/ShopViewModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";

export default function ShopsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [shopFilters, setShopFilters] = useState({ search: '', status: [], shopType: [], city: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [deleteData, setDeleteData] = useState({ isOpen: false, item: null, loading: false });

  const debounceTimer = useRef(null);

  const { shops = { items: [], loading: false, pagination: {} } } = useSelector(state => state.shops || {});

  const loadData = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      dispatch(fetchShops({ ...shopFilters, page: currentPage, limit: itemsPerPage }));
    }, 300);
  }, [dispatch, currentPage, shopFilters]);

  useEffect(() => { 
    loadData(); 
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [loadData]);

  const handleViewShop = async (shop) => {
    try {
      const fullShopData = await dispatch(getShopById(shop._id)).unwrap();
      setSelectedItem(fullShopData); 
      setViewModalOpen(true);
    } catch (e) { toast.error(t("error") || "Failed to load details"); }
  };

  const handleEditShop = async (shop) => {
    try {
      const fullShopData = await dispatch(getShopById(shop._id)).unwrap();
      setSelectedItem(fullShopData.shop); 
      setEditModalOpen(true);
    } catch (e) { toast.error(t("error") || "Failed to load details"); }
  };

  const confirmDelete = async () => {
    setDeleteData(prev => ({ ...prev, loading: true }));
    try {
      await dispatch(deleteShop(deleteData.item._id)).unwrap();
      toast.success(t("deleteSuccess") || 'Shop deleted successfully');
      setDeleteData({ isOpen: false, item: null, loading: false });
      loadData();
    } catch (err) { 
      toast.error(typeof err === 'string' ? err : "Failed to delete shop"); 
      setDeleteData(prev => ({ ...prev, loading: false })); 
    }
  };

  if (shops.loading && !shops.items?.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      
      <ShopStats shops={shops.items} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">
          {t("shops") || "Shop Management"}
        </h1>
        
        <button onClick={() => { setSelectedItem(null); setEditModalOpen(true); }} className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors text-[10px] uppercase font-black rounded-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
          <Plus size={14} /> {t("addShop") || "Add Shop"}
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <ShopFilter 
          filters={shopFilters} 
          setFilters={setShopFilters} 
          onApply={() => { setCurrentPage(1); loadData(); }} 
          onClear={() => { setShopFilters({ search: '', status: [], shopType: [], city: '' }); setCurrentPage(1); setTimeout(loadData, 100); }} 
        />
        
        {shops.items.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 uppercase font-bold text-[10px] tracking-widest border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
            No shops found
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shops.items.map(shop => (
              <ShopCard 
                key={shop._id} 
                shop={shop} 
                onView={() => handleViewShop(shop)} 
                onEdit={() => handleEditShop(shop)} 
                onDelete={() => setDeleteData({isOpen: true, item: shop})} 
              />
            ))}
          </div>
        )}
        
        <BasePagination currentPage={currentPage} totalPages={shops.pagination?.totalPages || 1} onPageChange={setCurrentPage} />
      </div>

      <ShopModal isOpen={isEditModalOpen} onClose={() => { setEditModalOpen(false); loadData(); }} initialData={selectedItem} />
      <ShopViewModal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} data={selectedItem} />
      
      <ConfirmationModal isOpen={deleteData.isOpen} onClose={() => setDeleteData({...deleteData, isOpen: false})} onConfirm={confirmDelete} loading={deleteData.loading} message={t("deleteWarning") || "Are you sure you want to delete this shop?"} />
    </div>
  );
}