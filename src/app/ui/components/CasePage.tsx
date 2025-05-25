"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Button from "@/app/ui/forms/Button";
import Input from "@/app/ui/forms/Input";
import RadioButton from "../forms/RadioButton";
import dayjs from "dayjs";
import { ArrowLeft, CircleCheckBig, Download, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchDocuments } from "@/app/lib/database";
import { Query } from "appwrite";
import { useCaseStore, useFirmStore } from "@/store/useStore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Loader from "../Loader";
import axiosInstance from "@/app/lib/axiosInstance";
import { Case } from "@/app/types";
import toast from "react-hot-toast";

interface ApiResponse {
  message: string;
}

dayjs.extend(customParseFormat);

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];

const getExtensionColor = (extension: string) => {
  switch (extension) {
    case "pdf":
      return "text-red-600";
    case "doc":
    case "docx":
      return "text-blue-600";
    case "jpg":
    case "jpeg":
    case "png":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const CasePage = ({ caseId }: { caseId?: string }) => {

  const router = useRouter();
  const { currentFirm } = useFirmStore();

  const [formData, setFormData] = useState({
    caseTitle: "",
    caseType: "",
    caseFilingNumber: "",
    registrationNumber: "",
    petitionerName: "",
    petitionerAdvocateName: "",
    respondentName: "",
    respondentAdvocateName: "",
    cnrNumber: "",
    caseStage: "",
    courtNumberAndJudge: "",
    courtType: "",
    acts: "",
    firmId: currentFirm?.$id,
    paymentStatus: false,
    clientPhoneNumber: "",
    filingDate: "",
    registrationDate: "",
    firstHearingDate: "",
    prevHearingDate: "",
    nextHearingDate: "",
    decisionDate: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { cases } = useCaseStore();
  const [driveLoading, setDriveLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      const uploadedFiles = Array.from(files);
      const validFiles = uploadedFiles.filter(
        (file) =>
          file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 &&
          ACCEPTED_EXTENSIONS.includes(
            file.name.split(".").pop()?.toLowerCase() || ""
          )
      );
      if (validFiles.length !== uploadedFiles.length) {
        alert(
          `Some files were not uploaded. Ensure files are less than ${MAX_FILE_SIZE_MB} MB and of accepted types.`
        );
      }
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFormData({
        caseTitle: "",
        caseType: "",
        caseFilingNumber: "",
        registrationNumber: "",
        petitionerName: "",
        petitionerAdvocateName: "",
        respondentName: "",
        respondentAdvocateName: "",
        cnrNumber: "",
        caseStage: "",
        courtNumberAndJudge: "",
        courtType: "",
        acts: "",
        firmId: "",
        paymentStatus: false,
        clientPhoneNumber: "",
        filingDate: "",
        registrationDate: "",
        firstHearingDate: "",
        prevHearingDate: "",
        nextHearingDate: "",
        decisionDate: "",
    });
    setFiles([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.caseFilingNumber) newErrors.caseNumber = "Case Number is required.";
    if (!formData.caseTitle) newErrors.caseTitle = "Case Title is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      let response;
      if (caseId) {
        response = await axiosInstance.put<ApiResponse>(`/api/case/${caseId}`,formData)
      }
      else {
        response = await axiosInstance.post<ApiResponse>('/api/case',formData)
      }
      if (response.status === 201) {
        toast.success(response.data.message, {
          icon: <CircleCheckBig/> 
        });
      } else if (response.status === 200) {
        toast.success(response.data.message, {
          icon: <CircleCheckBig/> 
        });
      }
       else {
        toast.error(response.data.message);
      }
      setIsLoading(false);
      router.push("/cases");
    }
  };

  const fetchCase = () => {
    if (caseId) {
      const caseData =
        cases.length > 0 ? cases.find((c: Case) => c.$id === caseId) : null;
      if (caseData) {
        setFormData({
            caseTitle: caseData.caseTitle,
            caseType: caseData.caseType,
            caseFilingNumber: caseData.caseFilingNumber,
            registrationNumber: caseData.registrationNumber,
            petitionerName: caseData.petitionerName,
            petitionerAdvocateName: caseData.petitionerAdvocateName,
            respondentName: caseData.respondentName,
            respondentAdvocateName: caseData.respondentAdvocateName,
            cnrNumber: caseData.cnrNumber,
            caseStage: caseData.caseStage,
            courtNumberAndJudge: caseData.courtNumberAndJudge,
            courtType: caseData.courtType,
            acts: caseData.acts,
            firmId: caseData.firmId,
            paymentStatus: caseData.paymentStatus,
            clientPhoneNumber: caseData.clientPhoneNumber,
            filingDate: caseData.filingDate,
            registrationDate: caseData.registrationDate,
            firstHearingDate: caseData.firstHearingDate,
            prevHearingDate: caseData.prevHearingDate,
            nextHearingDate: caseData.nextHearingDate,
            decisionDate: caseData.decisionDate,
        });
      }
    }
  };

  const fetchDrive = async () => {
    const bucketId = process.env.NEXT_PUBLIC_CASE_BUCKET_ID as string;
    if (!bucketId) {
      console.error("NEXT_PUBLIC_CASE_BUCKET_ID is not set");
      return;
    }
    if (caseId) {
      try {
        setDriveLoading(true);
        const result = await fetchDocuments(bucketId, [
          Query.equal("caseId", caseId),
        ]);
        if (result.length > 0) {
          setFiles(result as unknown as File[]);
        } else {
          setFiles([]);
        }
      } finally {
        setDriveLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCase();
    fetchDrive();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, cases]);
  return (
    <div className="md:p-6 pt-20">
      <header className="flex items-center md:static fixed top-0 left-0 w-full md:h-auto h-[60px] z-[50] bg-white md:border-none border-b md:px-0 px-4 gap-4  mb-4">
        <ArrowLeft
          onClick={() => router.back()}
          className="cursor-pointer md:hidden"
        />
        <h1 className="md:text-3xl text-2xl  font-bold">New Case</h1>
      </header>
      <div className="flex md:flex-row flex-col justify-between gap-12 md:mt-16 mt-2">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2  w-full gap-4"
        >
        <Input
        label="Case Title"
        name="caseTitle"
        value={formData.caseTitle}
        onChange={handleInputChange}
        isInvalid={!!errors.caseTitle}
        />

        <Input
        label="Case Filing Number"
        name="caseFilingNumber"
        value={formData.caseFilingNumber}
        onChange={handleInputChange}
        isInvalid={!!errors.caseFilingNumber}
        />

        <Input
        label="Case Registration Number"
        name="registrationNumber"
        value={formData.registrationNumber}
        onChange={handleInputChange}
        isInvalid={!!errors.registrationNumber}
        />

        <Input
        label="Case Type"
        name="caseType"
        value={formData.caseType}
        onChange={handleInputChange}
        isInvalid={!!errors.caseType}
        />

        <Input
        label="Petitioner Name"
        name="petitionerName"
        value={formData.petitionerName}
        onChange={handleInputChange}
        isInvalid={!!errors.petitionerName}
        />

        <Input
        label="Petitioner Advocate Name"
        name="petitionerAdvocateName"
        value={formData.petitionerAdvocateName}
        onChange={handleInputChange}
        isInvalid={!!errors.petitionerAdvocateName}
        />

        <Input
        label="Respondent Name"
        name="respondentName"
        value={formData.respondentName}
        onChange={handleInputChange}
        isInvalid={!!errors.respondentName}
        />

        <Input
        label="Respondent Advocate Name"
        name="respondentAdvocateName"
        value={formData.respondentAdvocateName}
        onChange={handleInputChange}
        isInvalid={!!errors.respondentAdvocateName}
        />

        <Input
        label="Client Phone Number"
        name="clientPhoneNumber"
        value={formData.clientPhoneNumber}
        onChange={handleInputChange}
        isInvalid={!!errors.clientPhoneNumber}
        />

        <Input
        label="CNR Number"
        name="cnrNumber"
        value={formData.cnrNumber}
        onChange={handleInputChange}
        isInvalid={!!errors.cnrNumber}
        />

        <Input
        label="Court Name and Judge"
        name="courtNumberAndJudge"
        value={formData.courtNumberAndJudge}
        onChange={handleInputChange}
        isInvalid={!!errors.courtNumberAndJudge}
        />

        <Input
        label="Court Type"
        name="courtType"
        value={formData.courtType}
        onChange={handleInputChange}
        isInvalid={!!errors.courtType}
        />

        <Input
        label="Undersection"
        name="acts"
        value={formData.acts}
        onChange={handleInputChange}
        isInvalid={!!errors.acts}
        />

        {caseId && (
        <div className="md:col-span-2">
            <label className="text-sm font-semibold">
            Attach Files (Max: 10 MB, Accepted: PDF, DOC, DOCX, JPG, PNG
            etc)
            </label>
            <input
            type="file"
            multiple
            className="hidden"
            id="fileUpload"
            onChange={handleInputChange}
            />
            <div
            className="cursor-pointer p-4 border-dashed border-gray-400 border rounded-md"
            onClick={() => document.getElementById("fileUpload")?.click()}
            >
            Drag & drop files here, or click to upload
            </div>
            {driveLoading ? (
            <div className="md:col-span-2 my-6 flex-col inline-flex w-full items-center justify-center">
                <Loader />
                <span className="mt-2">Drive Loading...</span>
            </div>
            ) : files.length > 0 ? (
            <div className="mt-2">
                {files.map((file, index) => (
                <div
                    key={index}
                    className={`flex justify-between items-center p-2 border rounded-md my-1 ${getExtensionColor(
                    file.name.split(".").pop()?.toLowerCase() || ""
                    )}`}
                >
                    <div className="flex flex-col gap-2">
                    <p className="">{file.name}</p>
                    <span>
                        Size:{" "}
                        {file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                    </span>
                    </div>
                    <div className="flex gap-4">
                    <Download
                        className="cursor-pointer"
                        onClick={() =>
                        file.name.includes(".pdf") &&
                        window.open(URL.createObjectURL(file), "_blank")
                        }
                    />
                    <Trash2
                        className="cursor-pointer"
                        onClick={() => handleFileDelete(index)}
                    />
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="md:col-span-2 my-6 flex-col inline-flex w-full items-center justify-center">
                <span className="mt-2">No Drives Found</span>
            </div>
            )}
        </div>
        )}

        <div className="md:col-span-2 md:w-[200px] w-full flex flex-col gap-2">
        <Input
            type="date"
            label="Case Filing Date"
            name="filingDate"
            value={formData.filingDate}
            onChange={handleInputChange}
            isInvalid={!!errors.filingDate}
        />
        <Input
            type="date"
            label="Case Registration Date"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleInputChange}
            isInvalid={!!errors.registrationDate}
        />
        <Input
            type="date"
            label="First Hearing Date"
            name="firstHearingDate"
            value={formData.firstHearingDate}
            onChange={handleInputChange}
            isInvalid={!!errors.firstHearingDate}
        />
        <Input
            type="date"
            label="Next Hearing Date"
            name="nextHearingDate"
            value={formData.nextHearingDate}
            onChange={handleInputChange}
            isInvalid={!!errors.nextHearingDate}
        />
        <Input
            type="date"
            label="Previous Hearing Date"
            name="prevHearingDate"
            value={formData.prevHearingDate}
            onChange={handleInputChange}
            isInvalid={!!errors.prevHearingDate}
        />
        <Input
            type="date"
            label="Case Decision Date"
            name="decisionDate"
            value={formData.decisionDate}
            onChange={handleInputChange}
            isInvalid={!!errors.decisionDate}
        />
        </div>
        <div className="flex flex-col gap-2">
        <h2>Case Status</h2>
        <RadioButton
            label="Next Date"
            name="caseStage"
            value="NEXT_DATE"
            checked={formData.caseStage === "NEXT_DATE"}
            onChange={handleInputChange}
        />
        <RadioButton
            label="Judgement Done"
            name="caseStage"
            value="JUDGEMENT_DONE"
            checked={formData.caseStage === "JUDGEMENT_DONE"}
            onChange={handleInputChange}
        />
        <RadioButton
            label="Disposal"
            name="caseStage"
            value="DISPOSAL"
            checked={formData.caseStage === "DISPOSAL"}
            onChange={(handleInputChange)}
        />
        </div>
        <div className="flex flex-col gap-2">
        <h2>Payment Status</h2>
        <RadioButton
            label="Paid"
            name="paymentStatus"
            value="paid"
            checked={formData.paymentStatus}
            onChange={() =>
            setFormData((prev) => ({
                ...prev,
                paymentStatus: !prev.paymentStatus,
            }))
            }
        />
        <RadioButton
            label="Pending"
            name="paymentStatus"
            value="pending"
            checked={!formData.paymentStatus}
            onChange={() =>
            setFormData((prev) => ({
                ...prev,
                paymentStatus: !prev.paymentStatus,
            }))
            }
        />
        </div>
        <div className="flex border-t lg:border-none  items-center md:items-start md:justify-start justify-center fixed md:static bottom-0 left-0 w-full px-4 md:px-0 z-[99] bg-white h-[80px] md:h-auto gap-4 mt-4">
        <Button type="submit" variant="contained" text={caseId ? "Update Case" : "Add Case"} state={isLoading ? "loading" : "enabled"} />
        <Button
            type="reset"
            onClick={handleReset}
            variant="outlined"
            text="Reset"
        />
        </div>
    </form>
    {/* Preview */}
    <div className="hidden md:block w-[400px]">
        <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold ">Preview</h2>
        <Eye />
        </div>
        <div className="bg-gray-100 p-4 mt-4 rounded-md">
        <span className=" line-clamp-3">
            Case Number: {formData.caseFilingNumber}
        </span>
        <span className=" line-clamp-3">
            Case Title: {formData.caseTitle}
        </span>
        <span className=" line-clamp-3">Phone: {formData.clientPhoneNumber}</span>
        <span className=" line-clamp-3">
            CNR Number: {formData.cnrNumber}
        </span>
        <span className=" line-clamp-3">
            Undersection: {formData.acts}
        </span>
        {/* <span className=" line-clamp-3">Remarks: {formData.remarks}</span> */}
        <span className=" line-clamp-3">
            Start Date: {formData.firstHearingDate}
        </span>
        <span className=" line-clamp-3">
            Next Date: {formData.nextHearingDate}
        </span>
        <span className=" line-clamp-3">
            Previous Date: {formData.prevHearingDate}
        </span>
        <span className=" line-clamp-3">Status: {formData.caseStage}</span>
        <span className=" line-clamp-3">
            Payment Status: {formData.paymentStatus === true ? "Yes" : "No"}
        </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CasePage;