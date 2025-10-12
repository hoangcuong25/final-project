import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  applyInstructorApi,
  getAllInstructorApplicationsApi,
  getInstructorApplicationByUserIdApi,
  approveInstructorApi,
  rejectInstructorApi,
  ApplyInstructorPayload,
} from "@/api/instructor.api";

// 🧱 State
interface InstructorState {
  applications: InstructorApplicationType[];
  currentApplication: InstructorApplicationType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InstructorState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 📨 Gửi đơn đăng ký giảng viên
export const applyInstructor = createAsyncThunk(
  "instructor/applyInstructor",
  async (data: { userId: number; payload: ApplyInstructorPayload }) => {
    const response = await applyInstructorApi(data.userId, data.payload);
    return response;
  }
);

// 🧾 Lấy danh sách đơn (admin)
export const fetchAllApplications = createAsyncThunk(
  "instructor/fetchAllApplications",
  async () => {
    const response = await getAllInstructorApplicationsApi();
    return response;
  }
);

// 🔍 Lấy chi tiết đơn theo ID
export const fetchApplicationById = createAsyncThunk(
  "instructor/fetchApplicationById",
  async (id: number) => {
    const response = await getInstructorApplicationByUserIdApi(id);
    return response;
  }
);

// ✅ Duyệt đơn giảng viên (Admin)
export const approveInstructor = createAsyncThunk(
  "instructor/approveInstructor",
  async (userId: number) => {
    const response = await approveInstructorApi(userId);
    return response;
  }
);

// ❌ Từ chối đơn giảng viên (Admin)
export const rejectInstructor = createAsyncThunk(
  "instructor/rejectInstructor",
  async (applicationId: number) => {
    const response = await rejectInstructorApi(applicationId);
    return response;
  }
);

// 🧩 Slice
const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    clearInstructorState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply instructor
      .addCase(applyInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Gửi đơn thành công!";
      })
      .addCase(applyInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi gửi đơn giảng viên";
      })

      // Fetch all applications
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi lấy danh sách đơn";
      })

      // Fetch single application
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể lấy chi tiết đơn";
      })

      // Approve
      .addCase(approveInstructor.fulfilled, (state, action) => {
        state.successMessage =
          action.payload.message ?? "Đã duyệt đơn thành công";
      })
      .addCase(approveInstructor.rejected, (state, action) => {
        state.error = action.error.message ?? "Lỗi khi duyệt đơn";
      })

      // Reject
      .addCase(rejectInstructor.fulfilled, (state, action) => {
        state.successMessage = action.payload.message ?? "Đã từ chối đơn";
      })
      .addCase(rejectInstructor.rejected, (state, action) => {
        state.error = action.error.message ?? "Lỗi khi từ chối đơn";
      });
  },
});

export const { clearInstructorState } = instructorSlice.actions;
export default instructorSlice.reducer;
