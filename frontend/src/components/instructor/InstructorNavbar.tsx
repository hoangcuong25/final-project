"use client";

import React, { useEffect } from "react";
import { Menu, LogOut, LayoutDashboard, BookOpen, Bell } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@public/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { fetchUser, logoutUser } from "@/store/userSlice";
import { toast } from "sonner";

const InstructorNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  if (loading) return <p>Loading...</p>;

  const menuItems = [
    { label: "Trang chủ giảng viên", path: "/instructor/dashboard" },
    { label: "Khóa học của tôi", path: "/instructor/courses" },
    { label: "Đơn ứng tuyển", path: "/instructor/applications" },
    { label: "Trung tâm trợ giúp", path: "/instructor/support" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 max-w-[1700px] mx-auto rounded-2xl"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/instructor/dashboard")}
      >
        <Image
          src={logo}
          alt="EduSmart Logo"
          width={45}
          height={45}
          className="rounded-full"
        />
        <span className="hidden md:block text-xl font-bold text-indigo-600 tracking-wide">
          EduSmart Instructor
        </span>
      </motion.div>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {menuItems.map((item, index) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          return (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`cursor-pointer transition-all duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
                  : "text-gray-700 hover:text-indigo-600"
              }`}
            >
              <Link href={item.path}>{item.label}</Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors duration-200" />
          </motion.div>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 px-2.5">
          <SheetHeader className="flex flex-col items-start gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src={logo}
                alt="EduSmart Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-indigo-600">
                EduSmart Instructor
              </span>
            </motion.div>
          </SheetHeader>

          {/* Menu Items */}
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            {menuItems.map((item, index) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);

              return (
                <motion.span
                  key={index}
                  whileHover={{ x: 5, color: "#4f46e5" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`cursor-pointer transition-colors ${
                    isActive ? "text-indigo-600 font-semibold" : ""
                  }`}
                >
                  <Link href={item.path}>{item.label}</Link>
                </motion.span>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-100/50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
            >
              <Bell className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 text-sm font-medium cursor-pointer">
                Thông báo
              </span>
            </motion.button>

            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition"
              >
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600 text-sm font-semibold">
                  Đăng xuất
                </span>
              </motion.button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
              >
                <span className="text-indigo-600 text-sm font-semibold">
                  Đăng nhập
                </span>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* User Section - Desktop */}
      <div className="hidden lg:flex items-center gap-5">
        {/* 🔹 Thông báo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-indigo-100/50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
        >
          <Bell className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-600 text-sm font-medium cursor-pointer">
            Thông báo
          </span>
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            5
          </span>
        </motion.button>

        {/* 🔹 User dropdown */}
        {user ? (
          <div className="relative group inline-block">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition duration-200">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.fullname}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-indigo-600">
                {user.fullname}
              </span>
            </button>

            <div
              className="
                invisible opacity-0 translate-y-1
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-150
                absolute right-0 mt-2 w-56 z-50
                rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-lg
              "
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.fullname}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/instructor/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Hồ sơ giảng viên
                </Link>
                <Link
                  href="/instructor/courses"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Quản lý khóa học
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
          >
            <span className="text-indigo-600 text-sm font-semibold">
              Đăng nhập
            </span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default InstructorNavbar;
