"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

interface LessonType {
  id: number;
  title: string;
  videoUrl?: string;
  content?: string;
}

interface CourseData {
  id: number;
  title: string;
  lessons: LessonType[];
}

const LessonDetail = () => {
  const router = useRouter();
  const { id } = useParams(); // courseId
  // 🔹 Giả lập data — sau này bạn fetch từ API
  const course: CourseData = {
    id: Number(id),
    title: "Khóa học ReactJS cho người mới bắt đầu",
    lessons: [
      {
        id: 1,
        title: "Giới thiệu về ReactJS",
        videoUrl:
          "https://res.cloudinary.com/demo/video/upload/w_800/sample.mp4",
        content:
          "Trong bài này, bạn sẽ tìm hiểu về React, Virtual DOM và cách nó hoạt động.",
      },
      {
        id: 2,
        title: "Cấu trúc dự án React",
        videoUrl:
          "https://res.cloudinary.com/demo/video/upload/w_800/sample.mp4",
        content:
          "Bài học này hướng dẫn cách tạo dự án React và cấu trúc folder hợp lý.",
      },
      {
        id: 3,
        title: "Component và Props",
        videoUrl:
          "https://res.cloudinary.com/demo/video/upload/w_800/sample.mp4",
        content:
          "Hiểu rõ cách xây dựng component, truyền props và tái sử dụng code.",
      },
    ],
  };

  const [currentLesson, setCurrentLesson] = useState<LessonType>(
    course.lessons[0]
  );

  const currentIndex = course.lessons.findIndex(
    (l) => l.id === currentLesson.id
  );

  const handleNext = () => {
    if (currentIndex < course.lessons.length - 1) {
      setCurrentLesson(course.lessons[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentLesson(course.lessons[currentIndex - 1]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              <span>Quay lại khóa học</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Video player */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md">
              {currentLesson.videoUrl ? (
                <video
                  src={currentLesson.videoUrl}
                  controls
                  preload="metadata"
                  className="w-full h-full object-contain"
                  poster={
                    currentLesson.videoUrl
                      ?.replace("/upload/", "/upload/so_auto,q_auto,w_600/")
                      .replace(".mp4", ".jpg") || undefined
                  }
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <PlayCircle className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentLesson.title}
              </h2>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {currentLesson.content ||
                  "Bài học này hiện chưa có mô tả chi tiết."}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                <span>Bài trước</span>
              </Button>

              <Button
                variant="default"
                onClick={handleNext}
                disabled={currentIndex === course.lessons.length - 1}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <span>Bài tiếp theo</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetail;
