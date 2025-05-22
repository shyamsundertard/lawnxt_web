import CasePage from "@/app/ui/components/CasePage";

const Case = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return <CasePage caseId={params.id} />;
};
export default Case;
