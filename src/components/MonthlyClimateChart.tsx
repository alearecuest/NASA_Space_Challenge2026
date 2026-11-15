import { Chart } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import '../config/chartSetup'
import { MONTH_LABELS } from '../config/climate'
import type { MonthlyClimatology } from '../types/climate'

interface MonthlyClimateChartProps {
  climatology: MonthlyClimatology[]
}

const options: ChartOptions<'bar' | 'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'bottom' } },
  scales: {
    mm: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'mm per month' } },
    temp: {
      type: 'linear',
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: '°C' },
    },
  },
}

export const MonthlyClimateChart = ({ climatology }: MonthlyClimateChartProps) => {
  const data: ChartData<'bar' | 'line', number[], string> = {
    labels: MONTH_LABELS,
    datasets: [
      {
        type: 'bar',
        label: 'Rainfall (mm)',
        data: climatology.map((month) => month.rain),
        backgroundColor: '#38bdf8',
        yAxisID: 'mm',
      },
      {
        type: 'bar',
        label: 'Reference evapotranspiration (mm)',
        data: climatology.map((month) => month.et0),
        backgroundColor: '#fbbf24',
        yAxisID: 'mm',
      },
      {
        type: 'line',
        label: 'Max temperature (°C)',
        data: climatology.map((month) => month.tmax),
        borderColor: '#dc2626',
        backgroundColor: '#dc2626',
        tension: 0.3,
        yAxisID: 'temp',
      },
      {
        type: 'line',
        label: 'Min temperature (°C)',
        data: climatology.map((month) => month.tmin),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.3,
        yAxisID: 'temp',
      },
    ],
  }

  return (
    <div className="h-80">
      <Chart<'bar' | 'line', number[], string> type="bar" data={data} options={options} />
    </div>
  )
}