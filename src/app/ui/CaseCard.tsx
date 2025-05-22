import React from "react";
import clsx from "clsx";
import Link from "next/link";

interface CaseCardProps {
  clientName: string;
  caseNumber: string;
  phone: string;
  courtName: string;
  date?: string;
  id: string;
  variant?: "contained" | "outlined";
}

const CaseCard: React.FC<CaseCardProps> = ({
  clientName,
  caseNumber,
  phone,
  courtName,
  date,
  id,
  variant = "contained",
}) => {
  return (
    <Link href={`/case/${id}`}>
      <div
        className={clsx(
          "transition cursor-pointer rounded-md p-2 lg:w-[240px] md:w-[260px] border border-gray-500 w-full flex flex-col justify-between",
          {
            "bg-white/80 hover:bg-gray-200 text-black": variant === "outlined",
            "bg-black/80 hover:bg-black/80 text-white": variant === "contained",
          }
        )}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className=" truncate">{clientName}</p>
            <p>Case Number: {caseNumber}</p>
            <p>Phone: {phone}</p>
          </div>
        </div>
        <div className="mt-4 w-full flex justify-between">
          <p>{courtName}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
};

export default CaseCard;
