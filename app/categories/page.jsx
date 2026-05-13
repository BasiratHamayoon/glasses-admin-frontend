"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

import { fetchCategories, deleteCategory } from "@/redux/actions/categoryActions";

import { Plus } from "lucide-react";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { CategoryTable } from "@/components/tables/CategoryTable";
import { CategoryModal } from "@/components/modals/addUpdate/CategoryModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";
import { CategoryViewModal } from "@/components/modals/view/CategoryViewModal";
import { BasePagination } from "@/components/pagination/BasePagination";

const ITEMS_PER_PAGE = 10;

const initialCategoryFilters = {
  search: "",
};

let _categoryPageFetchLock = false;

function buildCategoryParams(filters, page) {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (filters.search?.trim()) params.search = filters.search.trim();
  return params;
}

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [categoryFilters, setCategoryFilters] = useState(initialCategoryFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCatModalOpen, setCatModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewCategory, setViewCategory] = useState({ isOpen: false, data: null });
  const [deleteData, setDeleteData] = useState({
    isOpen: false,
    item: null,
    loading: false,
  });

  const debounceTimer = useRef(null);
  const skipNextPageEffect = useRef(true);
  const filtersRef = useRef(initialCategoryFilters);
  const pageRef = useRef(1);

  const {
    items: categories = [],
    pagination: catPagination = {},
    loading: catLoading = false,
  } = useSelector((state) => state.categories || {});

  const safeCategories = Array.isArray(categories) ? categories : [];

  const runFetch = useCallback(
    (page, filters) => {
      dispatch(fetchCategories(buildCategoryParams(filters, page)));
    },
    [dispatch]
  );

  useEffect(() => {
    filtersRef.current = categoryFilters;
  }, [categoryFilters]);

  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (_categoryPageFetchLock) return;
    _categoryPageFetchLock = true;
    skipNextPageEffect.current = true;
    runFetch(1, initialCategoryFilters);
    return () => {
      _categoryPageFetchLock = false;
    };
  }, []);

  useEffect(() => {
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }
    runFetch(currentPage, filtersRef.current);
  }, [currentPage]);

  useEffect(() => {
    if (!_categoryPageFetchLock) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (categoryFilters.search === "") {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(1, categoryFilters);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      skipNextPageEffect.current = true;
      setCurrentPage(1);
      pageRef.current = 1;
      runFetch(1, categoryFilters);
    }, 500);
  }, [categoryFilters.search]);

  const refreshCurrent = useCallback(() => {
    runFetch(pageRef.current, filtersRef.current);
  }, [runFetch]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClearCategoryFilters = () => {
    setCategoryFilters(initialCategoryFilters);
    setCurrentPage(1);
  };

  const handleViewCategory = (category) =>
    setViewCategory({ isOpen: true, data: category });

  const handleEditCategory = (category) => {
    setSelectedItem(category);
    setCatModalOpen(true);
  };

  const openCreateCategory = () => {
    setSelectedItem(null);
    setCatModalOpen(true);
  };

  const handleDeleteRequest = (item) =>
    setDeleteData({ isOpen: true, item, loading: false });

  const confirmDelete = async () => {
    setDeleteData((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(deleteCategory(deleteData.item._id)).unwrap();
      toast.success(t("deletedSuccessfully"));
      setDeleteData({ isOpen: false, item: null, loading: false });
      refreshCurrent();
    } catch (err) {
      toast.error(err?.response?.data?.message || t("errorDeletingItem"));
      setDeleteData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleModalClose = (didSave) => {
    setCatModalOpen(false);
    if (didSave) refreshCurrent();
  };

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <h1 className="text-[11px] uppercase tracking-[0.3em] font-black text-black dark:text-white">
          {t("categories")}
        </h1>
        <button
          onClick={openCreateCategory}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm w-full sm:w-auto shrink-0"
        >
          <Plus size={14} strokeWidth={3} />
          <span className="text-[10px] uppercase tracking-widest font-black">
            {t("addCategory")}
          </span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        <CategoryFilter
          filters={categoryFilters}
          setFilters={setCategoryFilters}
          onClear={handleClearCategoryFilters}
        />
        <CategoryTable
          categories={safeCategories}
          loading={catLoading}
          onView={handleViewCategory}
          onEdit={handleEditCategory}
          onDelete={(item) => handleDeleteRequest(item)}
        />
        <BasePagination
          currentPage={currentPage}
          totalPages={catPagination?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>

      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={handleModalClose}
        initialData={selectedItem}
      />
      <CategoryViewModal
        isOpen={viewCategory.isOpen}
        onClose={() => setViewCategory({ isOpen: false, data: null })}
        category={viewCategory.data}
      />
      <ConfirmationModal
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        onConfirm={confirmDelete}
        loading={deleteData.loading}
        message={
          isArabic
            ? `${t("deleteConfirm")} ${deleteData.item?.name}؟`
            : `${t("deleteConfirm")} ${deleteData.item?.name}?`
        }
      />
    </div>
  );
}