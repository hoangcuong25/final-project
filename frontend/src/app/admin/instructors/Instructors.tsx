"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Users,
  FileText,
  Check,
  X,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react";

/**
 * Mock data — thay bằng data thật từ API khi tích hợp
 */
const MOCK_INSTRUCTORS = [
  {
    id: 1,
    fullname: "Nguyễn Văn A",
    email: "vana@example.com",
    lecturesCount: 24,
    status: "ACTIVE",
  },
  {
    id: 2,
    fullname: "Trần Thị B",
    email: "thib@example.com",
    lecturesCount: 8,
    status: "ACTIVE",
  },
  {
    id: 3,
    fullname: "Lê Minh C",
    email: "minhc@example.com",
    lecturesCount: 0,
    status: "INACTIVE",
  },
];

const MOCK_APPLICATIONS = [
  {
    id: 101,
    userFullname: "Phạm D",
    userEmail: "pham.d@example.com",
    experience: "4 năm giảng dạy, chuyên JavaScript & React.",
    bio: "Tôi muốn chia sẻ kinh nghiệm lập trình web cho cộng đồng.",
    specializations: ["Frontend", "React"],
    createdAt: "2025-08-02",
    status: "PENDING",
  },
  {
    id: 102,
    userFullname: "Hoàng E",
    userEmail: "hoang.e@example.com",
    experience: "2 năm giảng dạy offline tại trung tâm.",
    bio: "Tập trung về UX/UI và design thinking.",
    specializations: ["UI/UX"],
    createdAt: "2025-07-28",
    status: "PENDING",
  },
];

export default function AdminInstructorsPage() {
  const [tab, setTab] = useState<"overview" | "instructors" | "applications">(
    "overview"
  );
  const [query, setQuery] = useState("");
  const [instructors] = useState(MOCK_INSTRUCTORS);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);

  // filter instructors by search
  const filteredInstructors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return instructors;
    return instructors.filter(
      (i) =>
        i.fullname.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q)
    );
  }, [instructors, query]);

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  // handlers (mock)
  const handleApproveApp = (id: number) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a))
    );
  };
  const handleRejectApp = (id: number) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "REJECTED" } : a))
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">
            Quản lý giảng viên
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Xem danh sách giảng viên, số bài giảng và xử lý các đơn ứng tuyển.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Input
              placeholder="Tìm kiếm tên hoặc email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-indigo-200 focus:ring-indigo-400 focus:border-indigo-400"
            />
            <Search className="absolute left-3 top-2.5 text-indigo-400 w-4 h-4" />
          </div>

          <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Thêm giảng viên
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
          onClick={() => setTab("instructors")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === "instructors"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-100"
          }`}
        >
          Giảng viên
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            tab === "applications"
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow"
              : "bg-white text-indigo-700 border border-indigo-100"
          }`}
        >
          Ứng tuyển ({pendingApps.length})
        </button>
      </div>

      {/* Content */}
      {tab === "overview" && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Tổng số giảng viên
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {instructors.length}
                </div>
                <div className="text-sm text-gray-500">
                  Giảng viên đang hoạt động/đăng ký
                </div>
              </div>
              <Users className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Tổng số bài giảng
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {instructors.reduce((s, i) => s + i.lecturesCount, 0)}
                </div>
                <div className="text-sm text-gray-500">
                  Bài giảng trên toàn hệ thống
                </div>
              </div>
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-indigo-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Đơn ứng tuyển đang chờ
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-indigo-700">
                  {pendingApps.length}
                </div>
                <div className="text-sm text-gray-500">Ứng viên chờ duyệt</div>
              </div>
              <FileText className="w-10 h-10 text-indigo-500" />
            </CardContent>
          </Card>
        </section>
      )}

      {tab === "instructors" && (
        <section className="mt-6">
          {/* instructors table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-indigo-100">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Giảng viên
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Số bài giảng
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
                {filteredInstructors.map((ins) => (
                  <tr key={ins.id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ins.fullname}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ins.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {ins.lecturesCount}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`px-2 py-1 rounded-md text-sm ${
                          ins.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ins.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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

      {tab === "applications" && (
        <section className="mt-6 grid md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card
              key={app.id}
              className="rounded-2xl border border-indigo-100 shadow-sm"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      {app.userFullname}
                    </div>
                    <div className="text-sm text-gray-500">{app.userEmail}</div>
                  </div>
                  <div className="text-sm text-gray-500">{app.createdAt}</div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Kinh nghiệm:</strong> {app.experience}
                </p>
                <p>
                  <strong>Giới thiệu:</strong> {app.bio}
                </p>
                <p>
                  <strong>Chuyên ngành:</strong>{" "}
                  {app.specializations.join(", ")}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md">
                      {app.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveApp(app.id)}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Duyệt
                    </Button>
                    <Button
                      onClick={() => handleRejectApp(app.id)}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Từ chối
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
