import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const StudyTimeChart = ({ exams }) => {
  if (!exams || exams.length === 0) {
    return <p className="text-muted">No study data yet.</p>;
  }

  const data = {
    labels: exams.map(e => `${e.subjectName} (${e.examDate})`),
    datasets: [
      {
        label: "Study Time",
        data: exams.map(e => e.totalStudyMinutes),
        backgroundColor: "#3b82f6",
        borderRadius: 8,
        barThickness: 40
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
          label: (ctx) => `${ctx.raw} minutes`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eee" }
      }
    }
  };

  return (
    <div style={{ height: 300 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StudyTimeChart;
