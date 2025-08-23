import React from "react";
import ForecastCard from "./ForecastCard";

interface Props {
  data: any[];
}

const Forecast: React.FC<Props> = ({ data }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.map((item, index) => (
          <ForecastCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
