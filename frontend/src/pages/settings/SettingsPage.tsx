import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogOut, Settings as SettingsIcon } from "lucide-react";
import type { AxiosError } from "axios";

import { useAuth } from "@/hooks/useAuth";
import { useStorage } from "@/hooks/useStorage";
import { updateProfile, changePassword } from "@/services/user";
import { logoutAll } from "@/services/auth";
import type { MessageResponse } from "@/types/auth";
import { formatBytes } from "@/utils";

import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/schemas/updateProfile";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/schemas/changePassword";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { data: storage, isLoading: isStorageLoading } = useStorage();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const usagePercent = storage
    ? Math.min(100, Math.round(storage.usage_percent))
    : 0;

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: {
      errors: passwordErrors,
      isSubmitting: isPasswordSubmitting,
    },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onProfileSubmit(data: UpdateProfileFormData) {
    try {
      await updateProfile(data.name);
      await refreshUser();

      toast.add({
        title: "Profile updated",
        description: "Your name has been updated.",
        type: "success",
      });
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Update failed",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not update your profile.",
        type: "error",
      });
    }
  }

  async function onPasswordSubmit(data: ChangePasswordFormData) {
    try {
      await changePassword(data.currentPassword, data.newPassword);

      toast.add({
        title: "Password updated",
        description: "Please log in again with your new password.",
        type: "success",
      });

      resetPasswordForm();

      await logout();
      navigate("/login");
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Could not change password",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Please check your current password and try again.",
        type: "error",
      });
    }
  }

  async function handleLogoutAllDevices() {
    setIsLoggingOutAll(true);

    try {
      await logoutAll();

      toast.add({
        title: "Signed out everywhere",
        description: "All your active sessions have been logged out.",
        type: "success",
      });

      await logout();
      navigate("/login");
    } catch (err) {
      const axiosErr = err as AxiosError<MessageResponse>;

      toast.add({
        title: "Something went wrong",
        description:
          axiosErr.response?.data?.detail ??
          axiosErr.response?.data?.message ??
          "Could not log out of all devices.",
        type: "error",
      });
    } finally {
      setIsLoggingOutAll(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="text-4xl font-bold text-cyan-400">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your display name. Your email can&apos;t be changed.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Full name</Label>

                <Input
                  type="text"
                  {...registerProfile("name")}
                />

                {profileErrors.name && (
                  <p className="text-sm text-red-500">
                    {profileErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>

                <Input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="opacity-60"
                />
              </div>

              <Button type="submit" disabled={isProfileSubmitting}>
                {isProfileSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>
              How much of your ClassHub storage you&apos;ve used.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${usagePercent}%` }}
              />
            </div>

            <p className="mt-2 text-sm text-slate-400">
              {isStorageLoading || !storage
                ? "Loading storage..."
                : `${formatBytes(storage.used)} of ${formatBytes(
                    storage.quota
                  )} used (${usagePercent}%)`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              You&apos;ll be logged out on all devices after changing your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Current password</Label>

                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-9"
                    {...registerPassword("currentPassword")}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-200"
                    tabIndex={-1}
                    aria-label={
                      showCurrentPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>New password</Label>

                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-9"
                    {...registerPassword("newPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-200"
                    tabIndex={-1}
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirm new password</Label>

                <Input
                  type="password"
                  autoComplete="new-password"
                  {...registerPassword("confirmPassword")}
                />

                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isPasswordSubmitting}>
                {isPasswordSubmitting
                  ? "Updating..."
                  : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Sign out of ClassHub on every device where you&apos;re
              currently logged in.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogoutAllDevices}
              disabled={isLoggingOutAll}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOutAll
                ? "Logging out everywhere..."
                : "Log out of all devices"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
