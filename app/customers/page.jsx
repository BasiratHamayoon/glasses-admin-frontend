"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  fetchCustomers,
  fetchCustomerStats,
  getCustomerById
} from "@/redux/actions/customerActions";
import { fetchShops } from "@/redux/actions/shopActions";

import { CustomerFilter } from "@/components/filters/CustomerFilter";
import { CustomerTable } from "@/components/tables/CustomerTable";
import { BasePagination } from "@/components/pagination/BasePagination";
import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { CustomerStats } from "@/components/cards/statCards/CustomerStats";

import { CustomerModal } from "@/components/modals/addUpdate/CustomerModal";
import { PrescriptionModal } from "@/components/modals/addUpdate/PrescriptionModal";
import { CustomerViewModal } from "@/components/modals/view/CustomerViewModal";

const ITEMS_PER_PAGE = 15;
const initialFilters = { search: "", status: [], isWebsiteUser: [], loyaltyTier: [] };

export default function CustomersPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setAddOpen] = useState(false);
  const [isPrescriptionOpen, setPrescriptionOpen] = useState(false);
  const [viewData, setViewData] = useState({ isOpen: false, data: null });
  const [selectedItem, setSelectedItem] = useState(null);

  const debounceTimer = useRef(null);
  const initFetched = useRef(false);
  const isMounted = useRef(false);

  const stateRef = useRef({ filters, currentPage });
  useEffect(() => {
    stateRef.current = { filters, currentPage };
  });

  const {
    customers = { items: [], loading: false, pagination: {} },
    stats = null
  } = useSelector(state => state.customers || {});

  useEffect(() => {
    if (!initFetched.current) {
      dispatch(fetchShops({ limit: 100 }));
      initFetched.current = true;
    }
  }, [dispatch]);

  const buildParams = (f, page) => {
    const params = { page, limit: ITEMS_PER_PAGE };
    if (f.search) params.search = f.search;
    if (f.status?.length) params.status = f.status.join(",");
    if (f.isWebsiteUser?.length) params.isWebsiteUser = f.isWebsiteUser[0];
    if (f.loyaltyTier?.length) params.loyaltyTier = f.loyaltyTier.join(",");
    return params;
  };

  const runFetch = useCallback((f, page) => {
    dispatch(fetchCustomerStats());
    dispatch(fetchCustomers(buildParams(f, page)));
  }, [dispatch]);

  const scheduleFetch = useCallback((f, page, delay = 300) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      runFetch(f, page);
    }, delay);
  }, [runFetch]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      runFetch(initialFilters, 1);
      return;
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleFetch(stateRef.current.filters, currentPage, 0);
  }, [currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    setCurrentPage(1);
    scheduleFetch(filters, 1, 300);
  }, [
    filters.search,
    filters.status,
    filters.isWebsiteUser,
    filters.loyaltyTier,
  ]);

  const refreshCurrent = useCallback(() => {
    const { filters: f, currentPage: page } = stateRef.current;
    runFetch(f, page);
  }, [runFetch]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handleViewProfile = async (customer) => {
    try {
      const toastId = toast.loading("Loading profile...");
      const fullProfile = await dispatch(getCustomerById(customer._id)).unwrap();
      toast.dismiss(toastId);
      setViewData({ isOpen: true, data: fullProfile });
    } catch {
      toast.error("Failed to load customer profile");
    }
  };

  const safeCustomerData = Array.isArray(customers?.items) ? customers.items : [];

  if (!isMounted.current && customers.loading && !customers.items.length && !stats) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <CustomerStats stats={stats} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">
          {t("customers") || "Customer Directory"}
        </h1>
        <button
          onClick={() => { setSelectedItem(null); setAddOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm shrink-0"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="text-[10px] uppercase font-black tracking-widest">{t("addCustomer") || "Add Customer"}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <CustomerFilter
          filters={filters}
          setFilters={setFilters}
          onApply={() => {}}
          onClear={handleClearFilters}
        />
        <CustomerTable
          data={safeCustomerData}
          loading={customers?.loading}
          onView={handleViewProfile}
          onEdit={(item) => { setSelectedItem(item); setAddOpen(true); }}
          onAddPrescription={(item) => { setSelectedItem(item); setPrescriptionOpen(true); }}
        />
        <BasePagination
          currentPage={currentPage}
          totalPages={customers.pagination?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>

      <CustomerModal
        isOpen={isAddOpen}
        onClose={() => { setAddOpen(false); refreshCurrent(); }}
        initialData={selectedItem}
        onSuccess={refreshCurrent}
      />
      <CustomerViewModal
        isOpen={viewData.isOpen}
        onClose={() => setViewData({ isOpen: false, data: null })}
        data={viewData.data}
      />
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={() => { setPrescriptionOpen(false); refreshCurrent(); }}
        customer={selectedItem}
      />
    </div>
  );
}