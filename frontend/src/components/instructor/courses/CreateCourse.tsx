"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ImageIcon, X, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { createCourse, fetchCoursesByInstructor } from "@/store/coursesSlice";
import { CourseFormData, courseSchema } from "@/hook/zod-schema/CourseSchema";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { fetchSpecializationsByInstructorId } from "@/store/specializationSlice";

export default function CourseCreate() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user
  );
  const { instructorSpecializaions, loading: specializationLoading } =
    useSelector((state: RootState) => state.specialization);

  useEffect(() => {
    if (user) {
      dispatch(fetchSpecializationsByInstructorId(Number(user?.id)));
    }
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
  });

  // 🖼️ Chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setValue("thumbnail", selectedFile);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setValue("thumbnail", undefined);
  };

  // 🚀 Submit
  const onSubmit = async (data: CourseFormData) => {
    if (!selectedSpecId) {
      toast.error("Vui lòng chọn chuyên ngành!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("specializationId", selectedSpecId.toString());
      if (file) formData.append("thumbnail", file);
      if (user?.id === undefined) {
        return toast.error("Người dùng không hợp lệ");
      }
      formData.append("instructorId", user.id.toString());

      await dispatch(createCourse(formData)).unwrap();
      await dispatch(fetchCoursesByInstructor()).unwrap();

      toast.success("Tạo khóa học thành công!");

      reset();
      removePreview();
      setSelectedSpecId(null);
      setOpen(false);
    } catch (error: any) {
      toast.error("Không thể tạo khóa học!");
    }
  };

  if (userLoading || specializationLoading) return <LoadingScreen />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Tạo khóa học mới</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
          encType="multipart/form-data"
        >
          {/* ─── Tên khóa học ───────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tên khóa học
            </label>
            <Input
              placeholder="Nhập tên khóa học"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ─── Chọn chuyên ngành ───────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Chuyên ngành
            </label>
            <Popover open={selectOpen} onOpenChange={setSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={selectOpen}
                  className="w-full justify-between"
                >
                  {selectedSpecId
                    ? instructorSpecializaions.find(
                        (s) => s.id === selectedSpecId
                      )?.name
                    : "Chọn chuyên ngành"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandList>
                    {instructorSpecializaions.length === 0 ? (
                      <p className="text-center text-gray-500 p-2">
                        Không có chuyên ngành
                      </p>
                    ) : (
                      instructorSpecializaions.map((spec) => (
                        <CommandItem
                          key={spec.id}
                          value={spec.id.toString()}
                          onSelect={(value) => {
                            setSelectedSpecId(Number(value));
                            setSelectOpen(false);
                          }}
                          className="flex items-center justify-between"
                        >
                          <span>{spec.name}</span>
                          {selectedSpecId === spec.id && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </CommandItem>
                      ))
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {!selectedSpecId && (
              <p className="text-sm text-gray-500 mt-1">
                Hãy chọn chuyên ngành phù hợp.
              </p>
            )}
          </div>

          {/* ─── Mô tả ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả khóa học"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ─── Giá ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
            <Input
              type="number"
              placeholder="Nhập giá"
              {...register("price", { valueAsNumber: true })}
              className={errors.price ? "border-red-500" : ""}
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* ─── Ảnh khóa học ───────────────────────────── */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh khóa học
            </label>

            {!preview ? (
              <label
                htmlFor="thumbnail"
                className={`flex flex-col items-center justify-center border border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 ${
                  errors.thumbnail ? "border-red-500" : ""
                }`}
              >
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Chọn ảnh từ thiết bị
                </span>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePreview}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.thumbnail && (
              <p className="text-sm text-red-500 mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* ─── Footer ───────────────────────────── */}
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
