import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { ChartPoint } from "../useRealtimeData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface Props {
  data: ChartPoint[];
  color: string;
}

export default function BarChart({ data, color }: Props) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: color + "44",
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { color: "#666", maxTicksLimit: 6, font: { size: 10 } },
      },
      y: {
        display: true,
        grid: { color: "rgba(255,255,255,0.03)" },
        ticks: { color: "#666", font: { size: 10 } },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <div style={{ height: 220 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
