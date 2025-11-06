"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Wallet, PlusCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function WalletPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);

  // Demo transactions
  const transactions = [
    { id: 1, type: "Nạp tiền", amount: 500000, date: "2025-11-01T09:30:00Z" },
    {
      id: 2,
      type: "Mua khóa học",
      amount: -199000,
      date: "2025-11-03T14:10:00Z",
    },
  ];

  const handleDeposit = () => {
    if (amount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    toast.success(`Nạp ${amount.toLocaleString()} LearnCoin thành công!`);
    setAmount(0);
    setIsOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-6 mb-6">
        <Wallet className="w-10 h-10 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Ví của tôi</h1>
          <p className="text-gray-600 text-sm">
            Quản lý số dư và lịch sử giao dịch của bạn.
          </p>
        </div>
      </div>

      {/* Balance Section */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-gray-600">Số dư hiện tại</p>
          <h2 className="text-3xl font-bold text-blue-700 mt-1">
            {(user?.walletBalance || 0).toLocaleString()} LearnCoin
          </h2>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Nạp tiền
        </Button>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" /> Lịch sử giao dịch
        </h2>

        {transactions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {transactions.map((t) => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{t.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(t.date).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    t.amount > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {t.amount > 0 ? "+" : ""}
                  {t.amount.toLocaleString()} LC
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Chưa có giao dịch nào.</p>
        )}
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nạp tiền vào ví</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhập số tiền cần nạp (LearnCoin)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Nhập số tiền..."
            />

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleDeposit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Xác nhận nạp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
