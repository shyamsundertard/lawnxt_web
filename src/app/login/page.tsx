"use client";
import Image from "next/image";
import Input from "@/app/ui/forms/Input";
import Button from "@/app/ui/forms/Button";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useAuthStore, useUserStore } from "@/store/useStore";
import Link from "next/link";
import { CircleCheckBig, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormDataTypes {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataTypes>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setIsAuthenticated } = useAuthStore();
  const { setUser } = useUserStore();

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
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Set user data
      setUser({
        $id: userCredential.user.uid,
        name: userCredential.user.displayName || '',
        email: userCredential.user.email || '',
      });
      
      // Set the session cookie
      document.cookie = `current_session=${userCredential.user.uid}; path=/; secure; samesite=strict`;
      
      setIsAuthenticated(true);
      setFormData({ email: "", password: "" });
      
      toast.success("Login successful", {
        icon: <CircleCheckBig/>
      });

      // Use Next.js router for navigation
      router.push('/');
      router.refresh(); // Refresh the page to update server components
    } catch (error: unknown) {
      console.error("Firebase Auth Error:", error);
      
      if (error instanceof FirebaseError) {
        // Handle specific Firebase Auth error codes
        switch (error.code) {
          case 'auth/invalid-email':
            toast.error("Invalid email address", {
              icon: <X/>
            });
            break;
          case 'auth/user-disabled':
            toast.error("This account has been disabled", {
              icon: <X/>
            });
            break;
          case 'auth/user-not-found':
            toast.error("No account found with this email", {
              icon: <X/>
            });
            break;
          case 'auth/wrong-password':
            toast.error("Incorrect password", {
              icon: <X/>
            });
            break;
          default:
            toast.error(error.message, {
              icon: <X/>
            });
        }
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