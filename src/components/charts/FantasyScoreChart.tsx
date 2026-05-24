import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FantasyScoreChartProps {
  data: {
    name: string;
    score: number;
  }[];
}

export default function FantasyScoreChart({ data: chartData }: FantasyScoreChartProps) {
  const data = {
    labels: chartData.map(d => d.name),
    datasets: [
      {
        label: 'Fantasy Score',
        data: chartData.map(d => d.score),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)'
        },
        ticks: {
          color: '#9ca3af',
          maxRotation: 45,
          minRotation: 45
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

  return <Bar data={data} options={options} />;
}
