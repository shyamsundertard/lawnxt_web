"use client";
import { ArrowRight } from "lucide-react";
import Button from "./ui/forms/Button";
import { useRouter } from "next/navigation";

const Unauthorized = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-extrabold">404</h1>
            <p className="text-2xl mt-2">You&apos;re not authorized to access this page!</p>
            <div className="md:w-[200px] w-full mt-4">
                <Button
                onClick={() => router.back()}
                variant="contained"
                text="Back"
                state="enabled"
                icon={<ArrowRight/>}
                />
            </div>
        </div>
    );
};

export default Unauthorized;