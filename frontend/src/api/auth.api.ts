import axiosClient from "@/lib/axiosClient";

export type RegisterPayload = {
  fullname: string;
  email: string;
  password1: string;
  password2: string;
};

export const RegisterApi = async (payload: RegisterPayload) => {
  try {
    if (payload.password1 !== payload.password2) {
      throw new Error("Mật khẩu không khớp");
    }

    const response = await axiosClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const LoginApi = async (payload: LoginPayload) => {
  try {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// type LoginWithGooglePayload = {
//     Fullname: string;
//     email: string;
//     avatar: string
// }

// export const LoginWithGoogle = async (payload: LoginWithGoolePayload) => {
//     try {
//         const response = await axiosClient.post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/auth/login-google", payload)
//         return response.data.data
//     } catch (error) {
//         throw error;
//     }
// }

// export const LogoutApi = async () => {
//     try {
//         await axiosClient.post('/api/v1/auth/logout')

//     } catch (error) {
//         throw error;
//     }
// }
