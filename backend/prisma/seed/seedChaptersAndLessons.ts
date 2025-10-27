import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedChaptersAndLessons = async () => {
  console.log("🌱 Seeding Chapters & Lessons...");

  // Lấy tất cả các course hiện có
  const courses = await prisma.course.findMany();

  if (courses.length === 0) {
    console.warn("⚠️ Không có khóa học nào. Hãy seed course trước!");
    return;
  }

  for (const course of courses) {
    const numberOfChapters = Math.floor(Math.random() * 3) + 2; // 2–4 chương
    let totalCourseDuration = 0;

    for (let c = 1; c <= numberOfChapters; c++) {
      // tạo chapter
      const chapter = await prisma.chapter.create({
        data: {
          title: `Chương ${c}: Kiến thức nền tảng`,
          description: `Giới thiệu nội dung và mục tiêu của chương ${c} trong khóa học.`,
          orderIndex: c,
          courseId: course.id,
        },
      });

      const numberOfLessons = Math.floor(Math.random() * 4) + 3; // 3–6 bài/ chương
      let totalChapterDuration = 0;

      for (let l = 1; l <= numberOfLessons; l++) {
        const duration = Math.floor(Math.random() * 10) + 5; // 5–15 phút mỗi bài
        totalChapterDuration += duration;
        totalCourseDuration += duration;

        await prisma.lesson.create({
          data: {
            title: `Bài ${l}: Nội dung chi tiết`,
            content: `<p>Nội dung chi tiết của bài ${l} trong chương ${c}.</p>`,
            videoUrl: "https://res.cloudinary.com/dzfansbci/video/upload/v1760908597/lessons/aw27co0qcwuyipvukzgg.mp4",
            duration,
            orderIndex: l,
            courseId: course.id,
            chapterId: chapter.id,
          },
        });
      }

      // cập nhật duration của chương
      await prisma.chapter.update({
        where: { id: chapter.id },
        data: { duration: totalChapterDuration },
      });

      console.log(
        `✅ Tạo Chapter ${c} (${totalChapterDuration} phút) cho khóa: ${course.title}`
      );
    }

    // cập nhật duration của khóa học
    await prisma.course.update({
      where: { id: course.id },
      data: { duration: totalCourseDuration },
    });

    console.log(
      `🎓 Cập nhật tổng thời lượng: ${totalCourseDuration} phút cho khóa học "${course.title}"`
    );
  }

  console.log("🎉 Seed Chapters & Lessons thành công!");
};
