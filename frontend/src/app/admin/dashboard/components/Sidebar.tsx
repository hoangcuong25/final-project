import { Button } from "@/components/ui/button";
import React from "react";

const SidebarAdmin = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-600 to-blue-600 text-white flex flex-col p-6 shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-10 text-center">EduSmart Admin</h1>
      <nav className="flex flex-col gap-4">
        <a className="hover:bg-indigo-500 px-4 py-2 rounded-lg transition">
          📘 Quản lý khóa học
        </a>
        <a className="hover:bg-indigo-500 px-4 py-2 rounded-lg transition">
          👩‍🎓 Quản lý học viên
        </a>
        <a className="hover:bg-indigo-500 px-4 py-2 rounded-lg transition">
          💰 Doanh thu
        </a>
        <a className="hover:bg-indigo-500 px-4 py-2 rounded-lg transition">
          📊 Báo cáo thống kê
        </a>
        <a className="hover:bg-indigo-500 px-4 py-2 rounded-lg transition">
          ⚙️ Cài đặt hệ thống
        </a>
      </nav>

      <div className="mt-auto pt-10 border-t border-indigo-400">
        <Button
          variant="outline"
          className="w-full text-indigo-600 bg-white hover:bg-indigo-50"
        >
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
