import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { loginSchema, type LoginFormData } from "@/schemas/login";
import { login } from "@/services/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const result = await login(
        data.email,
        data.password
      );

      console.log(result);

      localStorage.setItem(
        "access_token",
        result.access_token
      );

      localStorage.setItem(
        "refresh_token",
        result.refresh_token
      );

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Email</Label>

              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}