"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus } from "lucide-react";

import {
  fetchStocks, fetchWebsiteStocks, fetchWebsiteStockSummary,
  fetchInventoryProducts, fetchInventoryShops,
  fetchAdjustments, fetchTransfers, fetchStockValuation,
} from "@/redux/actions/inventoryActions";

import { StockFilter } from "@/components/filters/StockFilter";
import { AdjustmentFilter } from "@/components/filters/AdjustmentFilter";
import { TransferFilter } from "@/components/filters/TransferFilter";
import { StockTable } from "@/components/tables/StockTable";
import { AdjustmentTable } from "@/components/tables/AdjustmentTable";
import { TransferTable } from "@/components/tables/TransferTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { InventoryStats } from "@/components/cards/statCards/InventoryStats";
import { StockModal } from "@/components/modals/addUpdate/StockModal";
import { WebsiteStockModal } from "@/components/modals/addUpdate/WebsiteStockModal";
import { AdjustmentModal } from "@/components/modals/addUpdate/AdjustmentModal";
import { TransferModal } from "@/components/modals/addUpdate/TransferModal";
import { StockViewModal } from "@/components/modals/view/StockViewModal";
import { AdjustmentViewModal } from "@/components/modals/view/AdjustmentViewModal";
import { TransferViewModal } from "@/components/modals/view/TransferViewModal";

const ITEMS_PER_PAGE = 15;

const initialStockFilters = { search: "", status: [] };
const initialWebStockFilters = { search: "", status: [] };
const initialAdjFilters = { search: "", status: [], adjustmentType: [] };
const initialTransferFilters = { search: "", status: [], transferType: [] };

const TABS = [
  { id: "shopStock", labelKey: "shopStock" },
  { id: "webStock", labelKey: "websiteStock" },
  { id: "adjustments", labelKey: "stockAdjustments" },
  { id: "transfers", labelKey: "stockTransfers" },
];

export default function InventoryPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activeTab, setActiveTab] = useState("shopStock");
  const [stockFilters, setStockFilters] = useState(initialStockFilters);
  const [webStockFilters, setWebStockFilters] = useState(initialWebStockFilters);
  const [adjFilters, setAdjFilters] = useState(initialAdjFilters);
  const [transferFilters, setTransferFilters] = useState(initialTransferFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const [isWebStockModalOpen, setWebStockModalOpen] = useState(false);
  const [isAdjModalOpen, setAdjModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [viewStockModal, setViewStockModal] = useState({ isOpen: false, data: null, isWebsite: false });
  const [viewAdjModal, setViewAdjModal] = useState({ isOpen: false, data: null });
  const [viewTransferModal, setViewTransferModal] = useState({ isOpen: false, data: null });

  const debounceTimer = useRef(null);
  const isFirstRender = useRef(true);
  const skipNextPageEffect = useRef(true);
  const activeTabRef = useRef("shopStock");
  const stockFiltersRef = useRef(initialStockFilters);
  const webStockFiltersRef = useRef(initialWebStockFilters);
  const adjFiltersRef = useRef(initialAdjFilters);
  const transferFiltersRef = useRef(initialTransferFilters);
  const pageRef = useRef(1);

  const { stocks, websiteStocks, adjustments, transfers, stockValuation } =
    useSelector((state) => state.inventory);

  const runStockFetch = useCallback((page, filters) => {
    dispatch(fetchStocks({ ...filters, page, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const runWebStockFetch = useCallback((page, filters) => {
    dispatch(fetchWebsiteStocks({ ...filters, page, limit: ITEMS_PER_PAGE }));
    dispatch(fetchWebsiteStockSummary());
  }, [dispatch]);

  const runAdjFetch = useCallback((page, filters) => {
    dispatch(fetchAdjustments({ ...filters, page, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const runTransferFetch = useCallback((page, filters) => {
    dispatch(fetchTransfers({ ...filters, page, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const runFetchForTab = useCallback((tab, page, sF, wF, aF, tF) => {
    if (tab === "shopStock") runStockFetch(page, sF);
    else if (tab === "webStock") runWebStockFetch(page, wF);
    else if (tab === "adjustments") runAdjFetch(page, aF);
    else if (tab === "transfers") runTransferFetch(page, tF);
  }, [runStockFetch, runWebStockFetch, runAdjFetch, runTransferFetch]);

  useEffect(() => { stockFiltersRef.current = stockFilters; }, [stockFilters]);
  useEffect(() => { webStockFiltersRef.current = webStockFilters; }, [webStockFilters]);
  useEffect(() => { adjFiltersRef.current = adjFilters; }, [adjFilters]);
  useEffect(() => { transferFiltersRef.current = transferFilters; }, [transferFilters]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    isFirstRender.current = false;
    skipNextPageEffect.current = true;
    dispatch(fetchStockValuation());
    runFetchForTab(
      "shopStock", 1,
      initialStockFilters, initialWebStockFilters,
      initialAdjFilters, initialTransferFilters
    );
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) { skipNextPageEffect.current = false; return; }
    runFetchForTab(
      activeTabRef.current, currentPage,
      stockFiltersRef.current, webStockFiltersRef.current,
      adjFiltersRef.current, transferFiltersRef.current
    );
  }, [currentPage]);

  useEffect(() => {
    if (isFirstRender.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetchForTab(
      activeTab, 1,
      stockFiltersRef.current, webStockFiltersRef.current,
      adjFiltersRef.current, transferFiltersRef.current
    );
  }, [activeTab]);

  useEffect(() => {
    if (isFirstRender.current) return;
    if (activeTabRef.current !== "shopStock") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runStockFetch(1, stockFilters);
    }, 300);
  }, [stockFilters.search, stockFilters.status]);

  useEffect(() => {
    if (isFirstRender.current) return;
    if (activeTabRef.current !== "webStock") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runWebStockFetch(1, webStockFilters);
    }, 300);
  }, [webStockFilters.search, webStockFilters.status]);

  useEffect(() => {
    if (isFirstRender.current) return;
    if (activeTabRef.current !== "adjustments") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runAdjFetch(1, adjFilters);
    }, 300);
  }, [adjFilters.search, adjFilters.status, adjFilters.adjustmentType]);

  useEffect(() => {
    if (isFirstRender.current) return;
    if (activeTabRef.current !== "transfers") return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runTransferFetch(1, transferFilters);
    }, 300);
  }, [transferFilters.search, transferFilters.status, transferFilters.transferType]);

  const refreshCurrent = useCallback(() => {
    runFetchForTab(
      activeTabRef.current, pageRef.current,
      stockFiltersRef.current, webStockFiltersRef.current,
      adjFiltersRef.current, transferFiltersRef.current
    );
  }, [runFetchForTab]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTabRef.current) return;
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleStockModalOpen = (item = null) => {
    setSelectedItem(item);
    dispatch(fetchInventoryProducts());
    dispatch(fetchInventoryShops());
    setStockModalOpen(true);
  };

  const handleWebStockModalOpen = (item = null) => {
    setSelectedItem(item);
    dispatch(fetchInventoryProducts());
    setWebStockModalOpen(true);
  };

  const handleAdjModalOpen = (item = null) => {
    setSelectedItem(item);
    dispatch(fetchInventoryProducts());
    dispatch(fetchInventoryShops());
    setAdjModalOpen(true);
  };

  const handleTransferModalOpen = (item = null) => {
    setSelectedItem(item);
    dispatch(fetchInventoryProducts());
    dispatch(fetchInventoryShops());
    setTransferModalOpen(true);
  };

  const handleModalClose = (setter) => (didSave) => {
    setter(false);
    if (didSave) refreshCurrent();
  };

  const getCurrentPagination = () => {
    if (activeTab === "shopStock") return stocks.pagination;
    if (activeTab === "webStock") return websiteStocks.pagination;
    if (activeTab === "adjustments") return adjustments.pagination;
    if (activeTab === "transfers") return transfers.pagination;
    return {};
  };

  if (stocks.loading && !stocks.items.length && !websiteStocks.items.length) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <InventoryStats
        stockValuation={stockValuation?.data}
        webSummary={websiteStocks.summary}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex overflow-x-auto scrollbar-hide bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex-none px-5 py-2.5 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#E9B10C] text-black shadow-sm"
                  : "text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeTab === "shopStock" && (
            <button
              type="button"
              onClick={() => handleStockModalOpen(null)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black">{t("addShopStock")}</span>
            </button>
          )}
          {activeTab === "webStock" && (
            <button
              type="button"
              onClick={() => handleWebStockModalOpen(null)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black">{t("addWebStock")}</span>
            </button>
          )}
          {activeTab === "adjustments" && (
            <button
              type="button"
              onClick={() => handleAdjModalOpen(null)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black">{t("newAdjustment")}</span>
            </button>
          )}
          {activeTab === "transfers" && (
            <button
              type="button"
              onClick={() => handleTransferModalOpen(null)}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0 w-full sm:w-auto"
            >
              <Plus size={14} strokeWidth={3} />
              <span className="text-[10px] uppercase font-black">{t("newTransfer")}</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === "shopStock" && (
          <>
            <StockFilter
              filters={stockFilters}
              setFilters={setStockFilters}
              onClear={() => setStockFilters(initialStockFilters)}
            />
            <StockTable
              data={stocks.items}
              loading={stocks.loading}
              onView={(item) => setViewStockModal({ isOpen: true, data: item, isWebsite: false })}
              onEdit={(item) => handleStockModalOpen(item)}
              onRefresh={refreshCurrent}
              isWebsite={false}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={getCurrentPagination()?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "webStock" && (
          <>
            <StockFilter
              filters={webStockFilters}
              setFilters={setWebStockFilters}
              onClear={() => setWebStockFilters(initialWebStockFilters)}
            />
            <StockTable
              data={websiteStocks.items}
              loading={websiteStocks.loading}
              onView={(item) => setViewStockModal({ isOpen: true, data: item, isWebsite: true })}
              onEdit={(item) => handleWebStockModalOpen(item)}
              onRefresh={refreshCurrent}
              isWebsite={true}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={getCurrentPagination()?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "adjustments" && (
          <>
            <AdjustmentFilter
              filters={adjFilters}
              setFilters={setAdjFilters}
              onClear={() => setAdjFilters(initialAdjFilters)}
            />
            <AdjustmentTable
              data={adjustments.items}
              loading={adjustments.loading}
              onView={(item) => setViewAdjModal({ isOpen: true, data: item })}
              onEdit={(item) => handleAdjModalOpen(item)}
              onRefresh={refreshCurrent}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={getCurrentPagination()?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "transfers" && (
          <>
            <TransferFilter
              filters={transferFilters}
              setFilters={setTransferFilters}
              onClear={() => setTransferFilters(initialTransferFilters)}
            />
            <TransferTable
              data={transfers.items}
              loading={transfers.loading}
              onView={(item) => setViewTransferModal({ isOpen: true, data: item })}
              onEdit={(item) => handleTransferModalOpen(item)}
              onRefresh={refreshCurrent}
            />
            <BasePagination
              currentPage={currentPage}
              totalPages={getCurrentPagination()?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <StockModal
        isOpen={isStockModalOpen}
        onClose={handleModalClose(setStockModalOpen)}
        initialData={selectedItem}
      />
      <WebsiteStockModal
        isOpen={isWebStockModalOpen}
        onClose={handleModalClose(setWebStockModalOpen)}
        initialData={selectedItem}
      />
      <AdjustmentModal
        isOpen={isAdjModalOpen}
        onClose={handleModalClose(setAdjModalOpen)}
        initialData={selectedItem}
      />
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={handleModalClose(setTransferModalOpen)}
        initialData={selectedItem}
      />
      <StockViewModal
        isOpen={viewStockModal.isOpen}
        onClose={() => setViewStockModal({ isOpen: false, data: null, isWebsite: false })}
        stock={viewStockModal.data}
        isWebsite={viewStockModal.isWebsite}
      />
      <AdjustmentViewModal
        isOpen={viewAdjModal.isOpen}
        onClose={() => setViewAdjModal({ isOpen: false, data: null })}
        adjustment={viewAdjModal.data}
        onRefresh={refreshCurrent}
      />
      <TransferViewModal
        isOpen={viewTransferModal.isOpen}
        onClose={() => setViewTransferModal({ isOpen: false, data: null })}
        transfer={viewTransferModal.data}
        onRefresh={refreshCurrent}
      />
    </div>
  );
}