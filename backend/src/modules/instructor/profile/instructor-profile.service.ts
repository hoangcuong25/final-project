import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class InstructorProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }

    return profile;
  }

  async updateProfile(
    userId: number,
    data: { bio?: string; experience?: string }
  ) {
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }

    return await this.prisma.instructorProfile.update({
      where: { userId },
      data,
    });
  }

  async getProfileByInstructorId(id: number) {
    // This might be redundant if userId is the main identifier, but good for public view if needed
    const profile = await this.prisma.instructorProfile.findUnique({
      where: { userId: id }, // Assuming id passed is userId based on typical pattern, or adjust if it's profileId
    });
    if (!profile) {
      throw new NotFoundException("Instructor profile not found");
    }
    return profile;
  }
}
