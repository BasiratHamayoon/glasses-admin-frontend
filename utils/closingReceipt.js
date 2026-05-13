const formatNum = (v) => {
  const n = Number(v);
  return isNaN(n) ? "0" : n.toLocaleString();
};

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const generateClosingReceipt = (closing) => {
  if (!closing) return;

  const shopName = closing.shop?.name || closing.shopName || "Unknown Shop";
  const closingDate = formatDate(closing.closingDate || closing.date || closing.createdAt);
  const closingNumber = closing.closingNumber || closing.number || closing.referenceNumber || "-";

  const orders = closing.orders || closing.orderBreakdown || [];

  let grandTotal = 0;
  let grandPaid = 0;
  let grandRemaining = 0;
  let totalCash = 0;
  let totalCard = 0;
  let totalUPI = 0;
  let totalOther = 0;

  let orderRowsHTML = "";

  if (orders.length > 0) {
    orders.forEach((order) => {
      const invoiceNum = order.orderNumber || order.invoiceNumber || "-";
      const orderTotal = Number(order.totalAmount || order.total || 0);
      const orderPaid = Number(order.paidAmount || order.paid || 0);
      const orderRemaining = Number(order.dueAmount || order.remaining || orderTotal - orderPaid);
      const paymentMethod = (order.paymentMethod || order.method || "-").toUpperCase();

      grandTotal += orderTotal;
      grandPaid += orderPaid;
      grandRemaining += orderRemaining;

      if (paymentMethod.includes("CASH")) {
        totalCash += orderPaid;
      } else if (paymentMethod.includes("CARD")) {
        totalCard += orderPaid;
      } else if (paymentMethod.includes("UPI")) {
        totalUPI += orderPaid;
      } else {
        totalOther += orderPaid;
      }

      orderRowsHTML += `
        <tr>
          <td>${invoiceNum}</td>
          <td style="text-align:right;">⃁ ${formatNum(orderTotal)}</td>
          <td style="text-align:right;">⃁ ${formatNum(orderPaid)}</td>
          <td style="text-align:right;">⃁ ${formatNum(orderRemaining)}</td>
          <td style="text-align:center;">${paymentMethod}</td>
        </tr>
      `;
    });
  } else {
    grandTotal = Number(closing.totalSales || 0);
    totalCash = Number(closing.cashSales || closing.actualCash || 0);
    totalCard = Number(closing.cardSales || closing.actualCard || 0);
    totalUPI = Number(closing.upiSales || closing.actualUPI || 0);
    grandPaid = totalCash + totalCard + totalUPI;
    grandRemaining = grandTotal - grandPaid;

    orderRowsHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:#999;padding:10px 0;">No order breakdown available</td>
      </tr>
    `;
  }

  const printWindow = window.open("", "_blank", "width=420,height=700");
  if (!printWindow) return;

  let paymentBreakdownHTML = "";

  if (totalCash > 0) {
    paymentBreakdownHTML += `
      <div class="summary-row">
        <span>Cash</span>
        <span>⃁ ${formatNum(totalCash)}</span>
      </div>
    `;
  }

  if (totalCard > 0) {
    paymentBreakdownHTML += `
      <div class="summary-row">
        <span>Card</span>
        <span>⃁ ${formatNum(totalCard)}</span>
      </div>
    `;
  }

  if (totalUPI > 0) {
    paymentBreakdownHTML += `
      <div class="summary-row">
        <span>UPI</span>
        <span>⃁ ${formatNum(totalUPI)}</span>
      </div>
    `;
  }

  if (totalOther > 0) {
    paymentBreakdownHTML += `
      <div class="summary-row">
        <span>Other</span>
        <span>⃁ ${formatNum(totalOther)}</span>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Daily Closing Receipt - ${closingNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          width: 380px;
          margin: 0 auto;
          padding: 20px 10px;
          color: #333;
          font-size: 12px;
        }
        .header {
          text-align: center;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 14px;
          margin-bottom: 14px;
        }
        .shop-name {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .receipt-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #666;
          margin-top: 6px;
        }
        .meta {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 4px;
        }
        .meta-label { color: #888; }
        .meta-section {
          border-bottom: 1px dashed #ccc;
          padding-bottom: 10px;
          margin-bottom: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 6px;
        }
        th {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          padding: 6px 4px;
          border-bottom: 1px solid #ddd;
          color: #555;
        }
        td {
          padding: 5px 4px;
          font-size: 11px;
          border-bottom: 1px dashed #eee;
        }
        .section-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
          border-bottom: 1px dashed #ccc;
          padding-bottom: 4px;
          margin: 14px 0 8px 0;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 3px 0;
          font-size: 11px;
          font-weight: 600;
          color: #444;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 700;
          padding: 3px 0;
        }
        .total-row.main {
          border-top: 1px solid #ccc;
          padding-top: 8px;
          margin-top: 4px;
        }
        .remaining { color: #e53e3e; }
        .paid-color { color: #38a169; }
        .footer {
          text-align: center;
          margin-top: 16px;
          border-top: 1px dashed #ccc;
          padding-top: 10px;
        }
        .footer-text {
          font-size: 9px;
          color: #999;
          letter-spacing: 0.5px;
        }
        @media print {
          body { width: 100%; padding: 0 5px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="shop-name">${shopName}</div>
        <div class="receipt-title">Daily Closing Receipt</div>
      </div>

      <div class="meta-section">
        <div class="meta">
          <span><span class="meta-label">Closing #:</span> ${closingNumber}</span>
          <span><span class="meta-label">Date:</span> ${closingDate}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Invoice</th>
            <th style="text-align:right;">Total</th>
            <th style="text-align:right;">Paid</th>
            <th style="text-align:right;">Remaining</th>
            <th style="text-align:center;">Method</th>
          </tr>
        </thead>
        <tbody>
          ${orderRowsHTML}
        </tbody>
      </table>

      <div class="total-row main">
        <span>Total</span>
        <span>⃁ ${formatNum(grandTotal)}</span>
      </div>
      <div class="total-row paid-color" style="font-size:11px;">
        <span>Paid</span>
        <span>⃁ ${formatNum(grandPaid)}</span>
      </div>
      <div class="total-row remaining" style="font-size:11px;">
        <span>Remaining</span>
        <span>⃁ ${formatNum(grandRemaining)}</span>
      </div>

      <div class="section-label">Payment Method Breakdown</div>
      ${paymentBreakdownHTML}
      <div class="summary-row" style="border-top:1px dashed #ccc;padding-top:6px;margin-top:4px;font-weight:700;color:#333;">
        <span>Total Collected</span>
        <span>⃁ ${formatNum(grandPaid)}</span>
      </div>

      <div class="footer">
        <div class="footer-text">${new Date().toLocaleString()}</div>
      </div>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};