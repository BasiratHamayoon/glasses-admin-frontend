"use client";
import { BaseTable } from "./BaseTable";

export const WalletTable = ({ wallets, loading }) => {
  const columns = [
    { 
      header: "Shop Name", 
      render: (row) => <span className="font-bold">{row.shop?.name || '-'}</span> 
    },
    { 
      header: "Cash Balance", 
      render: (row) => <span className="font-bold text-[#E9B10C]">${(row.cashBalance || 0).toLocaleString()}</span> 
    },
    { 
      header: "Card / UPI", 
      render: (row) => <span className="text-neutral-500">${((row.cardBalance || 0) + (row.upiBalance || 0)).toLocaleString()}</span> 
    },
    { 
      header: "Total Balance", 
      render: (row) => <span className="font-black">${(row.totalBalance || 0).toLocaleString()}</span> 
    },
    { 
      header: "Today's Sales", 
      // Safe extraction for nested object (todaySales.total)
      render: (row) => <span className="text-green-500 font-bold">${(row.todaySales?.total || row.todaySales || 0).toLocaleString()}</span> 
    },
    { 
      header: "Due to Admin", 
      render: (row) => <span className="text-red-500 font-black">${(row.liabilityToAdmin || 0).toLocaleString()}</span> 
    },
  ];

  return <BaseTable columns={columns} data={wallets || []} loading={loading} />;
};