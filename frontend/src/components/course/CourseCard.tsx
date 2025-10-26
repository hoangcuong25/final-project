import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen } from "lucide-react";

interface Props {
  course: CourseType;
}

const CourseCard = ({ course }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <div className="relative w-full h-40 mb-3">
        <Image
          src={course.thumbnail || "/images/default-course.jpg"}
          alt={course.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <h3 className="font-semibold text-lg line-clamp-2 mb-1">
        {course.title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {course.description ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: course.description,
            }}
          />
        ) : (
          "Chưa có mô tả cho khóa học này."
        )}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-primary font-bold">{course.price}₫</p>
        <Button size="sm" variant="outline">
          <BookOpen className="w-4 h-4 mr-1" /> Xem chi tiết
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;
