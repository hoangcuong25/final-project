"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import Image from "next/image";
import { updateUser } from "@/api/user.api";
import { toast } from "sonner";
import { GenderEnum, GenderLabel } from "@/constants/Gender";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [updateInfo, setUpdateInfo] = useState({
    fullname: "",
    phone: "",
    address: "",
    dob: "",
    gender: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", updateInfo.fullname);
      formData.append("phone", updateInfo.phone);
      formData.append("address", updateInfo.address);
      formData.append("dob", updateInfo.dob);
      formData.append("gender", updateInfo.gender);
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateUser(formData);
      toast.success("Cập nhật hồ sơ thành công 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật hồ sơ thất bại!");
    }
  };

  useEffect(() => {
    if (user) {
      setUpdateInfo({
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        gender: user.gender || "",
      });
      setPreview(user.avatar || "");
    }
  }, [user]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200">
          Chỉnh sửa hồ sơ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600 text-center">
            Cập nhật thông tin hồ sơ ✏️
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={updateProfile} className="space-y-5 py-2">
          {/* Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-blue-700 font-medium">
              Ảnh đại diện
            </Label>
            <div className="flex items-center gap-4">
              <Image
                src={preview || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover shadow-sm"
                width={80}
                height={80}
              />
              <div>
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor="avatar"
                  className="cursor-pointer px-3 py-1.5 text-sm rounded-md bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 transition-all"
                >
                  Chọn ảnh
                </label>
              </div>
            </div>
          </div>

          {/* Fullname */}
          <div className="space-y-2">
            <Label htmlFor="fullname" className="text-blue-700 font-medium">
              Họ và tên
            </Label>
            <Input
              id="fullname"
              type="text"
              placeholder="Nhập họ và tên"
              className="focus-visible:ring-blue-500 border-blue-300 rounded-lg"
              value={updateInfo.fullname}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, fullname: e.target.value })
              }
            />
          </div>

          {/* Email (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              disabled
              className="bg-gray-100 border-blue-300 text-gray-700 rounded-lg"
              value={user?.email || ""}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-blue-700 font-medium">
              Số điện thoại
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="Nhập số điện thoại"
              className="focus-visible:ring-blue-500 border-blue-300 rounded-lg"
              value={updateInfo.phone}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, phone: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-blue-700 font-medium">
              Địa chỉ
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Nhập địa chỉ"
              className="focus-visible:ring-blue-500 border-blue-300 rounded-lg"
              value={updateInfo.address}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, address: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className="text-blue-700 font-medium">Giới tính</Label>
            <Select
              value={updateInfo.gender}
              onValueChange={(val) =>
                setUpdateInfo({ ...updateInfo, gender: val as GenderEnum })
              }
            >
              <SelectTrigger className="border-blue-300 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={GenderEnum.Male}>
                  {GenderLabel[GenderEnum.Male]}
                </SelectItem>
                <SelectItem value={GenderEnum.Female}>
                  {GenderLabel[GenderEnum.Female]}
                </SelectItem>
                <SelectItem value={GenderEnum.Other}>
                  {GenderLabel[GenderEnum.Other]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-blue-700 font-medium">
              Ngày sinh
            </Label>
            <Input
              id="dob"
              type="date"
              className="focus-visible:ring-blue-500 border-blue-300 rounded-lg"
              value={updateInfo.dob}
              onChange={(e) =>
                setUpdateInfo({ ...updateInfo, dob: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 shadow-md transition-all duration-200"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
