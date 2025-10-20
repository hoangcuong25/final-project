"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteQuiz, fetchInstructorQuizzes } from "@/store/quizSlice";
import { fetchCoursesByInstructor } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import QuizForm from "@/components/quiz/CreateQuiz";

const Quizzes = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 🔹 Lấy danh sách quiz và khóa học của instructor
  const { instructorQuizzes, loading } = useSelector(
    (state: RootState) => state.quiz
  );
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );

  // 🔹 Load dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchInstructorQuizzes());
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  // 🗑️ Xóa quiz
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa quiz này không?")) return;
    try {
      await dispatch(deleteQuiz(id)).unwrap();
      toast.success("Đã xóa quiz thành công!");
    } catch (err) {
      toast.error("Xóa quiz thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🎓 Quản lý Quiz của bạn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các bài quiz cho khóa học bạn giảng dạy.
          </p>
        </div>

        {/* Nút mở form tạo quiz */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
              <PlusCircle className="w-5 h-5" /> Tạo Quiz Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full">
            <DialogTitle className="text-lg font-semibold mb-2">
              Tạo Quiz Mới
            </DialogTitle>
            <QuizForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách quiz */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-lg font-semibold">
            Danh sách Quiz ({instructorQuizzes.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {instructorQuizzes.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có quiz nào được tạo.
            </p>
          ) : (
            <div className="grid gap-4">
              {instructorQuizzes.map((quiz) => {
                const course = instructorCourses.find((c) =>
                  c.lessons?.some((l) => l.id === quiz.lessonId)
                );
                const lesson = instructorCourses
                  .flatMap((c) => c.lessons || [])
                  .find((l) => l.id === quiz.lessonId);

                return (
                  <div
                    key={quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:shadow-md bg-white transition-all group"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition">
                        Quiz: {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        🏫Khóa học {course?.title || "Không rõ khóa học"} • 📘{" "}
                        Bài học:
                        {lesson?.title || "Không rõ bài học"}
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="hover:scale-105 transition-transform"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quizzes;
