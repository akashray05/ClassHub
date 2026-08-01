import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-3xl">
          Login
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5">

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@iitb.ac.in"
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
            />
          </div>

          <Button className="w-full">
            Login
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}