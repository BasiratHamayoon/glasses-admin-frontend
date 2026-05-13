"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

import { fetchProducts, deleteProduct } from "@/redux/actions/productActions";
import { fetchCategories } from "@/redux/actions/categoryActions";
import {
  frameShapeActions,
  frameMaterialActions,
  frameTypeActions,
  lensTypeActions,
  lensMaterialActions,
} from "@/redux/actions/lookupActions";

import { Plus, Layers, Eye, Box } from "lucide-react";
import { ProductFilter } from "@/components/filters/ProductFilter";
import { LookupFilter } from "@/components/filters/LookupFilter";
import { ProductTable } from "@/components/tables/ProductTable";
import { LookupTable } from "@/components/tables/LookupTable";
import { ProductModal } from "@/components/modals/addUpdate/ProductModal";
import { LookupModal } from "@/components/modals/addUpdate/LookupModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";
import { ProductViewModal } from "@/components/modals/view/ProductViewModal";
import { BasePagination } from "@/components/pagination/BasePagination";
import { ProductStats } from "@/components/cards/statCards/ProductStats";
import { LookupStats } from "@/components/cards/statCards/LookupStats";

const ITEMS_PER_PAGE = 10;

const initialProductFilters = { search: "", status: [], priceRange: [] };
const initialLookupFilters = { search: "", isActive: [] };

let _productFetchLock = false;
let _modalDataFetched = false;

const PAGE_TABS = [
  { key: "products", labelKey: "products", icon: Box },
  { key: "frameShapes", labelKey: "frameShapes", icon: Layers },
  { key: "frameMaterials", labelKey: "frameMaterials", icon: Layers },
  { key: "frameTypes", labelKey: "frameTypes", icon: Layers },
  { key: "lensTypes", labelKey: "lensTypes", icon: Eye },
  { key: "lensMaterials", labelKey: "lensMaterials", icon: Eye },
];

const LOOKUP_CONFIG = {
  frameShapes: {
    actions: frameShapeActions,
    stateKey: "frameShapes",
    labelKey: "frameShapes",
    singularKey: "frameShape",
  },
  frameMaterials: {
    actions: frameMaterialActions,
    stateKey: "frameMaterials",
    labelKey: "frameMaterials",
    singularKey: "frameMaterial",
  },
  frameTypes: {
    actions: frameTypeActions,
    stateKey: "frameTypes",
    labelKey: "frameTypes",
    singularKey: "frameType",
  },
  lensTypes: {
    actions: lensTypeActions,
    stateKey: "lensTypes",
    labelKey: "lensTypes",
    singularKey: "lensType",
  },
  lensMaterials: {
    actions: lensMaterialActions,
    stateKey: "lensMaterials",
    labelKey: "lensMaterials",
    singularKey: "lensMaterial",
  },
};

function buildProductParams(filters, page) {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.status?.length) {
    params.status = filters.status.join(",");
    params.statusOperator = "OR";
  }
  if (filters.priceRange?.length) {
    const mins = filters.priceRange.map((r) => Number(r.split("-")[0]));
    const maxs = filters.priceRange.map((r) => Number(r.split("-")[1]));
    params.minPrice = Math.min(...mins);
    params.maxPrice = Math.max(...maxs);
  }
  return params;
}

function buildLookupParams(filters, page) {
  const params = { page, limit: ITEMS_PER_PAGE };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.isActive?.length === 1) params.isActive = filters.isActive[0];
  return params;
}

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === "ar";

  const [activePageTab, setActivePageTab] = useState("products");

  const [productFilters, setProductFilters] = useState(initialProductFilters);
  const [productPage, setProductPage] = useState(1);
  const [isProdModalOpen, setProdModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState({ isOpen: false, data: null });
  const [productDeleteData, setProductDeleteData] = useState({
    isOpen: false,
    item: null,
    loading: false,
  });

  const [lookupFilters, setLookupFilters] = useState(initialLookupFilters);
  const [lookupPage, setLookupPage] = useState(1);
  const [lookupModal, setLookupModal] = useState({
    isOpen: false,
    data: null,
    loading: false,
  });
  const [lookupDeleteData, setLookupDeleteData] = useState({
    isOpen: false,
    item: null,
    loading: false,
  });

  const productDebounceTimer = useRef(null);
  const lookupDebounceTimer = useRef(null);
  const skipNextProductPageEffect = useRef(true);
  const skipNextLookupPageEffect = useRef(true);
  const productFiltersRef = useRef(initialProductFilters);
  const productPageRef = useRef(1);
  const lookupFiltersRef = useRef(initialLookupFilters);
  const lookupPageRef = useRef(1);
  const initializedLookupTabs = useRef(new Set());

  const {
    items: products = [],
    pagination: prodPagination = {},
    loading: prodLoading = false,
  } = useSelector((state) => state.products || {});

  const categoriesState = useSelector((state) => state.categories || {});
  const frameShapesState = useSelector((state) => state.frameShapes || {});
  const frameMaterialsState = useSelector((state) => state.frameMaterials || {});
  const frameTypesState = useSelector((state) => state.frameTypes || {});
  const lensTypesState = useSelector((state) => state.lensTypes || {});
  const lensMaterialsState = useSelector((state) => state.lensMaterials || {});

  const lookupStateMap = {
    frameShapes: frameShapesState,
    frameMaterials: frameMaterialsState,
    frameTypes: frameTypesState,
    lensTypes: lensTypesState,
    lensMaterials: lensMaterialsState,
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const isLookupTab = activePageTab !== "products";
  const currentLookupConfig = isLookupTab ? LOOKUP_CONFIG[activePageTab] : null;
  const currentLookupState = isLookupTab ? lookupStateMap[activePageTab] || {} : {};
  const currentLookupItems = Array.isArray(currentLookupState.items) ? currentLookupState.items : [];
  const currentLookupPagination = currentLookupState.pagination || {};
  const currentLookupLoading = currentLookupState.loading || false;

  const runProductFetch = useCallback(
    (page, filters) => dispatch(fetchProducts(buildProductParams(filters, page))),
    [dispatch]
  );

  const runLookupFetch = useCallback(
    (tab, page, filters) => {
      const config = LOOKUP_CONFIG[tab];
      if (!config) return;
      dispatch(config.actions.fetchAll(buildLookupParams(filters, page)));
    },
    [dispatch]
  );

  const fetchModalData = useCallback(() => {
    if (_modalDataFetched) return;
    _modalDataFetched = true;
    dispatch(fetchCategories({ limit: 999 }));
    dispatch(frameShapeActions.fetchAll({ isActive: true, limit: 999 }));
    dispatch(frameMaterialActions.fetchAll({ isActive: true, limit: 999 }));
    dispatch(frameTypeActions.fetchAll({ isActive: true, limit: 999 }));
    dispatch(lensTypeActions.fetchAll({ isActive: true, limit: 999 }));
    dispatch(lensMaterialActions.fetchAll({ isActive: true, limit: 999 }));
  }, [dispatch]);

  useEffect(() => {
    productFiltersRef.current = productFilters;
  }, [productFilters]);

  useEffect(() => {
    productPageRef.current = productPage;
  }, [productPage]);

  useEffect(() => {
    lookupFiltersRef.current = lookupFilters;
  }, [lookupFilters]);

  useEffect(() => {
    lookupPageRef.current = lookupPage;
  }, [lookupPage]);

  useEffect(() => {
    return () => {
      if (productDebounceTimer.current) clearTimeout(productDebounceTimer.current);
      if (lookupDebounceTimer.current) clearTimeout(lookupDebounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (_productFetchLock) return;
    _productFetchLock = true;
    skipNextProductPageEffect.current = true;
    runProductFetch(1, initialProductFilters);
    return () => {
      _productFetchLock = false;
    };
  }, []);

  useEffect(() => {
    if (skipNextProductPageEffect.current) {
      skipNextProductPageEffect.current = false;
      return;
    }
    runProductFetch(productPage, productFiltersRef.current);
  }, [productPage]);

  useEffect(() => {
    if (!_productFetchLock) return;
    if (productDebounceTimer.current) clearTimeout(productDebounceTimer.current);
    if (productFilters.search === "") {
      skipNextProductPageEffect.current = true;
      setProductPage(1);
      productPageRef.current = 1;
      runProductFetch(1, productFilters);
      return;
    }
    productDebounceTimer.current = setTimeout(() => {
      skipNextProductPageEffect.current = true;
      setProductPage(1);
      productPageRef.current = 1;
      runProductFetch(1, productFilters);
    }, 500);
  }, [productFilters.search]);

  useEffect(() => {
    if (!_productFetchLock) return;
    skipNextProductPageEffect.current = true;
    setProductPage(1);
    productPageRef.current = 1;
    runProductFetch(1, productFilters);
  }, [productFilters.status, productFilters.priceRange]);

  useEffect(() => {
    if (!isLookupTab) return;
    const tab = activePageTab;
    if (!initializedLookupTabs.current.has(tab)) {
      initializedLookupTabs.current.add(tab);
      skipNextLookupPageEffect.current = true;
      setLookupPage(1);
      setLookupFilters(initialLookupFilters);
      lookupPageRef.current = 1;
      lookupFiltersRef.current = initialLookupFilters;
      runLookupFetch(tab, 1, initialLookupFilters);
    }
  }, [activePageTab]);

  useEffect(() => {
    if (!isLookupTab) return;
    if (skipNextLookupPageEffect.current) {
      skipNextLookupPageEffect.current = false;
      return;
    }
    runLookupFetch(activePageTab, lookupPage, lookupFiltersRef.current);
  }, [lookupPage]);

  useEffect(() => {
    if (!isLookupTab) return;
    if (lookupDebounceTimer.current) clearTimeout(lookupDebounceTimer.current);
    if (lookupFilters.search === "") {
      skipNextLookupPageEffect.current = true;
      setLookupPage(1);
      lookupPageRef.current = 1;
      runLookupFetch(activePageTab, 1, lookupFilters);
      return;
    }
    lookupDebounceTimer.current = setTimeout(() => {
      skipNextLookupPageEffect.current = true;
      setLookupPage(1);
      lookupPageRef.current = 1;
      runLookupFetch(activePageTab, 1, lookupFilters);
    }, 500);
  }, [lookupFilters.search]);

  useEffect(() => {
    if (!isLookupTab) return;
    skipNextLookupPageEffect.current = true;
    setLookupPage(1);
    lookupPageRef.current = 1;
    runLookupFetch(activePageTab, 1, lookupFilters);
  }, [lookupFilters.isActive]);

  const handlePageTabChange = (tab) => {
    setActivePageTab(tab);
    if (tab !== "products") {
      setLookupFilters(initialLookupFilters);
      setLookupPage(1);
    }
  };

  const refreshProducts = useCallback(() => {
    runProductFetch(productPageRef.current, productFiltersRef.current);
  }, [runProductFetch]);

  const refreshLookup = useCallback(() => {
    runLookupFetch(activePageTab, lookupPageRef.current, lookupFiltersRef.current);
  }, [runLookupFetch, activePageTab]);

  const handleViewProduct = (product) =>
    setViewProduct({ isOpen: true, data: product });

  const handleEditProduct = (product) => {
    fetchModalData();
    setSelectedProduct(product);
    setProdModalOpen(true);
  };

  const openCreateProduct = () => {
    fetchModalData();
    setSelectedProduct(null);
    setProdModalOpen(true);
  };

  const handleProductDeleteRequest = (item) =>
    setProductDeleteData({ isOpen: true, item, loading: false });

  const confirmProductDelete = async () => {
    setProductDeleteData((prev) => ({ ...prev, loading: true }));
    try {
      await dispatch(deleteProduct(productDeleteData.item._id)).unwrap();
      toast.success(t("deletedSuccessfully"));
      setProductDeleteData({ isOpen: false, item: null, loading: false });
      refreshProducts();
    } catch (err) {
      toast.error(err?.response?.data?.message || t("errorDeletingItem"));
      setProductDeleteData((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleProductModalClose = (didSave) => {
    setProdModalOpen(false);
    if (didSave) refreshProducts();
  };

  const openCreateLookup = () =>
    setLookupModal({ isOpen: true, data: null, loading: false });

  const openEditLookup = (item) =>
    setLookupModal({ isOpen: true, data: item, loading: false });

  const handleLookupDeleteRequest = (item) =>
    setLookupDeleteData({ isOpen: true, item, loading: false });

  const handleLookupSubmit = async (formData) => {
    setLookupModal((prev) => ({ ...prev, loading: true }));
    const config = currentLookupConfig;
    try {
      if (lookupModal.data?._id) {
        await dispatch(
          config.actions.update({ id: lookupModal.data._id, data: formData })
        ).unwrap();
        toast.success(t("updatedSuccessfully"));
      } else {
        await dispatch(config.actions.create(formData)).unwrap();
        toast.success(t("createdSuccessfully"));
      }
      setLookupModal({ isOpen: false, data: null, loading: false });
      refreshLookup();
      _modalDataFetched = false;
    } catch (err) {
      toast.error(err?.message || t("errorOccurred"));
      setLookupModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLookupToggle = async (item) => {
    const config = currentLookupConfig;
    try {
      await dispatch(config.actions.toggle(item._id)).unwrap();
      toast.success(t("statusUpdated"));
      _modalDataFetched = false;
    } catch (err) {
      toast.error(err?.message || t("errorOccurred"));
    }
  };

  const confirmLookupDelete = async () => {
    setLookupDeleteData((prev) => ({ ...prev, loading: true }));
    const config = currentLookupConfig;
    try {
      await dispatch(config.actions.remove(lookupDeleteData.item._id)).unwrap();
      toast.success(t("deletedSuccessfully"));
      setLookupDeleteData({ isOpen: false, item: null, loading: false });
      refreshLookup();
      _modalDataFetched = false;
    } catch (err) {
      toast.error(err?.response?.data?.message || t("errorDeletingItem"));
      setLookupDeleteData((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {activePageTab === "products" && <ProductStats products={safeProducts} />}
      {isLookupTab && currentLookupConfig && (
        <LookupStats
          items={currentLookupItems}
          label={t(currentLookupConfig.labelKey)}
        />
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-1">
            {PAGE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handlePageTabChange(tab.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-black whitespace-nowrap rounded-sm transition-all border ${
                    activePageTab === tab.key
                      ? "bg-[#E9B10C] text-black border-[#E9B10C]"
                      : "bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-[#E9B10C] hover:text-[#E9B10C]"
                  }`}
                >
                  <Icon size={11} strokeWidth={3} />
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={activePageTab === "products" ? openCreateProduct : openCreateLookup}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm w-full sm:w-auto shrink-0"
          >
            <Plus size={14} strokeWidth={3} />
            <span className="text-[10px] uppercase tracking-widest font-black">
              {activePageTab === "products"
                ? t("addProduct")
                : `${t("add")} ${t(currentLookupConfig?.singularKey || "")}`}
            </span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
          {activePageTab === "products" ? (
            <>
              <ProductFilter
                data={safeProducts}
                filters={productFilters}
                setFilters={setProductFilters}
                onClear={() => {
                  setProductFilters(initialProductFilters);
                  setProductPage(1);
                }}
              />
              <ProductTable
                products={safeProducts}
                loading={prodLoading}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleProductDeleteRequest}
              />
              <BasePagination
                currentPage={productPage}
                totalPages={prodPagination?.totalPages || 1}
                onPageChange={setProductPage}
              />
            </>
          ) : (
            <>
              <LookupFilter
                data={currentLookupItems}
                filters={lookupFilters}
                setFilters={setLookupFilters}
                onClear={() => {
                  setLookupFilters(initialLookupFilters);
                  setLookupPage(1);
                }}
              />
              <LookupTable
                items={currentLookupItems}
                loading={currentLookupLoading}
                onEdit={openEditLookup}
                onDelete={handleLookupDeleteRequest}
                onToggle={handleLookupToggle}
              />
              <BasePagination
                currentPage={lookupPage}
                totalPages={currentLookupPagination?.totalPages || 1}
                onPageChange={setLookupPage}
              />
            </>
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isProdModalOpen}
        onClose={handleProductModalClose}
        initialData={selectedProduct}
        categories={categoriesState.items || []}
        frameShapes={frameShapesState.items || []}
        frameMaterials={frameMaterialsState.items || []}
        frameTypes={frameTypesState.items || []}
        lensTypes={lensTypesState.items || []}
        lensMaterials={lensMaterialsState.items || []}
      />

      <ProductViewModal
        isOpen={viewProduct.isOpen}
        onClose={() => setViewProduct({ isOpen: false, data: null })}
        product={viewProduct.data}
      />

      {currentLookupConfig && (
        <LookupModal
          isOpen={lookupModal.isOpen}
          onClose={() => setLookupModal({ isOpen: false, data: null, loading: false })}
          onSubmit={handleLookupSubmit}
          initialData={lookupModal.data}
          loading={lookupModal.loading}
          title={
            lookupModal.data
              ? `${t("edit")} ${t(currentLookupConfig.singularKey)}`
              : `${t("add")} ${t(currentLookupConfig.singularKey)}`
          }
        />
      )}

      <ConfirmationModal
        isOpen={productDeleteData.isOpen}
        onClose={() => setProductDeleteData({ ...productDeleteData, isOpen: false })}
        onConfirm={confirmProductDelete}
        loading={productDeleteData.loading}
        message={
          isArabic
            ? `${t("deleteConfirm")} ${productDeleteData.item?.name}؟`
            : `${t("deleteConfirm")} ${productDeleteData.item?.name}?`
        }
      />

      <ConfirmationModal
        isOpen={lookupDeleteData.isOpen}
        onClose={() => setLookupDeleteData({ ...lookupDeleteData, isOpen: false })}
        onConfirm={confirmLookupDelete}
        loading={lookupDeleteData.loading}
        message={
          isArabic
            ? `${t("deleteConfirm")} ${lookupDeleteData.item?.name}؟`
            : `${t("deleteConfirm")} ${lookupDeleteData.item?.name}?`
        }
      />
    </div>
  );
}