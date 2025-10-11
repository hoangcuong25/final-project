"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

import banner from "@public/badminton-court.png";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Courts = () => {
  return (
    <div className="space-y-16 my-4">
      {/* Featured Courts */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">Sân nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((court, i) => (
            <motion.div
              key={court}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            >
              <Image
                src={banner}
                alt={`Court ${court}`}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Sân Cầu Lông {court}</h3>
                <p className="text-gray-500 text-sm">Quận Hoàn Kiếm, Hà Nội</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-green-600 font-bold">150.000đ/giờ</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    <Link href={`/court/${court}`}>Xem chi tiết</Link>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Courts;
