"use client";
import Image from "next/image";
import Input from "@/app/ui/forms/Input";
import Button from "@/app/ui/forms/Button";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { AppwriteException } from "appwrite";
import { account } from "@/app/lib/client/appwrite";
import {useAuthStore } from "@/store/useStore";
import Link from "next/link";
import { CircleCheckBig, X } from "lucide-react";
interface FormDataTypes {
  email: string;
  password: string;
}

const Login = () => {
  const [formData, setFormData] = useState<FormDataTypes>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setIsAuthenticated } = useAuthStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const session = await account.createEmailPasswordSession(
      formData.email,
      formData.password
      );


      document.cookie = `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}=${session.secret}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=lax`;

      document.cookie = `current_session=${session.userId}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24 * 7}`;

      await account.get();

      setIsAuthenticated(true);

      window.location.href = '/';
      toast.success("Login successful", {
        icon: <CircleCheckBig/>
      });
      setFormData({ email: "", password: "" });
      return session;
    } catch (error) {
      if (error instanceof AppwriteException) {
        toast.error(error.message, {
          icon: <X/>
        });
      } else {
        toast.error("Something went wrong", {
          icon: <X/>
        });
      }
      setFormData({ ...formData, password: "" });
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div
      className={`min-h-screen relative flex px-4 items-center justify-center text-gray-100 -mx-4 md:-mx-0`}
    >
      <Image
        src="/lawnxt.svg"
        width={1000}
        height={1000}
        priority={true}
        alt="Login"
        className="absolute h-full w-full md:hidden object-cover -mx-12 -z-20"
      />
      <div className="flex w-full flex-col md:flex-row md:bg-white bg-white/80  text-gray-800 rounded-lg border-2 overflow-hidden  lg:w-full xl:w-3/4">
        {/* Left Section */}
        <div className="flex-1">
          <Image
            src="/lawnxt.svg"
            alt="Login"
            className="hidden md:block h-full w-full object-cover -z-20"
            width={1000}
            height={1000}
            priority={true}
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 md:p-12 p-4 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center">Login</h2>
          <p className="text-center text-gray-500 mt-2">
            Please enter your credentials to continue.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 mt-8 w-full"
          >
            <Input
              name="email"
              placeholder="Email"
              isInvalid={!!errors.email}
              errorMessage={errors?.email}
              variant="outlined"
              value={formData.email}
              type="email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              placeholder="Password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              variant="outlined"
            />

            <div className="md:w-1/2 w-full mx-auto">
              <Button
                state={loading ? "loading" : "enabled"}
                type="submit"
                variant="contained"
                text="Login"
              />
            </div>
          </form>
          <div className='flex items-center justify-center gap-1 mt-2'>
            <h1 className='text-gray-500'>Don&apos;t have an account?</h1>
            <Link 
            href={"/register"}
            className='font-extrabold text-lg hover:text-xl transform duration-100'
            >Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;