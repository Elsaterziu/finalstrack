import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const StressChart = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return <p className="text-muted">No stress data yet.</p>;
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.loggedAt) - new Date(b.loggedAt)
  );

  const data = {
    labels: sortedLogs.map(l =>
      new Date(l.loggedAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Stress Level",
        data: sortedLogs.map(l => l.stressLevel),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Stress level: ${ctx.raw}/10`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        min: 0,
        max: 10,
        ticks: { stepSize: 1 },
        grid: { color: "#eee" }
      }
    }
  };

  return (
    <div style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StressChart;
