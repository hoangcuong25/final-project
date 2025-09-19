"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { SendEmailActiveApi } from "@/api/auth.api";

const VerifyAccount = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Xác thực tài khoản
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-gray-800 mb-2">
            Xác thực tài khoản
          </AlertDialogTitle>
          <p className="mb-4 text-gray-600">
            Vui lòng nhập mã OTP đã được gửi đến email của bạn để xác thực tài
            khoản. Mã OTP có hiệu lực trong 5 phút.
          </p>

          <div className="self-center">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button onClick={SendEmailActiveApi}>Gửi mã OTP</Button>
          <AlertDialogAction>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyAccount;
