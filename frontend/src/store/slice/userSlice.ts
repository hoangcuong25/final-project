import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUser, findAllStudentForAdmin } from "@/store/api/user.api";
import { LogoutApi } from "@/store/api/auth.api";
import { setLoggingOut } from "@/lib/axiosClient";
import axios from "axios";

// 🧠 Type cho user
interface UserState {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  students: {
    data: UserType[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  } | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  students: null,
};

// 🪄 Async action: Fetch user
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await getUser();
  return response;
});

// 🚪 Async action: Logout
export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  setLoggingOut(true); // 🧠 Ngăn interceptor refresh token
  localStorage.removeItem("access_token");
  delete axios.defaults.headers.common["Authorization"];
  try {
    await LogoutApi();
  } finally {
    setLoggingOut(false); // reset lại để tránh ảnh hưởng request khác
  }
});

// 👨‍🎓 Async action: Fetch all students (Admin)
export const fetchAllStudents = createAsyncThunk(
  "user/fetchAllStudents",
  async (params: any) => {
    const response = await findAllStudentForAdmin(params);
    return response;
  }
);

// 🧩 Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching user";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.students = null;
      })
      .addCase(fetchAllStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching students";
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
