import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { instance } from "../../api";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate } = useMutation({
    mutationFn: (data: any) => {
      return instance.post("/auth/login", data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <main className="h-screen w-full flex items-center justify-center">
      <Card className="w-[500px]">
        <CardBody>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <Input
              type="email"
              label="Email"
              {...register("email")}
              isInvalid={!!errors.email}
            />
            <Input
              type="password"
              label="Password"
              {...register("password")}
              isInvalid={!!errors.password}
            />
            <Button type="submit" color="primary">
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

export default Login;
