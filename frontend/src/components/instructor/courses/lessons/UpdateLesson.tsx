"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateLesson } from "@/store/slice/lessonsSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { lessonSchema, LessonFormData } from "@/hook/zod-schema/LessonSchema";
import { fetchCourseById } from "@/store/slice/coursesSlice";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadVideo } from "@/store/api/cloudinary.api";

const UpdateLesson = ({
  lesson,
  courseId,
}: {
  lesson: any;
  courseId: number;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      content: lesson.content || "",
      orderIndex: lesson.orderIndex ?? 0,
      video: undefined,
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    try {
      let videoUrl = lesson.videoUrl || "";

      // 1. Upload video mới lên Cloudinary nếu có file mới được chọn
      if (data.video instanceof FileList && data.video.length > 0) {
        const file = data.video[0];
        const uploaded = await uploadVideo(file);
        videoUrl = uploaded.secure_url; // Cập nhật videoUrl mới
      } else if (data.video instanceof File) {
        const uploaded = await uploadVideo(data.video);
        videoUrl = uploaded.secure_url;
      }

      // 2. Gửi payload lên NestJS
      const payload = {
        title: data.title,
        content: data.content,
        orderIndex: data.orderIndex ?? 0,
        videoUrl: videoUrl,
      };

      await dispatch(
        updateLesson({ id: lesson.id, payload: payload })
      ).unwrap();
      await dispatch(fetchCourseById(courseId)).unwrap();

      reset({
        title: data.title,
        content: data.content,
        orderIndex: data.orderIndex,
        video: undefined,
      });
      setOpen(false);
      toast.success("Cập nhật bài học thành công!");
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Cập nhật thất bại, vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const selectedVideo = watch("video");
  const selectedFileName =
    selectedVideo instanceof FileList && selectedVideo.length > 0
      ? selectedVideo[0].name
      : selectedVideo instanceof File
      ? selectedVideo.name
      : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white flex items-center gap-2"
        >
          <Pencil size={16} /> Sửa
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài học</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề</Label>
            <Input placeholder="Nhập tiêu đề..." {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Nội dung */}
          <div>
            <Label>Nội dung</Label>
            <RichTextEditor
              value={watch("content")}
              onChange={(html: any) => setValue("content", html)}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Thứ tự bài học */}
          <div>
            <Label>Thứ tự bài học</Label>
            <Input
              type="number"
              min="0"
              {...register("orderIndex", { valueAsNumber: true })}
            />
            {errors.orderIndex && (
              <p className="text-red-500 text-sm mt-1">
                {errors.orderIndex.message}
              </p>
            )}
          </div>

          {/* Upload Video */}
          <div>
            <Label>Video (tùy chọn)</Label>
            <Input type="file" accept="video/*" {...register("video")} />
            {selectedFileName ? (
              <p className="text-sm text-gray-500 mt-1">
                Đã chọn video mới: **{selectedFileName}** (Video cũ sẽ bị thay
                thế)
              </p>
            ) : lesson.videoUrl ? (
              <p className="text-sm text-gray-500 mt-1">
                Video hiện tại:{" "}
                <a
                  href={lesson.videoUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noopener noreferrer"
                >
                  Xem video
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Chưa có video.</p>
            )}
          </div>

          {/* Nút lưu */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLesson;
