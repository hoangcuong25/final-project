"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateQuestion } from "@/store/question.slice";
import { toast } from "sonner";

interface EditQuestionProps {
  question: any;
  onUpdated: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ question, onUpdated }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      questionText: question.questionText,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await dispatch(
        updateQuestion({ id: question.id, payload: data })
      ).unwrap();
      toast.success("Cập nhật câu hỏi thành công!");
      setOpen(false);
      onUpdated();
    } catch {
      toast.error("Cập nhật thất bại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Sửa
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Textarea
            {...register("questionText", { required: true })}
            rows={3}
            placeholder="Nhập nội dung câu hỏi..."
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={formState.isSubmitting}>
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestion;
