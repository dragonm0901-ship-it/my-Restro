import React from 'react';
import { renderToString } from 'react-dom/server';
import { ReceiptPrinter, KOTPrinter, PrintOrder } from '@/components/ReceiptPrinter';

/**
 * Utility to print a React component by injecting it into a hidden iframe.
 * This ensures the print dialog only contains the specific component,
 * isolating it from the rest of the application.
 */
function printHtmlInIframe(htmlContent: string) {
  // Create a hidden iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  
  // Append to body so it gets a document
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    console.error('Failed to get iframe document for printing');
    document.body.removeChild(iframe);
    return;
  }

  // Write the HTML content into the iframe
  iframeDoc.open();
  iframeDoc.write(`
    <html>
      <head>
        <title>Print Receipt</title>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Wait for images/styles to potentially load, then print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // Clean up after printing (wait a bit to ensure print dialog opened)
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
}

export function printReceipt(order: PrintOrder) {
  const html = renderToString(<ReceiptPrinter order={order} />);
  printHtmlInIframe(html);
}

export function printKOT(order: PrintOrder, kotNumber: number) {
  const html = renderToString(<KOTPrinter order={order} kotNumber={kotNumber} />);
  printHtmlInIframe(html);
}
