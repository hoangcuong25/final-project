"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  PlusCircle,
  ArrowLeft,
  User,
  Percent,
  Info,
  Clock,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/store";
import { fetchDiscountById, deleteDiscount } from "@/store/discount.slice";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";

export default function DiscountDetailPage() {
  const { discountId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentDiscount, loading, error } = useSelector(
    (state: RootState) => state.discount
  );

  // Fetch chi tiết discount
  useEffect(() => {
    if (discountId) {
      dispatch(fetchDiscountById(Number(discountId)));
    }
  }, [discountId, dispatch]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Lỗi tải dữ liệu: {error}
      </div>
    );
  }

  if (!currentDiscount) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy chiến dịch giảm giá
      </div>
    );
  }

  const {
    id,
    title,
    description,
    startsAt,
    endsAt,
    isActive,
    percentage,
    coupons,
    createdAt,
    updatedAt,
    createdBy,
  } = currentDiscount;

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa chiến dịch này không?")) return;
    try {
      await dispatch(deleteDiscount(id)).unwrap();
      toast.success("Xóa chiến dịch thành công!");
      router.push("/admin/discounts");
    } catch {
      toast.error("Không thể xóa chiến dịch");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-lg shadow-sm min-h-[90vh]">
      {/* Header actions */}
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/admin/discounts/create")}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Tạo Coupon
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/discounts/edit/${id}`)}
            className="border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Xóa
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Card className="shadow-lg border-indigo-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Tag className="w-6 h-6" />
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Mô tả */}
          <div className="border-b pb-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-1">
              <Info className="w-5 h-5 text-blue-500" />
              Mô tả chiến dịch
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {description || "Không có mô tả"}
            </p>
          </div>

          {/* Thông tin cơ bản */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-base">
                Thông tin tổng quan
              </h4>
              <div className="flex items-center gap-2 text-gray-600">
                <Percent className="w-4 h-4 text-blue-500" />
                <span>
                  Giảm giá:{" "}
                  <strong className="text-blue-700">
                    {percentage ? `${percentage}%` : "Không có"}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>
                  Bắt đầu:{" "}
                  {startsAt
                    ? new Date(startsAt).toLocaleDateString("vi-VN")
                    : "Chưa có"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>
                  Kết thúc:{" "}
                  {endsAt
                    ? new Date(endsAt).toLocaleDateString("vi-VN")
                    : "Chưa có"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isActive ? (
                  <span className="inline-flex items-center text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" /> Đang hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center text-gray-500">
                    <XCircle className="w-4 h-4 mr-1" /> Không hoạt động
                  </span>
                )}
              </div>
            </div>

            {/* Người tạo & thời gian */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700 text-base">
                Thông tin quản trị
              </h4>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-blue-500" />
                <span>
                  Người tạo:{" "}
                  <strong>
                    {createdBy?.fullname || `#${createdBy?.id || "Ẩn danh"}`}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  Tạo lúc:{" "}
                  {createdAt
                    ? new Date(createdAt).toLocaleString("vi-VN")
                    : "Không có"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>
                  Cập nhật gần nhất:{" "}
                  {updatedAt
                    ? new Date(updatedAt).toLocaleString("vi-VN")
                    : "Không có"}
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách coupon */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-blue-500" />
              Danh sách Coupon ({coupons?.length || 0})
            </h3>

            {coupons && coupons.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {coupons.map((coupon: any) => (
                  <div
                    key={coupon.id}
                    className="border border-blue-100 bg-blue-50 rounded-xl p-3 flex flex-col text-sm text-gray-700 shadow-sm hover:shadow-md transition"
                  >
                    <span className="font-semibold text-blue-700">
                      {coupon.code}
                    </span>
                    <span className="text-gray-500 text-xs mt-1">
                      Giảm {coupon.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-1">Không có coupon nào.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
