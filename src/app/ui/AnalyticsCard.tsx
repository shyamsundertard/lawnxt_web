interface AnalyticsCardProps {
    label: string;
    number?: number;
    component?: React.ReactNode;
  }
  
  const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
    label, 
    number,
    component 
  }) => {
    return (
      <div className="bg-white border border-black/50 rounded md:p-4 p-2">
        <h2 className="md:text-lg text-sm font-bold text-center">{label}</h2>
        {component ? (
          component
        ) : (
          <p className="text-2xl mt-2 text-center">{number}</p>
        )}
      </div>
    );
  };
  
  export default AnalyticsCard;