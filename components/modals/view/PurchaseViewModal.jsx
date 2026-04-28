"use client";
import { BaseModal } from "../BaseModal";
import { format } from "date-fns";

const Field = ({ label, value, isBadge = false, badgeClass = "" }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col mb-4">
      <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-1.5">
        {label}
      </span>
      {isBadge ? (
        <span className={`px-2 py-1 text-[10px] rounded-sm w-fit font-black ${badgeClass}`}>
          {String(value)}
        </span>
      ) : (
        <span className="text-[12px] font-medium text-black dark:text-white break-words">
          {String(value)}
        </span>
      )}
    </div>
  );
};

const editStatusColors = {
  NONE:     "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
  PENDING:  "bg-orange-500/10 text-orange-500",
  APPROVED: "bg-blue-500/10 text-blue-500",
  REJECTED: "bg-red-500/10 text-red-500",
};

export const PurchaseViewModal = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const editStatus = data.editRequest?.status || "NONE";
  const pendingChanges = data.editRequest?.pendingChanges;
  const hasPendingChanges =
    pendingChanges &&
    Object.values(pendingChanges).some((v) => v !== null && v !== undefined && v !== "");

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Details"
      maxWidth="max-w-3xl"
    >
      <div className="p-2 space-y-6">

        {/* ── Header Block ── */}
        <div className="bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">
              Purchase ID
            </p>
            <h2 className="text-lg font-black text-[#E9B10C] tracking-widest">
              {data.purchaseNumber}
            </h2>
            <p className="text-[11px] font-medium text-neutral-500 mt-1">
              {data.purchaseDate
                ? format(new Date(data.purchaseDate), "PPP")
                : "—"}
            </p>
            <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-sm">
              {data.shop?.name || "—"}
              {data.shop?.code ? ` (${data.shop.code})` : ""}
            </span>
          </div>
          <div className="text-right space-y-2">
            <p className="text-[10px] uppercase font-bold text-neutral-500">
              Total Value
            </p>
            <h2 className="text-2xl font-black text-black dark:text-white">
              SAR {((data.price || 0) * (data.quantity || 1)).toLocaleString()}
            </h2>
            <span
              className={`inline-block px-2 py-1 text-[9px] uppercase tracking-widest font-black rounded-sm ${
                editStatusColors[editStatus]
              }`}
            >
              Edit: {editStatus}
            </span>
          </div>
        </div>

        {/* ── Core Details ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Item Name"       value={data.itemName} />
          <Field label="Category"        value={data.category?.name || data.customCategory || "—"} />
          <Field label="Quantity"        value={data.quantity} />
          <Field label="Unit Price"      value={`SAR ${data.price?.toLocaleString() || 0}`} />
          <Field label="Supplier / Shop" value={data.supplierShopName || "—"} />
          <Field label="Created By"      value={data.createdBy?.name || "—"} />
        </div>

        {data.notes && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <Field label="Notes" value={data.notes} />
          </div>
        )}

        {/* ── Product Reference ── */}
        {data.productRef && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-2">
              Linked Product
            </p>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm">
              <div>
                <p className="text-[11px] font-black">{data.productRef.name}</p>
                {data.productRef.sku && (
                  <p className="text-[9px] text-neutral-500 uppercase">
                    SKU: {data.productRef.sku}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Request Block ── */}
        {editStatus !== "NONE" && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-3">
            <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500">
              Edit Request Details
            </p>

            <div className="p-4 bg-neutral-50 dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] uppercase font-bold text-neutral-500">
                  Status
                </span>
                <span
                  className={`px-2 py-1 text-[8px] uppercase tracking-widest font-black rounded-sm ${
                    editStatusColors[editStatus]
                  }`}
                >
                  {editStatus}
                </span>
              </div>

              {data.editRequest?.requestedBy && (
                <div className="flex justify-between">
                  <span className="text-[9px] uppercase font-bold text-neutral-500">
                    Requested By
                  </span>
                  <span className="text-[10px] font-bold">
                    {data.editRequest.requestedBy?.name || "—"}
                  </span>
                </div>
              )}

              {data.editRequest?.requestedAt && (
                <div className="flex justify-between">
                  <span className="text-[9px] uppercase font-bold text-neutral-500">
                    Requested At
                  </span>
                  <span className="text-[10px] font-bold">
                    {format(new Date(data.editRequest.requestedAt), "PPp")}
                  </span>
                </div>
              )}

              {data.editRequest?.reason && (
                <div className="flex justify-between gap-4">
                  <span className="text-[9px] uppercase font-bold text-neutral-500 shrink-0">
                    Reason
                  </span>
                  <span className="text-[10px] font-medium text-right">
                    {data.editRequest.reason}
                  </span>
                </div>
              )}

              {editStatus === "REJECTED" && data.editRequest?.rejectionReason && (
                <div className="flex justify-between gap-4">
                  <span className="text-[9px] uppercase font-bold text-red-500 shrink-0">
                    Rejection Reason
                  </span>
                  <span className="text-[10px] font-medium text-right text-red-500">
                    {data.editRequest.rejectionReason}
                  </span>
                </div>
              )}

              {editStatus === "APPROVED" && data.editRequest?.approvedBy && (
                <div className="flex justify-between">
                  <span className="text-[9px] uppercase font-bold text-blue-500">
                    Approved By
                  </span>
                  <span className="text-[10px] font-bold text-blue-500">
                    {data.editRequest.approvedBy?.name || "—"}
                  </span>
                </div>
              )}
            </div>

            {/* Pending Changes Table */}
            {hasPendingChanges && (
              <div>
                <p className="text-[9px] uppercase font-bold text-neutral-500 mb-2">
                  Proposed Changes
                </p>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-50 dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">
                          Field
                        </th>
                        <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">
                          Current Value
                        </th>
                        <th className="p-2 text-[9px] uppercase font-bold text-neutral-500">
                          Proposed Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingChanges.itemName && (
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">Item Name</td>
                          <td className="p-2 text-[10px] text-neutral-500">{data.itemName}</td>
                          <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.itemName}</td>
                        </tr>
                      )}
                      {pendingChanges.quantity != null && (
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">Quantity</td>
                          <td className="p-2 text-[10px] text-neutral-500">{data.quantity}</td>
                          <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.quantity}</td>
                        </tr>
                      )}
                      {pendingChanges.price != null && (
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">Price</td>
                          <td className="p-2 text-[10px] text-neutral-500">SAR {data.price}</td>
                          <td className="p-2 text-[10px] font-bold text-[#E9B10C]">SAR {pendingChanges.price}</td>
                        </tr>
                      )}
                      {pendingChanges.supplierShopName !== null &&
                        pendingChanges.supplierShopName !== undefined && (
                        <tr className="border-b border-neutral-200 dark:border-neutral-800">
                          <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">Supplier</td>
                          <td className="p-2 text-[10px] text-neutral-500">{data.supplierShopName || "—"}</td>
                          <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.supplierShopName || "—"}</td>
                        </tr>
                      )}
                      {pendingChanges.notes !== null &&
                        pendingChanges.notes !== undefined && (
                        <tr className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                          <td className="p-2 text-[9px] uppercase font-bold text-neutral-500">Notes</td>
                          <td className="p-2 text-[10px] text-neutral-500">{data.notes || "—"}</td>
                          <td className="p-2 text-[10px] font-bold text-[#E9B10C]">{pendingChanges.notes || "—"}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseModal>
  );
};