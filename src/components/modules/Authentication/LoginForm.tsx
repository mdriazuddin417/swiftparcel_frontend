import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { Package } from "lucide-react";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    //! For development only
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [login] = useLoginMutation();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      const res = await login(data).unwrap();

      if (res.success) {
        toast.success("Logged in successfully");
        navigate("/");
      }
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        if (err.message === "Password does not match") {
          toast.error("Invalid credentials");
        }
      }
      interface CustomError {
        data?: {
          message?: string;
        };
      }

      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as CustomError).data === "object" &&
        (err as CustomError).data !== null &&
        "message" in (err as CustomError).data! &&
        (err as CustomError).data!.message === "User is not verified"
      ) {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <div className="flex items-center justify-center space-x-2 mb-8">
          <Package className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl text-foreground">
            SwiftParcel
          </span>
        </div>
      <div className="flex-1 flex items-center justify-center  px-4 sm:px-6 lg:px-8">
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your SwiftParcel account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Demo accounts:
              </p>
              <div className="space-y-1 text-xs">
                <div>Admin: admin@swiftparcel.com / Password123@</div>
                <div>Sender: sender@swiftparcel.com / Password123@</div>
                <div>Receiver: receiver@swiftparcel.com / Password123@</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
