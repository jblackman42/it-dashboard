import React, { useEffect, forwardRef, useRef } from "react";

import Chart from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CategoryScale } from "chart.js";
import {  Doughnut, Line, Bar } from "react-chartjs-2";

import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";
// import axios from "axios";
// import Cookies from 'js-cookie';

// import { LoadingContext } from '../auth/ProtectedRoute';

Chart.register(CategoryScale);
Chart.register(ChartDataLabels);

const chartColors = [
  "#1abc9c",       // Turquoise
  "#f1c40f",       // Yellow
  "#3498db",       // Light Blue
  "#e67e22",       // Orange
  "#e74c3c",       // Red
  "#9b59b6",       // Purple
  "#a29bfe",       // Light Lavender
  "#2ecc71",       // Emerald
  "#d35400",       // Pumpkin
  "#f06292",       // Pink
  "#64b5f6",       // Sky Blue
  "#4db6ac",       // Teal
  "#ff8a65",       // Deep Orange
  "#7986cb"        // Indigo
];

const pieConfig = (title, units, labels, values) => {
  return (
    <Doughnut
      data={{
        labels: labels,
        datasets: values.map((valuesArr, i) => {
          return {
            label: units[i],
            data: valuesArr,
            backgroundColor: chartColors,
            borderColor: '#FFF',
            borderWidth: 2
          }
        })
      }}
      options={{
        plugins: {
          datalabels: {
            color: '#FFF',
            font: {
              size: 18,
            },
            formatter: (value, context) => {
              const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
              const percentage = (value / total * 100).toFixed(0); // Calculate percentage
              return percentage > 5 ? `${percentage}%` : null; // Display as a percentage string
            }
          },
        },
      }}
    />
  )
}

const lineConfig = (title, units, labels, values) => {
  return (
    <Line 
      data={{
        labels: labels,
        datasets: values.map((valuesArr, i) => {
          return {
            label: units[i],
            data: valuesArr,
            fill: false,
            borderColor: chartColors[i],
            tension: 0.1
          }
        })
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: title
          },
          datalabels: {
            display: false
          }
        }
      }}
    />
  )
}

const barConfig = (title, units, labels, values) => {
  return (
    <Bar 
      data={{
        labels: labels,
        datasets: values.map((valuesArr, i) => {
          return {
            label: units[i],
            data: valuesArr,
            backgroundColor: chartColors[i],
          }
        })
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: title
          },
          datalabels: {
            color: '#FFF'
          }
        }
      }}
    />
  )
}

const KPIChart = forwardRef(({title, units, labels, values}, ref) => {
  const percentChange = (((values[0].at(-1) - values[0].at(-2)) / values[0].at(-2)) * 100).toFixed(2);
  const borderColor = percentChange > 0 ? '#27ae60' : percentChange < 0 ? '#c0392b' : '#2c3e50';
  const trendIcon = percentChange > 0 ? <IoTrendingUp /> : percentChange < 0 ? <IoTrendingDown /> : null;
  const minValue = Math.min(...values[0]) - 1;

  useEffect(() => {
    if (ref.current) {
      const chartInstance = ref.current; // Access the chart instance
      const ctx = chartInstance.ctx;
  
      chartInstance.data.datasets[0].borderColor = borderColor;

      const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
      gradient.addColorStop(0, borderColor); // Use the borderColor as the start color
      gradient.addColorStop(0.8, "rgba(255, 255, 255, 1)"); // End color

      // Apply the gradient to the backgroundColor of the first dataset
      chartInstance.data.datasets[0].backgroundColor = gradient;
      chartInstance.update();
    }
  }, [ref, borderColor]);


  return (
    <div className="kpi-card-container">
      <div className="kpi-data">
        {/* <p>{ units[0] }</p> */}
        <h3>{ title }</h3>
        <h1>{ values[0].at(-1) } { units?.[0] }</h1>
        <p style={{color: borderColor}}> { percentChange > 0 ? '+' : '' }{ percentChange }% { trendIcon }</p>
      </div>
      <div className="kpi-chart">
        <Line 
          ref={ref}
          data={{
            labels: labels,
            datasets: [{
              data: values[0],
              fill: true,
              tension: 0.2,
              radius: 0
            }]
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                ticks: {
                  display: false
                },
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              },
              y: {
                beginAtZero: false,
                min: minValue,
                ticks: {
                  display: false
                },
                grid: {
                  display: false
                },
                border: {
                  display: false
                }
              },
            },
            plugins: {
              title: {
                display: false,
              },
              legend: {
                display: false
              },
              datalabels: {
                display: false
              }
            }
          }}
        />
      </div>
    </div>
  )
});

const chartTypes = {
  pie: pieConfig,
  doughnut: pieConfig,
  line: lineConfig,
  bar: barConfig,
  kpi: KPIChart
}

const DashChart = ({ type, title, units, labels, values }) => {
  const chartRef = useRef(null);

  // return chartTypes[type.toLowerCase()]?.(title, units, labels, values);

  const ChartComponent = chartTypes[type.toLowerCase()];
  return ChartComponent ? <ChartComponent ref={chartRef} title={title} units={units} labels={labels} values={values} /> : null;
}

export default DashChart;