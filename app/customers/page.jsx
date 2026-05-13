"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

import {
  fetchCustomers,
  fetchCustomerStats,
  getCustomerById,
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

const ITEMS_PER_PAGE = 50;
const initialFilters = {
  search: "",
  status: [],
  isWebsiteUser: [],
  loyaltyTier: [],
};

export default function CustomersPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [isPrescriptionOpen, setPrescriptionOpen] = useState(false);
  const [viewData, setViewData] = useState({
    isOpen: false,
    data: null,
    loading: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);

  const searchDebounceTimer = useRef(null);
  const isMounted = useRef(false);
  const initialFetchDone = useRef(false);
  const skipNextPageEffect = useRef(true);
  const filtersRef = useRef(initialFilters);
  const pageRef = useRef(1);

  const {
    customers = { items: [], loading: false, pagination: {} },
    stats = null,
    statsInitialized,
  } = useSelector((state) => state.customers || {});

  const shopsState = useSelector(
    (state) => state.shops?.shops || { initialized: false, loading: false }
  );

  const buildParams = (f, page) => {
    const params = { page, limit: ITEMS_PER_PAGE };
    if (f.search) params.search = f.search;
    if (f.status?.length) params.status = f.status.join(",");
    if (f.isWebsiteUser?.length) params.isWebsiteUser = f.isWebsiteUser[0];
    if (f.loyaltyTier?.length) params.loyaltyTier = f.loyaltyTier.join(",");
    return params;
  };

  const runFetch = useCallback(
    (f, page) => {
      dispatch(fetchCustomers(buildParams(f, page)));
    },
    [dispatch]
  );

  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { pageRef.current = currentPage; }, [currentPage]);

  useEffect(() => {
    return () => {
      if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    if (!shopsState.initialized && !shopsState.loading) {
      dispatch(fetchShops({ limit: 100 }));
    }

    if (!statsInitialized) {
      dispatch(fetchCustomerStats());
    }

    skipNextPageEffect.current = true;
    runFetch(initialFilters, 1);

    const timer = setTimeout(() => {
      isMounted.current = true;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(filtersRef.current, currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    if (filters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(filters, 1);
      return;
    }
    searchDebounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(filters, 1);
    }, 500);
  }, [filters.search]);

  useEffect(() => {
    if (!isMounted.current) return;
    skipNextPageEffect.current = true;
    setCurrentPage(1);
    pageRef.current = 1;
    runFetch(filters, 1);
  }, [filters.status, filters.isWebsiteUser, filters.loyaltyTier]);

  const refreshCurrent = useCallback(() => {
    runFetch(filtersRef.current, pageRef.current);
  }, [runFetch]);

  const handleClearFilters = () => {
    setFilters(initialFilters);
    filtersRef.current = initialFilters;
    setCurrentPage(1);
    pageRef.current = 1;
    skipNextPageEffect.current = true;
    runFetch(initialFilters, 1);
  };

  const handleViewProfile = async (customer) => {
    setViewData({ isOpen: true, data: null, loading: true });
    try {
      const fullProfile = await dispatch(getCustomerById(customer._id)).unwrap();
      setViewData({ isOpen: true, data: fullProfile, loading: false });
    } catch {
      toast.error(t("failedToLoadProfile"));
      setViewData({ isOpen: false, data: null, loading: false });
    }
  };

  const handleEditModalClose = (didSave) => {
    setEditOpen(false);
    setSelectedItem(null);
    if (didSave) refreshCurrent();
  };

  const handlePrescriptionModalClose = (didSave) => {
    setPrescriptionOpen(false);
    setSelectedItem(null);
    if (didSave) refreshCurrent();
  };

  const safeCustomerData = Array.isArray(customers?.items)
    ? customers.items
    : [];

  if (
    !initialFetchDone.current &&
    customers.loading &&
    !customers.items.length &&
    !stats
  ) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <CustomerStats stats={stats} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-[11px] uppercase font-black tracking-[0.3em] text-black dark:text-white">
          {t("customers")}
        </h1>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <CustomerFilter
          filters={filters}
          setFilters={setFilters}
          onClear={handleClearFilters}
        />
        <CustomerTable
          data={safeCustomerData}
          loading={customers?.loading}
          onView={handleViewProfile}
          onEdit={(item) => {
            setSelectedItem(item);
            setEditOpen(true);
          }}
          onAddPrescription={(item) => {
            setSelectedItem(item);
            setPrescriptionOpen(true);
          }}
        />
        <BasePagination
          currentPage={currentPage}
          totalPages={customers.pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <CustomerModal
        isOpen={isEditOpen}
        onClose={handleEditModalClose}
        initialData={selectedItem}
      />
      <CustomerViewModal
        isOpen={viewData.isOpen}
        onClose={() => setViewData({ isOpen: false, data: null, loading: false })}
        data={viewData.data}
        loading={viewData.loading}
      />
      <PrescriptionModal
        isOpen={isPrescriptionOpen}
        onClose={handlePrescriptionModalClose}
        customer={selectedItem}
      />
    </div>
  );
}