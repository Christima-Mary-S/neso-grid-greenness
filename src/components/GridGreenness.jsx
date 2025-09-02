import { useState, useEffect } from "react";
import { sampleGridData } from "../data/sampleData";
import {
  calculateGridMetrics,
  determineGridStatus,
  getGridMessage,
  getStatusColors,
  getEnergyRecommendations,
} from "../utils/gridCalculations";

function GridGreenness() {
  const [gridData, setGridData] = useState(sampleGridData);
  const [metrics, setMetrics] = useState(null);
  const [status, setStatus] = useState("moderate");
  const [message, setMessage] = useState(null);
  const [colors, setColors] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (gridData?.data) {
      const calculatedMetrics = calculateGridMetrics(gridData.data);
      const gridStatus = determineGridStatus(
        calculatedMetrics.greenPercentage,
        calculatedMetrics.fossilPercentage
      );
      const gridMessage = getGridMessage(gridStatus, calculatedMetrics);
      const statusColors = getStatusColors(gridStatus);
      const energyRecommendations = getEnergyRecommendations(
        calculatedMetrics,
        gridStatus
      );

      setMetrics(calculatedMetrics);
      setStatus(gridStatus);
      setMessage(gridMessage);
      setColors(statusColors);
      setRecommendations(energyRecommendations);

      // // Debug logging
      // console.log("Grid Status:", gridStatus);
      // console.log("Message Action:", gridMessage.action);
      // console.log("Recommendations:", energyRecommendations);
    }
  }, [gridData]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Loading state
  if (!metrics || !message || !colors) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="glass-card rounded-3xl p-8 text-center pulse-modern">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 animate-spin flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/30"></div>
          </div>
          <div className="text-slate-200 font-medium">Loading grid data...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

          <div className="text-center mb-8 relative z-10">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 status-${status} rounded-3xl text-white text-3xl mb-4 shadow-2xl`}
            >
              {message.icon}
            </div>

            <h2 className="text-4xl font-bold text-slate-100 mb-2 capitalize">
              {status}
            </h2>

            <div className="text-slate-300 text-sm font-medium">
              {new Date(gridData.startTime).toLocaleString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Green Energy Card */}
            <div className="metric-card rounded-2xl p-6 text-center group">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                {metrics.greenPercentage}%
              </div>
              <div className="text-gray-700 font-semibold mb-1">
                Renewable Energy
              </div>
              <div className="text-gray-500 text-sm">
                {metrics.greenGeneration.toLocaleString()} MW
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: `${metrics.greenPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Fossil Fuels Card */}
            <div className="metric-card rounded-2xl p-6 text-center group">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-2">
                {metrics.fossilPercentage}%
              </div>
              <div className="text-gray-700 font-semibold mb-1">
                Fossil Fuels
              </div>
              <div className="text-gray-500 text-sm">
                {metrics.fossilGeneration.toLocaleString()} MW
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-1000 ease-out"
                  style={{ width: `${metrics.fossilPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Total Generation Card */}
            <div className="metric-card rounded-2xl p-6 text-center group">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                {Math.round(metrics.totalGeneration / 1000)}
              </div>
              <div className="text-gray-700 font-semibold mb-1">Total (GW)</div>
              <div className="text-gray-500 text-sm">
                {metrics.totalGeneration.toLocaleString()} MW
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>
          </div>

          {/* User Message */}
          <div className="glass-card rounded-2xl p-6 mb-6 border border-white/20">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{message.icon}</div>
              <div className="flex-1">
                <div className="text-slate-100 font-medium leading-relaxed">
                  {message.text}
                </div>
                {message.action === "encourage" &&
                  recommendations.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendations
                        .filter(
                          (rec) =>
                            rec.priority === "high" || rec.priority === "medium"
                        )
                        .slice(0, 3)
                        .map((rec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-xs font-medium"
                          >
                            {rec.icon} {rec.text}
                          </span>
                        ))}
                    </div>
                  )}
                {message.action === "neutral" && recommendations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendations
                      .filter(
                        (rec) =>
                          rec.priority === "high" || rec.priority === "medium"
                      )
                      .slice(0, 3)
                      .map((rec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium"
                        >
                          {rec.icon} {rec.text}
                        </span>
                      ))}
                  </div>
                )}
                {message.action === "reduce" && recommendations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendations
                      .filter((rec) => rec.priority === "high")
                      .slice(0, 3)
                      .map((rec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-500/20 text-red-200 rounded-full text-xs font-medium"
                        >
                          {rec.icon} {rec.text}
                        </span>
                      ))}
                  </div>
                )}
                {message.action === "consider" &&
                  recommendations.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendations
                        .filter(
                          (rec) =>
                            rec.priority === "high" || rec.priority === "medium"
                        )
                        .slice(0, 2)
                        .map((rec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-xs font-medium"
                          >
                            {rec.icon} {rec.text}
                          </span>
                        ))}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Settlement Period Info */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-4 text-slate-300 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Settlement Period {gridData.settlementPeriod}</span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <span>Grid Status Live</span>
            </div>
          </div>

          {/* Modal Button */}
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="btn-modern relative"
            >
              📊 View Fuel Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative glass-card rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-lg font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">
                    Fuel Type Breakdown
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Detailed generation by energy source
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Fuel Type Grid */}
            <div className="grid gap-3 mb-6">
              {gridData.data
                .filter((item) => item.generation > 0)
                .sort((a, b) => b.generation - a.generation)
                .map((item, index) => {
                  const isGreen = [
                    "BIOMASS",
                    "NPSHYD",
                    "NUCLEAR",
                    "PS",
                    "WIND",
                  ].includes(item.fuelType);
                  const isFossil = ["CCGT", "COAL", "OCGT", "OIL"].includes(
                    item.fuelType
                  );
                  const percentage = (
                    (item.generation / metrics.totalGeneration) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={index}
                      className="metric-card rounded-xl p-4 flex items-center justify-between hover:scale-[1.01] transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            isGreen
                              ? "bg-emerald-400"
                              : isFossil
                              ? "bg-red-400"
                              : "bg-slate-400"
                          }`}
                        ></div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            {item.fuelType}
                          </div>
                          <div className="text-xs text-gray-500">
                            {isGreen
                              ? "Renewable"
                              : isFossil
                              ? "Fossil Fuel"
                              : "Other/Import"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-700 text-lg">
                          {item.generation.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          MW ({percentage}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card rounded-xl p-4 text-center border border-emerald-500/30">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {metrics.greenPercentage}%
                </div>
                <div className="text-slate-300 text-sm">Green Sources</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center border border-red-500/30">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {metrics.fossilPercentage}%
                </div>
                <div className="text-slate-300 text-sm">Fossil Fuels</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center border border-slate-500/30">
                <div className="text-2xl font-bold text-slate-300 mb-1">
                  {(
                    100 -
                    metrics.greenPercentage -
                    metrics.fossilPercentage
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-slate-300 text-sm">Other Sources</div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="p-4 bg-slate-800/30 rounded-xl">
              <div className="text-xs text-slate-300 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span>
                    Green sources contribute to lower carbon emissions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span>Fossil fuel sources increase carbon footprint</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                  <span>Interconnects and other sources (neutral impact)</span>
                </div>
                <div className="mt-2 text-slate-400">
                  * Negative values (exports/storage discharge) excluded from
                  breakdown
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GridGreenness;
