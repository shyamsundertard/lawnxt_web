"use client";
import CaseCard from "@/app/ui/CaseCard";
import Button from "@/app/ui/forms/Button";
import Input from "@/app/ui/forms/Input";
import Select from "@/app/ui/forms/Select";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCaseStore, useFirmStore } from "@/store/useStore";
import { Case } from "@/app/types";

dayjs.extend(customParseFormat);

const caseStatus = [
  { value: "NEXT_DATE", label: "Next Date" },
  { value: "NO_ACTION", label: "No Action" },
  { value: "JUDGEMENT_DONE", label: "Judgement Done" },
];

const paymentStatus = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const Cases = () => {
  const { cases, setCases } = useCaseStore();
  const { currentFirm } = useFirmStore();
  const [filterData, setFilterData] = useState({
    clientName: "",
    status: "",
    paymentStatus: "",
    startDate: "",
  });
  const [page, setPage] = useState(1); // Current page
  const pageSize = 10; // Items per page

  // Filter cases based on filters
  const filteredCases = useMemo(() => {
    if (
      !filterData.clientName &&
      !filterData.status &&
      !filterData.paymentStatus &&
      !filterData.startDate
    ) {
      return cases; // Return all cases if no filters
    }

    return cases.filter((caseItem) => {
      const matchesClientName =
        !filterData.clientName ||
        caseItem.petitionerName
          .toLowerCase()
          .includes(filterData.clientName.toLowerCase());

      const matchesStatus =
        !filterData.status || caseItem.caseStage === filterData.status;

      const matchesPaymentStatus =
        !filterData.paymentStatus ||
        caseItem.paymentStatus === (filterData.paymentStatus === "yes");

      const matchesStartDate =
        !filterData.startDate ||
        (caseItem.filingDate &&
          dayjs(caseItem.filingDate, "YYYY-MM-DD").format("YYYY-MM-DD") ===
            filterData.startDate);

      return (
        matchesClientName &&
        matchesStatus &&
        matchesPaymentStatus &&
        matchesStartDate
      );
    });
  }, [cases, filterData]);

  // Paginate filtered cases
  const paginatedCases = filteredCases.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const clearFilters = () => {
    setFilterData({
      clientName: "",
      status: "",
      paymentStatus: "",
      startDate: "",
    });
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchCases = async () => {
      const response = await fetch('/api/case');
      const allCases = await response.json() as Case[];
      const filteredCases = allCases.filter(doc => {
        return doc.firmId === currentFirm?.$id;
      });
      setCases(filteredCases);
    };
    fetchCases();
  }, [currentFirm?.$id, setCases]);

  return (
    <div className="md:pt-8 pt-4">
      <div>
        <h1 className="text-3xl font-bold">Cases</h1>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mt-4 gap-4">
          <Input
            label="Client Name"
            placeholder="Search By Client Name"
            name="clientName"
            value={filterData.clientName}
            onChange={(e) =>
              setFilterData({ ...filterData, clientName: e.target.value })
            }
          />
          <Select
            options={caseStatus}
            label="Status"
            placeholder="Status"
            onChange={(e) =>
              setFilterData({ ...filterData, status: e.target.value })
            }
          />
          <Select
            options={paymentStatus}
            name="paymentStatus"
            label="Payment Status"
            placeholder="Payment Status"
            onChange={(e) =>
              setFilterData({ ...filterData, paymentStatus: e.target.value })
            }
          />
          <Input
            type="date"
            label="Start Date"
            onChange={(e) =>
              setFilterData({ ...filterData, startDate: e.target.value })
            }
            value={filterData.startDate}
          />
        </div>
        <div className="mt-4">
          <div className="w-fit">
            <Button text="Clear Filters" onClick={clearFilters} />
          </div>
        </div>
      </div>
      <hr className="mt-4" />
      <div className="mt-4">
        <h1 className="md:text-3xl text-xl font-bold">
          Results: <span>{filteredCases.length}</span>
        </h1>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mt-4">
          {paginatedCases.map((caseItem) => (
            <div key={caseItem.$id}>
              <CaseCard
                id={caseItem.$id}
                caseNumber={caseItem.caseFilingNumber}
                courtName={caseItem.courtNumberAndJudge}
                clientName={caseItem.petitionerName}
                phone={caseItem.clientPhoneNumber}
                date={caseItem.nextHearingDate}
                variant="contained"
              />
            </div>
          ))}
          {paginatedCases.length === 0 && <p>No cases found.</p>}
        </div>
        <div className="mt-4">
          <Stack spacing={2} className="flex justify-center">
            <Pagination
              count={Math.ceil(filteredCases.length / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{
                backgroundColor: "white",
                color: "black",
                "& .MuiPaginationItem-root": {
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "50%",
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
            />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Cases;
