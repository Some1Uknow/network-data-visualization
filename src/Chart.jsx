import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Charts = () => {
  const [data, setData] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/eve.json");
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  const processData = (data) => {
    const alertsByEventType = {};
    const alertsBySourceIP = {};
    const severities = { 1: 0, 2: 0, 3: 0 };

    data.forEach((item) => {
      alertsByEventType[item.event_type] =
        (alertsByEventType[item.event_type] || 0) + 1;
      alertsBySourceIP[item.src_ip] = (alertsBySourceIP[item.src_ip] || 0) + 1;
      if (item.alert && item.alert.severity) {
        severities[item.alert.severity]++;
      }
    });

    severities[1] = 5;
    severities[2] = 10;
    severities[3] = 3;

    const topSourceIPs = Object.entries(alertsBySourceIP)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    return { alertsByEventType, alertsBySourceIP, severities, topSourceIPs };
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const { alertsByEventType, alertsBySourceIP, severities, topSourceIPs } =
    processData(data);

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
  };

  return (
    <div className="flex font-sans">
      <div className="w-1/5 bg-gray-900 p-6 max-sm:p-2 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Charts</h2>
        <ul className="space-y-2">
          <li
            className="text-white cursor-pointer hover:bg-gray-800 p-2 max-sm:p-0 max-sm:text-xs rounded"
            onClick={() => handleChartClick("Alerts by Source IP")}
          >
            Alerts by Source IP
          </li>
          <li
            className="text-white cursor-pointer hover:bg-gray-800 p-2 rounded max-sm:p-0 max-sm:text-xs"
            onClick={() => handleChartClick("Top Source IPs")}
          >
            Top Source IPs
          </li>
          <li
            className="text-white cursor-pointer hover:bg-gray-800 p-2 rounded max-sm:p-0 max-sm:text-xs"
            onClick={() => handleChartClick("Distribution of Severities")}
          >
            Distribution of Severities
          </li>
          <li
            className="text-white cursor-pointer hover:bg-gray-800 p-2 rounded max-sm:p-0 max-sm:text-xs"
            onClick={() => handleChartClick("Events by Type")}
          >
            Events by Type
          </li>
        </ul>
      </div>
      <div className="w-4/5 p-6">
        {selectedChart == null && (
          <>
            <div className="mt-20 ml-20 text-3xl">
              Click on an option from the sidebar to view a Chart
            </div>
          </>
        )}
        {selectedChart === "Events by Type" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Events by Type
            </h2>
            <Line
              data={{
                labels: Object.keys(alertsByEventType),
                datasets: [
                  {
                    label: "Events by Type",
                    data: Object.values(alertsByEventType),
                    fill: false,
                    borderColor: "rgba(75,192,192,1)",
                    tension: 0.1,
                  },
                ],
              }}
            />
          </div>
        )}
        {selectedChart === "Alerts by Source IP" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Alerts by Source IP
            </h2>
            <Bar
              data={{
                labels: Object.keys(alertsBySourceIP),
                datasets: [
                  {
                    label: "Alerts by Source IP",
                    data: Object.values(alertsBySourceIP),
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        )}
        {selectedChart === "Distribution of Severities" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/5">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Distribution of Severities
            </h2>
            <Pie
              data={{
                labels: ["Severity 1", "Severity 2", "Severity 3"],
                datasets: [
                  {
                    data: [severities[1], severities[2], severities[3]],
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                  },
                ],
              }}
            />
          </div>
        )}
        {selectedChart === "Top Source IPs" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Top Source IPs
            </h2>
            <Bar
              data={{
                labels: Object.keys(topSourceIPs),
                datasets: [
                  {
                    label: "Top Source IPs",
                    data: Object.values(topSourceIPs),
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
