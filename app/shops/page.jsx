// ShopsPage.jsx
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

const ITEMS_PER_PAGE = 10;
const initialFilters = { search: "", status: [], shopType: [] };

export default function ShopsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [shopFilters, setShopFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteData, setDeleteData] = useState({ isOpen: false, item: null, loading: false });

  const debounceTimer = useRef(null);
  const isFirstRender = useRef(true);
  const skipNextPageEffect = useRef(true);
  const filtersRef = useRef(initialFilters);
  const pageRef = useRef(1);

  const { shops = { items: [], loading: false, pagination: {} } } = useSelector(
    (state) => state.shops || {}
  );

  const runFetch = useCallback((page, filters) => {
    dispatch(fetchShops({ ...filters, page, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  useEffect(() => {
    filtersRef.current = shopFilters;
  }, [shopFilters]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    isFirstRender.current = false;
    skipNextPageEffect.current = true;
    runFetch(1, initialFilters);
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(currentPage, filtersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (isFirstRender.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(1, shopFilters);
    }, 300);
  }, [shopFilters.search, shopFilters.status, shopFilters.shopType]);

  const refreshCurrent = useCallback(() => {
    runFetch(pageRef.current, filtersRef.current);
  }, [runFetch]);

  const handleViewShop = async (shop) => {
    setSelectedItem(null);
    setViewModalOpen(true);
    setViewLoading(true);
    try {
      const fullShopData = await dispatch(getShopById(shop._id)).unwrap();
      setSelectedItem(fullShopData);
    } catch (e) {
      toast.error(t("errorLoadingDetails"));
      setViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEditShop = async (shop) => {
    setSelectedItem(null);
    setEditModalOpen(true);
    setEditLoading(true);
    try {
      const fullShopData = await dispatch(getShopById(shop._id)).unwrap();
      setSelectedItem(fullShopData.shop);
    } catch (e) {
      toast.error(t("errorLoadingDetails"));
      setEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setEditModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteData((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(deleteShop(deleteData.item._id)).unwrap();
      toast.success(t("shopDeleted"));
      setDeleteData({ isOpen: false, item: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("operationFailed"));
      setDeleteData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleModalClose = (didSave) => {
    setEditModalOpen(false);
    setSelectedItem(null);
    if (didSave) refreshCurrent();
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedItem(null);
  };

  if (shops.loading && !shops.items?.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <ShopStats shops={shops.items} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-[11px] uppercase tracking-[0.3em] font-black text-black dark:text-white">
          {t("shops")}
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors text-[10px] uppercase font-black rounded-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus size={14} strokeWidth={3} />
          {t("addShop")}
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <ShopFilter
          filters={shopFilters}
          setFilters={setShopFilters}
          onClear={() => setShopFilters(initialFilters)}
        />

        {shops.loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-neutral-100 dark:bg-neutral-800 rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : shops.items.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 uppercase font-bold text-[10px] tracking-widest border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm">
            {t("noShopsFound")}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shops.items.map((shop) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                onView={() => handleViewShop(shop)}
                onEdit={() => handleEditShop(shop)}
                onDelete={() => setDeleteData({ isOpen: true, item: shop, loading: false })}
              />
            ))}
          </div>
        )}

        <BasePagination
          currentPage={currentPage}
          totalPages={shops.pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <ShopModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        initialData={selectedItem}
        isLoading={editLoading}
      />
      <ShopViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        data={selectedItem}
        isLoading={viewLoading}
      />
      <ConfirmationModal
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={confirmDelete}
        loading={deleteData.loading}
        message={`${t("deleteConfirm")} ${deleteData.item?.name}?`}
      />
    </div>
  );
}