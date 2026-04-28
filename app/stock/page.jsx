"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

import { fetchStocks, fetchWebsiteStocks, fetchWebsiteStockSummary } from "@/redux/actions/inventoryActions";
import { fetchProducts } from "@/redux/actions/productActions";
import { fetchShops } from "@/redux/actions/shopActions";

import { StockFilter } from "@/components/filters/StockFilter";
import { StockTable } from "@/components/tables/StockTable";
import { BasePagination } from "@/components/pagination/BasePagination"; 
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { InventoryStats } from "@/components/cards/statCards/InventoryStats";

import { StockModal } from "@/components/modals/addUpdate/StockModal";
import { WebsiteStockModal } from "@/components/modals/addUpdate/WebsiteStockModal";
import { StockViewModal } from "@/components/modals/view/StockViewModal";

export default function InventoryPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState("shopStock");
  const [stockFilters, setStockFilters] = useState({ search: '', status: [] });
  const [webStockFilters, setWebStockFilters] = useState({ search: '', status: [], isVisible: [] });
  
  const [isEditStockOpen, setEditStockOpen] = useState(false);
  const [isEditWebStockOpen, setEditWebStockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [viewStock, setViewStock] = useState({ isOpen: false, data: null, isWebsite: false });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const debounceTimer = useRef(null);
  const initFetched = useRef(false);

  const { stocks, websiteStocks } = useSelector(state => state.inventory);

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchProducts({ limit: 500 })); 
      dispatch(fetchShops({ limit: 100 })); 
      initFetched.current = true;
    }
  }, [dispatch]);

  const loadData = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (activeTab === 'webStock') {
        dispatch(fetchWebsiteStockSummary());
        dispatch(fetchWebsiteStocks({ ...webStockFilters, page: currentPage, limit: itemsPerPage }));
      } else if (activeTab === 'shopStock') {
        dispatch(fetchStocks({ ...stockFilters, page: currentPage, limit: itemsPerPage }));
      }
    }, 300);
  }, [dispatch, activeTab, currentPage, stockFilters, webStockFilters]);

  useEffect(() => { 
    loadData(); 
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [loadData]); 

  if (stocks.loading && !stocks.items.length) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <InventoryStats summary={websiteStocks.summary} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div key={language} className="flex overflow-x-auto scrollbar-hide bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto shadow-sm">
          {[{ id: "shopStock", label: t("shopStock") }, { id: "webStock", label: t("websiteStock") }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }} className={`flex-none px-6 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${activeTab === tab.id ? 'bg-[#E9B10C] text-black shadow-sm' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide">
          {activeTab === 'shopStock' && (
            <button onClick={() => { setSelectedItem(null); setEditStockOpen(true); }} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] transition-colors rounded-sm shrink-0">
              <Plus size={14} strokeWidth={3} /> <span className="text-[10px] uppercase font-black">{t("addShopStock")}</span>
            </button>
          )}
          {activeTab === 'webStock' && (
            <button onClick={() => { setSelectedItem(null); setEditWebStockOpen(true); }} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] transition-colors rounded-sm shrink-0">
              <Plus size={14} strokeWidth={3} /> <span className="text-[10px] uppercase font-black">{t("addWebStock")}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === 'shopStock' && (
          <>
            <StockFilter filters={stockFilters} setFilters={setStockFilters} onApply={() => { setCurrentPage(1); loadData(); }} onClear={() => { setStockFilters({ search: '', status: [] }); setCurrentPage(1); setTimeout(loadData, 100); }} />
            <StockTable data={stocks.items} loading={stocks.loading} onView={(item) => setViewStock({ isOpen: true, data: item, isWebsite: false })} onEdit={(item) => { setSelectedItem(item); setEditStockOpen(true); }} />
            <BasePagination currentPage={currentPage} totalPages={stocks.pagination?.totalPages || 1} onPageChange={setCurrentPage} />
          </>
        )}
        {activeTab === 'webStock' && (
          <>
            <StockFilter filters={webStockFilters} setFilters={setWebStockFilters} onApply={() => { setCurrentPage(1); loadData(); }} onClear={() => { setWebStockFilters({ search: '', status: [], isVisible: [] }); setCurrentPage(1); setTimeout(loadData, 100); }} isWebsite={true} />
            <StockTable data={websiteStocks.items} loading={websiteStocks.loading} onView={(item) => setViewStock({ isOpen: true, data: item, isWebsite: true })} onEdit={(item) => { setSelectedItem(item); setEditWebStockOpen(true); }} isWebsite={true} />
            <BasePagination currentPage={currentPage} totalPages={websiteStocks.pagination?.totalPages || 1} onPageChange={setCurrentPage} />
          </>
        )}
      </div>

      <StockModal isOpen={isEditStockOpen} onClose={() => { setEditStockOpen(false); loadData(); }} initialData={selectedItem} />
      <WebsiteStockModal isOpen={isEditWebStockOpen} onClose={() => { setEditWebStockOpen(false); loadData(); }} initialData={selectedItem} />
      <StockViewModal isOpen={viewStock.isOpen} onClose={() => setViewStock({ isOpen: false, data: null, isWebsite: false })} stock={viewStock.data} isWebsite={viewStock.isWebsite} />
    </div>
  );
}