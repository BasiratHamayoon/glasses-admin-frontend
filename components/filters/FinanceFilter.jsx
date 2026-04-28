"use client";
import { BaseFilter } from "./BaseFilter";
import { MultiSelect } from "@/components/ui/multi-select";

export function FinanceFilter({ filters, setFilters, onApply, onClear, type = 'transaction' }) {
  const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  return (
    <BaseFilter search={filters.search} onSearchChange={(val) => handleChange('search', val)} onClear={onClear} onApply={onApply}>
      
      {/* Transaction & Expense shared fields */}
      <MultiSelect 
        placeholder="Payment Method"
        options={[{label:'Cash', value:'CASH'}, {label:'Card', value:'CARD'}, {label:'UPI', value:'UPI'}, {label:'Bank Transfer', value:'BANK_TRANSFER'}]}
        selected={filters.paymentMethod || []}
        onChange={(val) => handleChange('paymentMethod', val)}
      />

      {/* Transaction specific */}
      {type === 'transaction' && (
        <>
          <MultiSelect placeholder="Type" options={[{label:'Credit', value:'CREDIT'}, {label:'Debit', value:'DEBIT'}]} selected={filters.type || []} onChange={(val) => handleChange('type', val)} />
          <MultiSelect placeholder="Reconciled Status" options={[{label:'Reconciled', value:'true'}, {label:'Pending', value:'false'}]} selected={filters.isReconciled || []} onChange={(val) => handleChange('isReconciled', val)} />
        </>
      )}

      {/* Expense specific */}
      {type === 'expense' && (
        <>
          <MultiSelect placeholder="Status" options={[{label:'Pending', value:'PENDING'}, {label:'Approved', value:'APPROVED'}, {label:'Paid', value:'PAID'}]} selected={filters.status || []} onChange={(val) => handleChange('status', val)} />
          <MultiSelect placeholder="Category" options={[{label:'Rent', value:'RENT'}, {label:'Salary', value:'SALARY'}, {label:'Electricity', value:'ELECTRICITY'}, {label:'Inventory', value:'INVENTORY'}]} selected={filters.category || []} onChange={(val) => handleChange('category', val)} />
        </>
      )}

      {/* Date Ranges */}
      <input type="date" value={filters.startDate || ''} onChange={(e) => handleChange('startDate', e.target.value)} className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] outline-none shadow-sm" />
      <input type="date" value={filters.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} className="flex min-h-[36px] w-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-sm py-1.5 px-3 text-[10px] outline-none shadow-sm" />
    </BaseFilter>
  );
}