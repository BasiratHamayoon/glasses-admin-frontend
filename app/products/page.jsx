"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

import { fetchProducts, deleteProduct } from "@/redux/actions/productActions";
import { fetchCategories, deleteCategory } from "@/redux/actions/categoryActions";

import { Plus } from "lucide-react";
import { ProductFilter } from "@/components/filters/ProductFilter";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { ProductTable } from "@/components/tables/ProductTable";
import { CategoryTable } from "@/components/tables/CategoryTable";

import { CategoryModal } from "@/components/modals/addUpdate/CategoryModal";
import { ProductModal } from "@/components/modals/addUpdate/ProductModal";
import { ConfirmationModal } from "@/components/modals/other/ConfirmationModal";
import { ProductViewModal } from "@/components/modals/view/ProductViewModal";
import { CategoryViewModal } from "@/components/modals/view/CategoryViewModal";

import { PageSkeleton } from "@/components/loaders-and-skeletons/PageSkeleton";
import { BasePagination } from "@/components/pagination/BasePagination"; 
import { ProductStats } from "@/components/cards/statCards/ProductStats"; 

export default function ProductsPage() {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const isArabic = language === 'ar';

  const [activeTab, setActiveTab] = useState("products");
  
  const initialProductFilters = { search: '', productType: [], gender: [], status: [], minPrice: '', maxPrice: '' };
  const [productFilters, setProductFilters] = useState(initialProductFilters);

  const initialCategoryFilters = { search: '' };
  const [categoryFilters, setCategoryFilters] = useState(initialCategoryFilters);

  const [isCatModalOpen, setCatModalOpen] = useState(false);
  const [isProdModalOpen, setProdModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [viewProduct, setViewProduct] = useState({ isOpen: false, data: null });
  const [viewCategory, setViewCategory] = useState({ isOpen: false, data: null });
  const [deleteData, setDeleteData] = useState({ isOpen: false, item: null, type: '', loading: false });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debounceTimer = useRef(null);

  const { items: products = [], pagination: prodPagination = {}, loading: prodLoading = false } = useSelector(state => state.products || {});
  const { items: categories = [], pagination: catPagination = {}, loading: catLoading = false } = useSelector(state => state.categories || {});

  const loadData = useCallback((tab, page = 1, currentProdFilters = productFilters, currentCatFilters = categoryFilters) => {
    if (tab === 'products') {
      const cleanFilters = { page, limit: itemsPerPage, ...currentProdFilters };
      Object.keys(cleanFilters).forEach(key => {
        if (cleanFilters[key] === '' || cleanFilters[key] == null || (Array.isArray(cleanFilters[key]) && cleanFilters[key].length === 0)) {
          delete cleanFilters[key];
        }
      });
      dispatch(fetchProducts(cleanFilters));
    } else if (tab === 'categories') {
      const cleanFilters = { page, limit: itemsPerPage, ...currentCatFilters };
      Object.keys(cleanFilters).forEach(key => {
        if (cleanFilters[key] === '' || cleanFilters[key] == null || (Array.isArray(cleanFilters[key]) && cleanFilters[key].length === 0)) {
          delete cleanFilters[key];
        }
      });
      dispatch(fetchCategories(cleanFilters));
    }
  }, [dispatch, itemsPerPage]);

  useEffect(() => { 
    setCurrentPage(1);
    loadData(activeTab, 1, productFilters, categoryFilters); 
  }, [activeTab, loadData]); 

  const handleApplyProductFilters = (overrideSearch) => { 
    const filtersToUse = typeof overrideSearch === 'string' ? { ...productFilters, search: overrideSearch } : productFilters;
    if (typeof overrideSearch === 'string' && overrideSearch !== productFilters.search) {
      setProductFilters(filtersToUse);
    }
    setCurrentPage(1); 
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadData('products', 1, filtersToUse, categoryFilters);
    }, 300);
  };

  const handleClearProductFilters = () => { 
    setProductFilters(initialProductFilters); 
    setCurrentPage(1); 
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadData('products', 1, initialProductFilters, categoryFilters);
    }, 300);
  };

  const handleApplyCategoryFilters = (overrideSearch) => { 
    const filtersToUse = typeof overrideSearch === 'string' ? { ...categoryFilters, search: overrideSearch } : categoryFilters;
    if (typeof overrideSearch === 'string' && overrideSearch !== categoryFilters.search) {
      setCategoryFilters(filtersToUse);
    }
    setCurrentPage(1); 
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadData('categories', 1, productFilters, filtersToUse);
    }, 300);
  };

  const handleClearCategoryFilters = () => { 
    setCategoryFilters(initialCategoryFilters); 
    setCurrentPage(1); 
    
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      loadData('categories', 1, productFilters, initialCategoryFilters);
    }, 300);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadData(activeTab, page, productFilters, categoryFilters);
  };

  const handleViewProduct = (product) => setViewProduct({ isOpen: true, data: product });
  const handleViewCategory = (category) => setViewCategory({ isOpen: true, data: category });
  const handleEditProduct = (product) => { setSelectedItem(product); setProdModalOpen(true); };
  const handleEditCategory = (category) => { setSelectedItem(category); setCatModalOpen(true); };
  const openCreateProduct = () => { setSelectedItem(null); setProdModalOpen(true); };
  const openCreateCategory = () => { setSelectedItem(null); setCatModalOpen(true); };
  const handleDeleteRequest = (item, type) => { setDeleteData({ isOpen: true, item, type, loading: false }); };

  const confirmDelete = async () => {
    setDeleteData(prev => ({ ...prev, loading: true }));
    try {
      if (deleteData.type === 'product') await dispatch(deleteProduct(deleteData.item._id)).unwrap();
      else if (deleteData.type === 'category') await dispatch(deleteCategory(deleteData.item._id)).unwrap();
      toast.success('Deleted successfully');
      setDeleteData({ isOpen: false, item: null, type: '', loading: false });
      loadData(activeTab, currentPage, productFilters, categoryFilters);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error deleting item');
      setDeleteData(prev => ({ ...prev, loading: false }));
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  if ((prodLoading || catLoading) && (!safeProducts.length && !safeCategories.length)) return <PageSkeleton />;

  return (
    <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <ProductStats products={safeProducts} categories={safeCategories} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="flex overflow-x-auto scrollbar-hide bg-white dark:bg-[#111111] p-1 border border-neutral-200 dark:border-neutral-800 rounded-sm w-full sm:w-auto">
          {[{ id: "products", label: t("products") }, { id: "categories", label: t("categories") }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-none px-6 py-2 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm ${activeTab === tab.id ? 'bg-[#E9B10C] text-black shadow-sm' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={activeTab === 'products' ? openCreateProduct : openCreateCategory} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-[#E9B10C] hover:text-black transition-colors rounded-sm w-full sm:w-auto shrink-0">
          <Plus size={14} strokeWidth={3} />
          <span className="text-[10px] uppercase tracking-widest font-black">{activeTab === 'products' ? t("addProduct") : t("addCategory")}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 p-4 sm:p-6 rounded-sm min-h-[400px]">
        {activeTab === 'products' && (
          <>
            <ProductFilter data={safeProducts} filters={productFilters} setFilters={setProductFilters} onApply={handleApplyProductFilters} onClear={handleClearProductFilters} />
            <ProductTable products={safeProducts} loading={prodLoading} onView={handleViewProduct} onEdit={handleEditProduct} onDelete={(item) => handleDeleteRequest(item, 'product')} />
            <BasePagination currentPage={currentPage} totalPages={prodPagination?.totalPages || 1} onPageChange={handlePageChange} />
          </>
        )}
        {activeTab === 'categories' && (
          <>
            <CategoryFilter data={safeCategories} filters={categoryFilters} setFilters={setCategoryFilters} onApply={handleApplyCategoryFilters} onClear={handleClearCategoryFilters} />
            <CategoryTable categories={safeCategories} loading={catLoading} onView={handleViewCategory} onEdit={handleEditCategory} onDelete={(item) => handleDeleteRequest(item, 'category')} />
            <BasePagination currentPage={currentPage} totalPages={catPagination?.totalPages || 1} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      <CategoryModal isOpen={isCatModalOpen} onClose={() => setCatModalOpen(false)} initialData={selectedItem} />
      <ProductModal isOpen={isProdModalOpen} onClose={() => setProdModalOpen(false)} initialData={selectedItem} />
      <ProductViewModal isOpen={viewProduct.isOpen} onClose={() => setViewProduct({ isOpen: false, data: null })} product={viewProduct.data} />
      <CategoryViewModal isOpen={viewCategory.isOpen} onClose={() => setViewCategory({ isOpen: false, data: null })} category={viewCategory.data} />
      <ConfirmationModal isOpen={deleteData.isOpen} onClose={() => setDeleteData({ ...deleteData, isOpen: false })} onConfirm={confirmDelete} loading={deleteData.loading} message={isArabic ? `هل أنت متأكد أنك تريد حذف ${deleteData.item?.name}؟` : `Are you sure you want to delete ${deleteData.item?.name}?`} />
    </div>
  );
}