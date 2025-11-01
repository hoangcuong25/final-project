"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tag,
  Search,
  Plus,
  DollarSign,
  CalendarDays,
  Clock,
  MoreHorizontal,
} from "lucide-react";

// ⚙️ Mock data — sau này thay bằng dữ liệu từ API
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: "Khuyến mãi mùa hè 2025",
    discountPercent: 30,
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "ACTIVE",
  },
  {
    id: 2,
    title: "Black Friday",
    discountPercent: 50,
    startDate: "2025-11-20",
    endDate: "2025-11-30",
    status: "UPCOMING",
  },
  {
    id: 3,
    title: "Giảm giá Tết Nguyên Đán",
    discountPercent: 40,
    startDate: "2025-01-10",
    endDate: "2025-02-10",
    status: "ENDED",
  },
];

export default function AdminDiscountCampaignsPage() {
  const [tab, setTab] = useState<"overview" | "campaigns" | "create">(
    "overview"
  );
  const [query, setQuery] = useState("");
  const [campaigns] = useState(MOCK_CAMPAIGNS);

  const filteredCampaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter((c) => c.title.toLowerCase().includes(q));
  }, [query, campaigns]);

  const activeCount = campaigns.filter((c) => c.status === "ACTIVE").length;
  const upcomingCount = campaigns.filter((c) => c.status === "UPCOMING").length;
  const endedCount = campaigns.filter((c) => c.status === "ENDED").length;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            Quản lý chiến dịch giảm giá
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem, thêm hoặc chỉnh sửa các chiến dịch khuyến mãi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Input
              placeholder="Tìm kiếm chiến dịch..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-indigo-200 focus:ring-indigo-400 focus:border-indigo-400"
            />
            <Search className="absolute left-3 top-2.5 text-indigo-400 w-4 h-4" />
          </div>

          <Button
            onClick={() => setTab("create")}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo chiến dịch
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === "overview"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-100"
          }`}
        >
          Tổng quan
        </button>
        <button
          onClick={() => setTab("campaigns")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === "campaigns"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-100"
          }`}
        >
          Danh sách chiến dịch
        </button>
        <button
          onClick={() => setTab("create")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === "create"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-100"
          }`}
        >
          Thêm mới
        </button>
      </div>

      {/* Content */}
      {tab === "overview" && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Chiến dịch đang hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {activeCount}
                </div>
                <div className="text-sm text-gray-500">Đang chạy</div>
              </div>
              <Tag className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Sắp diễn ra
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {upcomingCount}
                </div>
                <div className="text-sm text-gray-500">Chiến dịch sắp tới</div>
              </div>
              <Clock className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Đã kết thúc
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {endedCount}
                </div>
                <div className="text-sm text-gray-500">Chiến dịch đã qua</div>
              </div>
              <DollarSign className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>
        </section>
      )}

      {tab === "campaigns" && (
        <section className="mt-6">
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-indigo-100">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Tên chiến dịch
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Giảm giá
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-100">
                {filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {c.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {c.discountPercent}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {c.startDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {c.endDate}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`px-2 py-1 rounded-md text-sm ${
                          c.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : c.status === "UPCOMING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 px-3 py-1">
                          <MoreHorizontal className="w-4 h-4" /> Chi tiết
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3 py-1 rounded-md"
                        >
                          Sửa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "create" && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 mt-6 max-w-2xl">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Tạo chiến dịch mới
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên chiến dịch
              </label>
              <Input placeholder="VD: Giảm giá mùa tựu trường" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phần trăm giảm giá (%)
              </label>
              <Input type="number" placeholder="Nhập phần trăm" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu
                </label>
                <Input type="date" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc
                </label>
                <Input type="date" />
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              Lưu chiến dịch
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
