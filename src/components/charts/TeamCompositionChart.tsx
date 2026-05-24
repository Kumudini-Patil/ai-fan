import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TeamCompositionChartProps {
  composition: {
    wicketkeepers: number;
    batsmen: number;
    all_rounders: number;
    bowlers: number;
  };
}

export default function TeamCompositionChart({ composition }: TeamCompositionChartProps) {
  const data = {
    labels: ['Wicketkeepers', 'Batsmen', 'All-Rounders', 'Bowlers'],
    datasets: [
      {
        data: [
          composition.wicketkeepers || 0,
          composition.batsmen || 0,
          composition.all_rounders || 0,
          composition.bowlers || 0
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#9ca3af',
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
}
