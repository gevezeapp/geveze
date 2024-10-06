import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { instance } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Inputs = {
  email: string;
  name: string;
  password: string;
};

function Register() {
  const { initUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { mutate } = useMutation({
    mutationFn: (data: any) => {
      return instance.post("/auth/register", data);
    },
    onSuccess: (res) => {
      initUser(res.data.token);
      navigate("/");
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
              type="text"
              label="Name"
              {...register("name")}
              isInvalid={!!errors.name}
            />
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
              Register
            </Button>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

export default Register;
