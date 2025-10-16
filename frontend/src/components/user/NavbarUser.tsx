"use client";

import React, { useEffect } from "react";
import { Menu, User, Bell } from "lucide-react";
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
import LoadingScreen from "../LoadingScreen";

const NavbarUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logoutUser());

    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  const handleClickInstructor = () => {
    if (user?.role === "INSTRUCTOR") {
      router.push("/instructor/dashboard");
    } else {
      router.push("/become-instructor");
    }
  };

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/courses" },
    { label: "Lộ trình học", path: "/my-learning" },
    { label: "Liên hệ", path: "/contact-us" },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 max-w-[1700px] mx-auto rounded-2xl"
    >
      {/* Logo + Name */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center gap-3 cursor-pointer"
      >
        <Link href="/">
          <Image
            src={logo}
            alt="EduSmart Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
        </Link>
        <span className="hidden md:block text-xl font-bold text-indigo-600 tracking-wide">
          EduSmart
        </span>
      </motion.div>

      {/* Menu Links - Desktop */}
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
                EduSmart
              </span>
            </motion.div>
          </SheetHeader>

          {/* Menu Items - Mobile */}
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
            {/* 🔹 Giảng dạy */}
            <motion.div whileHover={{ scale: 1.05 }}>
              <div
                onClick={handleClickInstructor}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
              >
                <span className="text-sm font-semibold text-indigo-700">
                  Giảng dạy trên EduSmart
                </span>
              </div>
            </motion.div>

            {/* 🔹 Thông báo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-100/50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
            >
              <Bell className="w-5 h-5 text-indigo-600" />
              <span className="text-indigo-600 text-sm font-medium cursor-pointer">
                Thông báo
              </span>
              <span className="ml-auto flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </motion.button>

            {/* 🔹 User info */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition duration-200"
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <span className="text-sm font-medium text-indigo-600">
                  {user.fullname}
                </span>
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 rounded-full hover:bg-indigo-500/20 transition duration-200"
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="text-indigo-600 text-sm font-semibold">
                    Đăng nhập
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* User Section - Desktop */}
      <div className="hidden lg:flex items-center gap-5">
        {/* 🔹 Giảng dạy */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div
            onClick={handleClickInstructor}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
          >
            <span className="text-sm font-semibold text-indigo-700">
              Giảng dạy trên EduSmart
            </span>
          </div>
        </motion.div>

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
            3
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

            {/* Dropdown */}
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
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Hồ sơ của tôi
                </Link>
                <Link
                  href="/my-learning"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Khóa học của tôi
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
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 rounded-full hover:bg-indigo-500/20 transition duration-200"
          >
            <User className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">
              Đăng nhập
            </span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default NavbarUser;
