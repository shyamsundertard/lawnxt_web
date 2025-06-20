"use client";

import React, { FormEvent, useState } from 'react'
import Image from 'next/image';
import Input from '../ui/forms/Input';
import { useRouter } from 'next/navigation';
import Button from '../ui/forms/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { CircleCheckBig, X } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/app/lib/firebase";

interface DataTypes {
    email: string;
    name: string;
    password: string;
}

const Register = () => {
    const [formData, setFormData] = useState<DataTypes>({
        email: "",
        name: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (formData.password != confirmPassword) {
            toast.error("Passwords are not matching!", {
                icon: <X/>
              })
            return;
        }
        try {
            console.log("formData: ", formData);
            setLoading(true);

            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await updateProfile(auth.currentUser!, {
                displayName: formData.name
            });

            router.push("/login");
            toast.success("Registration successfull", {
                icon: <CircleCheckBig/>
              });
        } catch (error: unknown) {
            console.error("Firebase Auth Error:", error);
            
            if (error instanceof FirebaseError) {
                // Handle specific Firebase Auth error codes
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        toast.error("This email is already registered", {
                            icon: <X/>
                        });
                        break;
                    case 'auth/invalid-email':
                        toast.error("Invalid email address", {
                            icon: <X/>
                        });
                        break;
                    case 'auth/operation-not-allowed':
                        toast.error("Email/password accounts are not enabled", {
                            icon: <X/>
                        });
                        break;
                    case 'auth/weak-password':
                        toast.error("Password is too weak", {
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
            setFormData({ ...formData, password: ""});
            setConfirmPassword("");
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <div
      className={`min-h-screen relative flex px-4 items-center justify-center text-gray-100 -mx-4 md:-mx-0`}
    >
      <div className="flex w-full flex-col md:flex-row md:bg-white bg-white/80  text-gray-800 rounded-lg border-2 overflow-hidden  lg:w-full xl:w-3/4">
        {/* Left Section */}
        <div className="flex-1">
          <Image
            src="/lawnxt.svg"
            alt="Register"
            className="hidden md:block h-full w-full object-cover -z-20"
            width={1000}
            height={1000}
            priority={true}
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 md:p-12 p-4 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold text-center">Register</h2>
          <p className="text-center text-gray-500 mt-2">
            Please enter your credentials to register.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 mt-8 w-full"
          >
            <Input
              name="email"
              placeholder="Enter Email"
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
              name="name"
              placeholder="Enter Name"
              isInvalid={!!errors.name}
              errorMessage={errors?.name}
              variant="outlined"
              value={formData.name}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
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
            <Input
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              variant="outlined"
            />

            <div className="md:w-1/2 w-full mx-auto">
              <Button
                state={loading ? "loading" : "enabled"}
                type="submit"
                variant="contained"
                text="Register"
              />
            </div>
          </form>
          <div className='flex items-center justify-center gap-1 mt-2'>
            <h1 className='text-gray-500'>Have an account?</h1>
            <Link 
            href={"/login"}
            className='font-extrabold text-lg hover:text-xl transform duration-100'
            >Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register