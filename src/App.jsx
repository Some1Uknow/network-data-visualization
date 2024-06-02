import React from "react";
import Charts from "./Chart";

const App = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center">
          Network Alert Visualization Dashboard
        </h1>
      </header>
      <div className="container mx-auto">
        <Charts />
      </div>
    </div>
  );
};

export default App;
