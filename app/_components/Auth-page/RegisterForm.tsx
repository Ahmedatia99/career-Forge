import { Mail, Lock } from "lucide-react";
import { FormInput } from "./FormInput";
import type { RegisterFormData } from "@/types/index";

export function RegisterForm({
  register,
  setRegister,
}: {
  register: RegisterFormData;
  setRegister: React.Dispatch<React.SetStateAction<RegisterFormData>>;
}) {
  return (
    <>
      <FormInput
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={register.email}
        onChange={(value) => setRegister((prev) => ({ ...prev, email: value }))}
      />

      <FormInput
        icon={Lock}
        type="password"
        placeholder="Password"
        value={register.password}
        onChange={(value) =>
          setRegister((prev) => ({ ...prev, password: value }))
        }
      />

      <FormInput
        icon={Lock}
        type="password"
        placeholder="Confirm password"
        value={register.confirmedPassword}
        onChange={(value) =>
          setRegister((prev) => ({ ...prev, confirmedPassword: value }))
        }
      />
    </>
  );
}
