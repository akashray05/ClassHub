import { Button } from "@/components/ui/button";
import { login } from "@/services/auth";

export default function LoginPage() {

  async function testLogin() {
    try {
      const result = await login(
        "test@test.com",
        "12345678"
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Button onClick={testLogin}>
      Test Login
    </Button>
  );
}