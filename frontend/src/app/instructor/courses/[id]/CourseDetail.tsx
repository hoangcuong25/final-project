"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Pencil, Trash2 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import CreateLesson from "@/components/instructor/courses/lessons/CreateLesson";
import UpdateLesson from "@/components/instructor/courses/lessons/UpdateLesson";
import DeleteLessonDialog from "@/components/instructor/courses/lessons/DeleteLessonDialog";

const CourseDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    if (id) dispatch(fetchCourseById(Number(id)));
  }, [dispatch, id]);

  if (loading || !currentCourse) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {currentCourse.title}
        </h1>
        <CreateLesson courseId={currentCourse.id} />
      </div>

      {/* Course info */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700">
          <p>
            <strong>Mô tả:</strong>{" "}
            {currentCourse.description || "Chưa có mô tả"}
          </p>
          <p>
            <strong>Giá:</strong> {currentCourse.price}₫
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {currentCourse.isPublished ? "Đã xuất bản" : "Bản nháp"}
          </p>
        </CardContent>
      </Card>

      {/* Lessons list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Danh sách bài học
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentCourse.lessons?.length ? (
            <div className="space-y-3">
              {currentCourse.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold">
                      {index + 1}. {lesson.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {lesson.content || "Không có nội dung"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <UpdateLesson lesson={lesson} />
                    <DeleteLessonDialog
                      lessonId={lesson.id}
                      lessonTitle={lesson.title}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Chưa có bài học nào cho khóa học này.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailPage;
