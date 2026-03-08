import React from 'react';

// Define the shape of an Order that the printer expects
export interface PrintOrder {
  id: string; // The order ID (even local)
  type: 'Dine-In' | 'Takeaway' | 'Delivery';
  table_number?: string;
  customer_info?: Record<string, unknown>;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  date: Date;
}

interface ReceiptPrinterProps {
  order: PrintOrder;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
  vatNumber?: string;
}

/**
 * ReceiptPrinter Component
 * 
 * This component handles the layout for 80mm/58mm thermal printers.
 * It uses an `@media print` query injected directly into the component
 * to strip away standard browser margins and ensure it fits the roll exactly.
 * 
 * In standard view, it is hidden. It only becomes visible when `window.print()` is called.
 */
export const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({
  order,
  restaurantName = 'myRestro',
  restaurantAddress = 'Kathmandu, Nepal',
  restaurantPhone = '+977-9800000000',
  vatNumber = '123456789'
}) => {
  return (
    <>
      <style type="text/css">
        {`
          /* Force exact dimensions during print */
          @media print {
            @page {
              margin: 0;
              padding: 0;
            }
          }
          .thermal-print-container *, .thermal-print-container {
            visibility: visible;
          }
          .thermal-print-container {
            width: 80mm; /* Standard thermal roll width */
            padding: 5mm;
            font-family: 'Courier New', Courier, monospace; /* Monospace is best for receipts */
            font-size: 12px;
            color: black;
            background: white;
          }
            
            .receipt-header {
              text-align: center;
              margin-bottom: 5mm;
            }
            .receipt-header h1 {
              font-size: 18px;
              margin: 0 0 2px 0;
            }
            .receipt-header p {
              margin: 2px 0;
              font-size: 10px;
            }
            
            .receipt-meta {
              margin-bottom: 5mm;
              border-bottom: 1px dashed black;
              padding-bottom: 2mm;
            }
            .receipt-meta p {
              margin: 2px 0;
            }
            
            .receipt-items {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 5mm;
            }
            .receipt-items th {
              border-bottom: 1px dashed black;
              padding-bottom: 2mm;
              text-align: left;
            }
            .receipt-items td {
              padding: 2px 0;
              vertical-align: top;
            }
            .receipt-items .col-qty { width: 15%; }
            .receipt-items .col-item { width: 55%; }
            .receipt-items .col-price { width: 30%; text-align: right; }
            .receipt-items th.col-price { text-align: right; }
            
            .receipt-totals {
              border-top: 1px dashed black;
              padding-top: 2mm;
              margin-bottom: 5mm;
            }
            .receipt-totals-row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .receipt-totals-row.grand-total {
              font-size: 14px;
              font-weight: bold;
              margin-top: 2mm;
              border-top: 1px dashed black;
              padding-top: 2mm;
            }
            
          .receipt-footer {
            text-align: center;
            font-size: 10px;
            margin-top: 5mm;
          }
        `}
      </style>

      <div className="thermal-print-container" id={`receipt-${order.id}`}>
        
        {/* Header */}
        <div className="receipt-header">
          <h1>{restaurantName}</h1>
          <p>{restaurantAddress}</p>
          {restaurantPhone && <p>Ph: {restaurantPhone}</p>}
          {vatNumber && <p>VAT/PAN: {vatNumber}</p>}
        </div>

        {/* Meta Info */}
        <div className="receipt-meta">
          <p>Order #: {order.id}</p>
          <p>Date: {order.date.toLocaleDateString()} {order.date.toLocaleTimeString()}</p>
          <p>Type: {order.type}</p>
          {order.table_number && <p>Table: {order.table_number}</p>}
        </div>

        {/* Items */}
        <table className="receipt-items">
          <thead>
            <tr>
              <th className="col-qty">Q</th>
              <th className="col-item">Item</th>
              <th className="col-price">Amt</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="col-qty">{item.quantity}</td>
                <td className="col-item">{item.name}</td>
                <td className="col-price">{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="receipt-totals">
          <div className="receipt-totals-row">
            <span>Subtotal</span>
            <span>{order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="receipt-totals-row">
              <span>Discount</span>
              <span>-{order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="receipt-totals-row">
            <span>VAT</span>
            <span>{order.tax.toFixed(2)}</span>
          </div>
          <div className="receipt-totals-row grand-total">
            <span>TOTAL (NPR)</span>
            <span>{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p>Thank you for your visit!</p>
          <p>Powered by myRestro</p>
        </div>

      </div>
    </>
  );
};

// -------------------------------------------------------------
// KOT PRINTER COMPONENT
// -------------------------------------------------------------
interface KOTPrinterProps {
  order: PrintOrder;
  kotNumber: number; // Daily incremental number often used in kitchens
}

export const KOTPrinter: React.FC<KOTPrinterProps> = ({ order, kotNumber }) => {
  // Filter for food only if you wanted generic routing, 
  // but usually we pass pre-filtered items based on routing.
  
  return (
    <>
      <style type="text/css">
        {`
          @media print {
            @page {
              margin: 0;
              padding: 0;
            }
          }
          .kot-print-container {
            width: 80mm;
            padding: 5mm;
            font-family: 'Courier New', Courier, monospace;
            font-size: 14px; /* Larger font for kitchen staff */
            font-weight: bold;
            color: black;
            background: white;
          }
            .kot-print-container, .kot-print-container * {
              visibility: visible;
            }
            .kot-header {
              text-align: center;
              border-bottom: 2px solid black;
              padding-bottom: 3mm;
              margin-bottom: 3mm;
            }
            .kot-header h1 {
              font-size: 24px;
              margin: 0;
            }
            .kot-meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5mm;
              border-bottom: 1px dashed black;
              padding-bottom: 3mm;
            }
            .kot-items {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-items th {
              text-align: left;
              border-bottom: 1px dashed black;
              padding-bottom: 2mm;
            }
            .kot-items td {
              padding: 4px 0;
              vertical-align: top;
            }
          .kot-items .col-qty { width: 15%; font-size: 16px; }
          .kot-items .col-item { width: 85%; font-size: 16px; }
        `}
      </style>

      <div className="kot-print-container" id={`kot-${order.id}`}>
        <div className="kot-header">
          <h1>KOT #{kotNumber}</h1>
          <p style={{ margin: 0 }}>{order.type}</p>
        </div>

        <div className="kot-meta">
          <span>Table: {order.table_number || 'N/A'}</span>
          <span>{order.date.toLocaleTimeString()}</span>
        </div>

        <table className="kot-items">
          <thead>
            <tr>
              <th className="col-qty">QTY</th>
              <th className="col-item">ITEM</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="col-qty">[{item.quantity}]</td>
                <td className="col-item">{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
