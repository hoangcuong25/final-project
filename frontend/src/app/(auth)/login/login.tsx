"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/hook/zod-schema/UserSchema";
import { LoginApi } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import GoogleLoginForm from "@/components/GoogleLoginForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/store/user/userSlice";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await LoginApi(data);

      // Lưu token vào localStorage
      localStorage.setItem("access_token", res.access_token);

      // Gọi redux fetchUser để lấy thông tin user
      await dispatch(fetchUser());

      // Chuyển hướng
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 p-6 my-3 rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl font-bold text-center text-green-600 mb-6"
        >
          Đăng nhập
        </motion.h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:outline-none
                         transition-all duration-200 hover:border-green-400"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-green-500 focus:outline-none
                         transition-all duration-200 hover:border-green-400"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-green-600 hover:underline transition"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold
                       hover:bg-green-700 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting || loading ? "Đang xử lý..." : "Đăng nhập"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">Hoặc</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google login */}
        <GoogleLoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="text-green-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
