"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell } from "recharts";
import dayjs from "dayjs";
import { useFirmStore, useCaseStore, useUserStore } from "@/store/useStore";
import CaseCard from "@/app/ui/CaseCard";
import AnalyticsCard from "@/app/ui/AnalyticsCard";
import { Button } from "@/components/ui/button";

const colors = ["#8884d8", "#83a6ed", "#8dd1e1"];

const DashboardHomepage = () => {
  const router = useRouter();
  const { cases } = useCaseStore();
  const { user } = useUserStore();
  const { currentFirm, subscriptionStatus, firmMembers } = useFirmStore();

    // Today's Cases
    const todayCases = useMemo(() => {
      if (cases.length > 0) {
        return cases.filter(
          (item) =>
            item.nextHearingDate ===
            dayjs().format("YYYY-MM-DD")
        );
      } else {
        return [];
      }
    }, [cases]);
  
    // Tomorrow's Cases
    const tomorrowCases = useMemo(() => {
      if (cases.length > 0) {
        return cases.filter(
          (item) =>
            item.nextHearingDate ===
            dayjs()
              .add(1, "day")
              .format("YYYY-MM-DD")
        );
      } else {
        return [];
      }
    }, [cases]);

  // Analytics data
  const analyticsData = useMemo(() => {
    return [
      {
        label: "Total Cases",
        number: cases.length,
      },
      {
        label: "Today's Cases",
        number: todayCases.length,
      },
      {
        label: "Tomorrow's Cases",
        number: tomorrowCases.length,
      },
      {
        label: "Total Members",
        number: firmMembers.filter(doc => { return doc.status === 'Approved'}).length,
      },
    ];
  }, [cases, todayCases, tomorrowCases, firmMembers]);

  // Pie chart data
  const pieChartData = useMemo(() => {
    return cases.length > 0
      ? [
          {
            name: "Today's Cases",
            value: todayCases.length,
          },
          {
            name: "Tomorrow's Cases",
            value: tomorrowCases.length,
          },
          {
            name: "Total Cases",
            value: cases.length,
          },
        ]
      : [];
  }, [todayCases, tomorrowCases, cases]);

  const handleAddCase = async () => {
    if (!currentFirm?.$id) return;
    
    if (subscriptionStatus && !subscriptionStatus.active) {
      alert("Your subscription is inactive. Please upgrade to add more cases.");
      return;
    }

    router.push("/case");
  };

  return (
    <div className="md:pt-4 pt-2">
      {/* Welcome Header */}
      <header className="flex justify-between items-center mb-6 border-b-2 rounded-md">
        <div>
        {currentFirm && (
              <span className="lg:text-3xl text-2xl font-extrabold">
                {currentFirm.name}
              </span>
            )}
          <h1 className="lg:text-2xl text-xl font-medium">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-500">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="block w-16 md:w-28">
          <Button
            onClick={handleAddCase}
            variant='default'
            disabled={!subscriptionStatus?.active ? true : false}
          >
            Add Case
          </Button>
        </div>
      </header>

      {/* Analytics Cards */}
      <section className="grid md:grid-cols-4 grid-cols-2 gap-4">
        {analyticsData.map((item, i) => (
          <div key={i}>
              <AnalyticsCard label={item.label} number={item.number} />
          </div>
        ))}
      </section>

      <div className="lg:grid lg:grid-cols-3 flex flex-col-reverse lg:gap-0 gap-8 mt-8">
        {/* Cases Section */}
        <div className="col-span-2">
          <div className="w-full">
            <h1 className="text-xl font-bold">Today&apos;s Cases</h1>
            {todayCases.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-2">
                {todayCases.map((item) => (
                  <CaseCard
                    key={item.$id}
                    id={item.$id}
                    caseNumber={item.caseFilingNumber}
                    courtName={item.courtNumberAndJudge}
                    clientName={item.respondentName}
                    phone={item.clientPhoneNumber}
                    date={item.nextHearingDate}
                    variant="contained"
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400">No Cases Today</p>
              </div>
            )}
          </div>
          
          <div className="w-full mt-8">
            <h1 className="text-xl font-bold">Tomorrow&apos;s Cases</h1>
            {tomorrowCases.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-2">
                {tomorrowCases.map((item) => (
                  <CaseCard
                    key={item.$id}
                    id={item.$id}
                    caseNumber={item.caseFilingNumber}
                    courtName={item.courtNumberAndJudge}
                    clientName={item.respondentName}
                    phone={item.clientPhoneNumber}
                    date={item.nextHearingDate}
                    variant="outlined"
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-gray-400">No Cases For Tomorrow</p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="">
          <h1 className="text-xl font-bold">Analytics Overview</h1>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="bg-gray-100 p-2 rounded-md">
              {pieChartData.length > 0 ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <div className="flex justify-center items-center h-[300px] w-[400px]">
                  <p className="text-gray-400">No Data</p>
                </div>
              )}
              
              {/* Legend */}
              <div className="mt-4 flex justify-center gap-6">
                {pieChartData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col text-center items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-md font-medium">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default DashboardHomepage;