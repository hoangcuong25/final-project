"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { fetchQuizById } from "@/store/quizSlice";
import LoadingScreen from "@/components/LoadingScreen";
import { ArrowLeft, PlusCircle } from "lucide-react";
import CreateQuestion from "@/components/quiz/question/CreateQuestion";
import EditQuestion from "@/components/quiz/question/EditQuestion";
import { deleteQuestion } from "@/store/question.slice";
import { toast } from "sonner";

const QuizDetail = () => {
  const { quizId } = useParams();
  const id = Number(quizId);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuiz, loading } = useSelector(
    (state: RootState) => state.quiz
  );

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  if (loading || !currentQuiz) return <LoadingScreen />;

  const lesson = currentQuiz.lesson as LessonType & {
    course?: CourseType;
  };

  const course = lesson?.course as CourseType | undefined;

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await dispatch(deleteQuestion(questionId)).unwrap();
      toast.success("Xóa câu hỏi thành công!");
      dispatch(fetchQuizById(id));
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ─── HEADER ───────────────────────────── */}
      <div className="flex justify-between items-center">
        {/* 🔙 Nút Quay lại */}
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Button>

        <CreateQuestion quizId={id} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-800">
            🧩 {currentQuiz.title}
          </h1>
          <p className="text-gray-600">
            📘 <strong>Bài học:</strong> {lesson?.title || "Không rõ"}{" "}
            <span className="mx-2">•</span>
            🎓 <strong>Khóa học:</strong> {course?.title || "Không rõ"}{" "}
            <span className="mx-2">•</span>❓ <strong>Số câu hỏi:</strong>{" "}
            {currentQuiz.questions?.length || 0}
          </p>
        </div>
      </div>

      <Separator />

      {/* ─── QUESTIONS LIST ───────────────────────────── */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Danh sách câu hỏi
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentQuiz.questions?.map((q, index) => (
            <div
              key={q.id}
              className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Câu {index + 1}: {q.questionText}
                </h3>

                <div className="flex gap-2">
                  <EditQuestion
                    question={q}
                    onUpdated={() => dispatch(fetchQuizById(id))}
                  />

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Xóa
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Xác nhận xóa câu hỏi
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này
                          không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {q.options && q.options.length > 0 ? (
                <ul className="ml-5 list-disc text-gray-700 space-y-1">
                  {q.options.map((opt) => (
                    <li
                      key={opt.id}
                      className={`${
                        opt.isCorrect
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.text}
                      {opt.isCorrect && " ✅"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Chưa có lựa chọn cho câu hỏi này.
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizDetail;
