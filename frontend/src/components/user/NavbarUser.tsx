'use client'

import React from "react";
import { Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@public/logo.png";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";

const NavbarUser = () => {
    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50 max-w-[1700px] mx-auto"
        >
            {/* Logo + Name */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center gap-3 cursor-pointer"
            >
                <Image src={logo} alt="Logo" width={45} height={45} className="rounded-full" />
                <span className="hidden md:block text-xl font-bold text-green-600 tracking-wide">
                    Badminton Booking
                </span>
            </motion.div>

            {/* Menu Links - Desktop */}
            <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
                {["Trang chủ", "Đặt sân", "Lịch sử đặt", "Liên hệ"].map((item, index) => (
                    <motion.li
                        key={index}
                        whileHover={{ scale: 1.1, color: "#16a34a" }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-gray-700 cursor-pointer"
                    >
                        {item}
                    </motion.li>
                ))}
            </ul>

            {/* Mobile Menu */}
            <Sheet>
                <SheetTrigger className="lg:hidden">
                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600 transition-colors duration-200" />
                    </motion.div>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 px-2.5">
                    <SheetHeader className="flex flex-col items-start gap-4 mb-6">
                        {/* Logo + Tên */}
                        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3 cursor-pointer">
                            <Image src={logo} alt="Logo" width={40} height={40} className="rounded-full" />
                            <span className="text-lg font-bold text-green-600">
                                Badminton Booking
                            </span>
                        </motion.div>
                    </SheetHeader>

                    {/* Menu Items */}
                    <nav className="flex flex-col gap-4 text-gray-700 font-medium">
                        {["Trang chủ", "Đặt sân", "Lịch sử đặt", "Liên hệ"].map((item, index) => (
                            <motion.span
                                key={index}
                                whileHover={{ x: 5, color: "#16a34a" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="cursor-pointer"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition duration-200"
                        >
                            <User className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 text-sm font-medium">Tài khoản</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition duration-200"
                        >
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="text-red-500 text-sm font-medium">Đăng xuất</span>
                        </motion.button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* User Section - Desktop */}
            <div className="hidden lg:flex items-center gap-5">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition duration-200"
                >
                    <User className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 text-sm font-medium">Tài khoản</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition duration-200"
                >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <span className="text-red-500 text-sm font-medium">Đăng xuất</span>
                </motion.button>
            </div>
        </motion.nav>
    );
};

export default NavbarUser;
