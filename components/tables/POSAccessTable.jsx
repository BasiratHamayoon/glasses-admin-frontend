"use client";
import { BaseTable } from "@/components/tables/BaseTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2 } from "lucide-react";

export const POSAccessTable = ({ users, loading, onDelete }) => {
  const { t } = useLanguage();

  const columns = [
    { header: "User", render: (row) => <span className="font-bold">{row.user?.name || 'Unknown'}</span> },
    { header: "Role", render: (row) => <span className="text-[9px] uppercase tracking-wider font-black">{row.role}</span> },
    { header: "Access Level", render: (row) => <span className={`px-2 py-1 text-[9px] font-bold rounded-sm ${row.accessLevel === 'FULL' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{row.accessLevel}</span> },
    { header: "Status", render: (row) => <span className="text-[10px] text-neutral-500">{row.status}</span> },
    { header: "Actions", render: (row) => (
      <button onClick={() => onDelete(row)} className="text-neutral-500 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
    )}
  ];

  return <BaseTable columns={columns} data={users} loading={loading} />;
};