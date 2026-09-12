import Link from "next/link";
import Image from "next/image";
import type { OrderResponse } from "@/lib/api/order.service";
import { formatPrice } from "@/lib/utils/format.util";

type Props = { order: OrderResponse };

export default function OrderSuccess({ order }: Props) {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top bar */}
      <div className="border-b border-[#e2e8f0] px-5 sm:px-8 md:px-12 py-4 flex items-center justify-between bg-[#0f2e5a]">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/officecare.png"
            alt="Office Care"
            width={130}
            height={42}
            unoptimized
            className="h-7 sm:h-8 w-auto object-contain"
            priority
          />
        </Link>
        <Link
          href="/"
          className="text-[11px] tracking-[0.12em] uppercase text-white/90 hover:text-white transition-colors no-underline font-medium"
        >
          Return to Home
        </Link>
      </div>

      <div className="px-5 sm:px-8 md:px-12 pt-12 sm:pt-16 max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 border border-blue-200 mb-6 shadow-2xs">
          <svg
            className="w-8 h-8 text-[#0f2e5a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <p className="text-[10.5px] tracking-[0.22em] uppercase text-[#64748b] mb-2 font-medium">
          Requisition Submitted Successfully
        </p>
        <h1 className="text-2xl sm:text-3xl font-light font-serif text-[#0f2e5a] tracking-tight mb-3">
          Requisition Confirmed
        </h1>
        <p className="text-xs text-[#64748b] tracking-wide max-w-md mx-auto mb-8 leading-relaxed">
          Your order has been recorded. Confirmation sent to{" "}
          <span className="font-semibold text-[#0f172a]">{order.email}</span>.
        </p>

        {/* Order card */}
        <div className="border border-[#e2e8f0] text-left mb-10 overflow-hidden rounded-xs shadow-xs">
          {/* Card header */}
          <div className="bg-[#f0f4f9] px-6 py-4 border-b border-[#e2e8f0] flex flex-wrap justify-between items-center gap-2">
            <div>
              <p className="text-[9px] tracking-wider uppercase text-[#64748b] font-medium">
                Requisition Reference
              </p>
              <p className="text-sm font-mono font-bold text-[#0f2e5a] mt-0.5">
                {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] tracking-wider uppercase text-[#64748b] font-medium">
                Status
              </p>
              <span className="inline-block text-[9px] tracking-[0.14em] uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 mt-0.5 font-semibold rounded-xs">
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6 bg-white">
            {/* Items */}
            <div>
              <p className="text-[10.5px] tracking-[0.18em] uppercase text-[#0f2e5a] mb-3 pb-1 border-b border-[#e2e8f0] font-semibold">
                Requisition Items
              </p>
              <div className="divide-y divide-[#e2e8f0]/70">
                {order.items.map((item) => {
                  const lineTotal =
                    item.price *
                    item.quantity *
                    (item.transactionType === "rent"
                      ? item.rentalDurationDays || 1
                      : 1);
                  return (
                    <div
                      key={item.sku}
                      className="py-3.5 flex justify-between items-start gap-4 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#0f172a] truncate text-sm">
                          {item.name}
                        </p>
                        <div className="text-[10px] text-[#64748b] flex items-center gap-2 mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.sku && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[#475569]">
                                SAP ID: {item.sku}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-[#0f172a] font-semibold text-sm shrink-0">
                        {formatPrice(lineTotal)} SAR
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requester & Department Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#e2e8f0]">
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#0f2e5a] mb-2 font-semibold">
                  Requester Details
                </p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  <span className="font-medium text-[#0f172a]">{order.customerInfo.name}</span>
                  <br />
                  Phone: {order.customerInfo.phone}
                  <br />
                  Email: {order.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-[#0f2e5a] mb-2 font-semibold">
                  Requisition Destination
                </p>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Cost Center: 1000-2200
                  <br />
                  Plant: 1000 (Consignment store)
                  <br />
                  Vendor: 455853
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="pt-4 border-t border-[#e2e8f0] space-y-2">
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Subtotal</span>
                <span className="font-medium text-[#0f172a]">
                  {formatPrice(order.pricingSummary.subtotal)} SAR
                </span>
              </div>
              {order.pricingSummary.totalSecurityDeposits > 0 && (
                <div className="flex justify-between text-xs text-[#64748b]">
                  <span>Refundable Deposits</span>
                  <span className="font-medium text-[#0f172a]">
                    {formatPrice(order.pricingSummary.totalSecurityDeposits)} SAR
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base text-[#0f2e5a] font-bold pt-2.5 border-t border-[#e2e8f0]">
                <span>Total Amount</span>
                <span>{formatPrice(order.pricingSummary.totalAmount)} SAR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Prominent Button for Home Page */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="bg-[#0f2e5a] text-white text-[11px] tracking-[0.16em] uppercase px-10 py-4 hover:bg-[#0b2447] transition-colors text-center no-underline rounded-xs font-semibold shadow-2xs"
          >
            Return to Home
          </Link>
          <Link
            href="/orders"
            className="border border-[#0f2e5a] text-[#0f2e5a] text-[11px] tracking-[0.16em] uppercase px-8 py-4 hover:bg-blue-50 transition-colors text-center no-underline rounded-xs font-semibold"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}