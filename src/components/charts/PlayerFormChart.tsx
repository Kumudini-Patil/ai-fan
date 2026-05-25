import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PlayerFormChartProps {
  scores: number[];
  labels?: string[];
}

export default function PlayerFormChart({ scores, labels }: PlayerFormChartProps) {
  const chartLabels = labels || scores.map((_, i) => `Match ${i + 1}`);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Fantasy Points',
        data: scores,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgb(16, 185, 129)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        padding: 12,
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        },
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
}
