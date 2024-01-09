import React, { useEffect, forwardRef, useRef } from "react";

import Chart, { defaults } from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CategoryScale } from "chart.js";
import { Doughnut, Line, Bar } from "react-chartjs-2";
// import "chartjs-plugin-doughnut-innertext";

// import { IoTrendingDown, IoTrendingUp } from "react-icons/io5";
// import axios from "axios";
// import Cookies from 'js-cookie';

// import { LoadingContext } from '../auth/ProtectedRoute';

Chart.register(CategoryScale);
Chart.register(ChartDataLabels);
Chart.register({
  id: 'doughnutCenterText',
  beforeDraw: function(chart) {
    if (chart.config.type === "doughnut" && chart.config.options.plugins && chart.config.options.plugins.center) {
      // Get ctx from string
      var ctx = chart.ctx;

      const context = {
        chart: chart,
        datasets: chart.data.datasets
      }


      // Get options from the center object in options
      var centerConfig = chart.config.options.plugins.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = "Total: " + (typeof centerConfig.text === 'function' ? centerConfig.text(context) : centerConfig.text);
      var color = centerConfig.color || '#000';
      // Start with a base font of 30px
      
      // Find out how much the font can grow in width.
      
      
      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      // ctx.font = "18 px ";
      ctx.font = "18px " + fontStyle;
      ctx.fillStyle = color;
      
      var doughnutInnerWidth = (chart.width - 32) / 2;
      var stringWidth = ctx.measureText(txt).width;

      var widthRatio = doughnutInnerWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio) / 3;
      ctx.font = `${newFontSize}px ${fontStyle}`;
      
      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});

defaults.scale.grid.display = false;
defaults.plugins.datalabels.display = false;
defaults.plugins.title.display = false;
defaults.responsive = true;
defaults.plugins.legend.display = false;
defaults.plugins.title.display = false;

const chartColors = [ // MUST BE HEX
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

const calculatePercentChange = (arr) => {
  if (arr.length < 2) {
      // Not enough data to calculate percent change
      return 0;
  }

  let start = arr[0];
  let end = arr[arr.length - 1];

  if (start === 0 && end === 0) {
      // No change if both start and end are 0
      return 0;
  } else if (start === 0) {
      // If starting from 0 and ending with a non-zero value, it's a 100% increase
      return 100;
  } else {
      // Normal percent change calculation
      return ((end - start) / start) * 100;
  }
}

const pieChart = forwardRef(({title, units, labels, values}, ref) => {
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="row" style={{justifyContent: "space-between"}}>
        <div className="doughnut-chart">
          <Doughnut
            ref={ref}
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
                  display: true,
                  labels: {
                    value: {
                      color: (x) => {
                        // console.log(x);
                        return '#FFF';
                      },
                      font: {
                        size: '18px'
                      },
                      // backgroundColor: '#fff',
                      // borderColor: '#fff',
                      borderWidth: 2,
                      borderRadius: 4,
                      padding: 0,
                      align: 'center',
                      formatter: (val, ctx) => {
                        const chartTotal = ctx.dataset.data.reduce((accum, val) => accum + val);
                        return val >= chartTotal / 20 ? ((val / chartTotal) * 100).toFixed(0) + '%' : null;
                      }
                    },
                  },
                },
                center: {
                  text: (context) => {
                    const dataMatrix = context.datasets.map(dataset => dataset.data);
                    return dataMatrix.flat().reduce((acc, val) => acc + val, 0);
                  },
                  color: '#222'
                }
              }
            }}
          />
        </div>
        <div className="chart-legend column">
          {labels.map((label, i) => {
            return (
              <div className="legend-value" key={i}>
                <div className="label-color" style={{backgroundColor: chartColors[i]}}></div>
                <p className="label-value">{label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
});

const lineChart = forwardRef(({title, units, labels, values}, ref) => {
  useEffect(() => {
    if (ref.current) {
      const chartInstance = ref.current; // Access the chart instance
      const ctx = chartInstance.ctx;

      chartInstance.data.datasets.forEach(dataset => {
        const borderColor = dataset.borderColor;
        // console.log(borderColor)

        const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
        gradient.addColorStop(0, borderColor + '66'); // Use the borderColor as the start color
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.2)"); // End color

        dataset.backgroundColor = gradient;
      })
      chartInstance.update();
    }
  }, [ref]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-legend">
        {units.map((label, i) => {
          return (
            <div className="legend-value" key={i}>
              <div className="label-color" style={{backgroundColor: chartColors[i]}}></div>
              <p className="label-value">{label}</p>
            </div>
          )
        })}
      </div>
      <Line
        ref={ref}
        data={{
          labels: labels,
          datasets: values.map((valuesArr, i) => {
            return {
              label: units[i],
              data: valuesArr,
              fill: true,
              borderColor: chartColors[i],
              tension: 0.1,
              radius: 0
            }
          })
        }}
        options={{
          plugins: {
            datalabels: {
              display: false,
              // align: 'end',
              // anchor: 'top',
              align: 'left',
              anchor: 'start',
              formatter: (value, context) => context.dataIndex === context.dataset.data.length - 1 ? value : null,
              backgroundColor: (context) => chartColors[context.datasetIndex],
              color: '#FFF',
              borderRadius: 5,
            }
          }
        }}
      />
    </div>
  )
});

const barChart = forwardRef(({title, units, labels, values}, ref) => {
  const maxValue = Math.max(...values.flat());
  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-legend">
        {units.map((label, i) => {
          return (
            <div className="legend-value" key={i}>
              <div className="label-color" style={{backgroundColor: chartColors[i]}}></div>
              <p className="label-value">{label}</p>
            </div>
          )
        })}
      </div>
      <Bar
        ref={ref}
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
              beginAtZero: true,
              max: maxValue + (maxValue / 5), //add a 20% buffer to the top of the graph for the datalabels
              ticks: { display: false },
              grid: { display: false },
              border: { display: false }
            }
          },
          plugins: {
            datalabels: {
              display: true,
              // color: (context) => chartColors[context.datasetIndex],
              color: '#000',
              align: 'top',
              anchor: 'end',
              font: {
                size: '16px', 
                weight: 'bold'
              },
            }
          }
        }}
      />
    </div>
  )
});

const KPIChart = forwardRef(({title, units, values, reverse, daysBack}, ref) => {
  const percentChange = calculatePercentChange(values);
  let borderColor = percentChange > 0 ? '#27ae60' : percentChange < 0 ? '#c0392b' : '#2c3e50';
  if (borderColor === '#27ae60' && reverse === true) {
    borderColor = '#c0392b';
  } else if (borderColor === '#c0392b' && reverse === true) {
    borderColor = '#27ae60';
  }
  // const trendIcon = percentChange > 0 ? <IoTrendingUp /> : percentChange < 0 ? <IoTrendingDown /> : null;
  const minValue = Math.min(...values) - 0.2;
  const showChart = values.length > 1;

  if (daysBack && daysBack < values.length) values = values.slice(values.length-daysBack, values.length);

  return (
    <div className={(!showChart ? 'numeric-kpi ' : '') + 'chart-card'}>
      <div className="kpi-card">
        <div className="kpi-data">
          <h3>{ title }</h3>
          <h1>{ values.at(-1) } { units?.[0] }</h1>
          {showChart && <p style={{color: borderColor}}> { percentChange > 0 ? '+' : '' }{ percentChange }% Last { values.length } Days</p>}
        </div>
        {showChart && <div className="kpi-chart">
          <Line 
            ref={ref}
            data={{
              // labels: [...Array(values[0].length)].map(x => 'test'),
              labels: Array(values.length).fill(0),
              datasets: [{
                data: values,
                fill: true,
                borderColor: borderColor,
                backgroundColor: () => {
                  if (ref.current) {
                    const chartInstance = ref.current; // Access the chart instance
                    const ctx = chartInstance.ctx;
              
                    const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
                    gradient.addColorStop(0.25, borderColor); // Use the borderColor as the start color
                    gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // End color
                    
                    return gradient;
                  }
                },
                tension: .3,
                radius: 0
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: false,
                  min: minValue,
                  ticks: { display: false },
                  grid: { display: false },
                  border: { display: false }
                },
                x: {
                  ticks: { display: false },
                  grid: { display: false },
                  border: { display: false }
                },
              }
            }}
          />
        </div>}
      </div>
    </div>
  )
});

const chartTypes = {
  pie: pieChart,
  doughnut: pieChart,
  line: lineChart,
  bar: barChart,
  kpi: KPIChart
}

const DashChart = ({ type, title, units, labels, values, reverse=false, daysBack }) => {
  const chartRef = useRef(null);

  // return chartTypes[type.toLowerCase()]?.(title, units, labels, values);

  const ChartComponent = chartTypes[type.toLowerCase()];
  return ChartComponent ? <ChartComponent ref={chartRef} title={title} units={units} labels={labels} values={values} reverse={reverse} daysBack={daysBack} /> : null;
}

export default DashChart;