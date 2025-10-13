"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, Users, DollarSign } from "lucide-react";
import Image from "next/image";

const InstructorCoursesPage = () => {
  const [search, setSearch] = useState("");

  // fake data (sau này bạn fetch API thực)
  const courses = [
    {
      id: 1,
      title: "ReactJS Cơ bản đến Nâng cao",
      students: 128,
      revenue: 4500000,
      status: "published",
      image: "/courses/react.jpg",
    },
    {
      id: 2,
      title: "Lập trình Node.js cho Backend",
      students: 89,
      revenue: 3200000,
      status: "draft",
      image: "/courses/node.jpg",
    },
    {
      id: 3,
      title: "UI/UX Design với Figma",
      students: 62,
      revenue: 2100000,
      status: "published",
      image: "/courses/figma.jpg",
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Khóa học của bạn</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Button>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm khóa học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border-gray-300"
        />
      </div>

      {/* Course list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative h-40 w-full">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold truncate">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {course.students} học viên
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {course.revenue.toLocaleString()}₫
                </span>
              </div>

              <Badge
                variant={
                  course.status === "published" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
              </Badge>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" /> Sửa
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" /> Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InstructorCoursesPage;
