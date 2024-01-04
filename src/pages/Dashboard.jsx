import React from "react";

// import Chart from "chart.js/auto";
// import { CategoryScale } from "chart.js";
// import { Pie } from "react-chartjs-2";
// import axios from "axios";
// import Cookies from 'js-cookie';

// import { LoadingContext } from '../auth/ProtectedRoute';
import { DashChart } from "../components";

// Chart.register(CategoryScale)

const Dashboard = () => {
  return (
    <article id="dashboard">
      {/* <h1>This is a dashboard</h1> */}
      <div className="chart-card">
        <DashChart type="KPI" title="Tickets Opened Today" labels={["week 1", "week 2", "week 3", "week 4", "week 5", "week 6", "week 7", "week 8", "week 9", "week 10", "week 11", "week 12"]} values={[[10, 15, 20, 5, 10, 60, 25, 40, 10, 12, 32, 32]]} />
      </div>
      <div className="chart-card">
        <DashChart type="Doughnut" title="Fibonacci Sequence" units={["2023", "2024"]} labels={["Opened", "Waiting", "Working", "Resolved", "Closed"]} values={[[10, 10, 1, 20, 3], [20, 10, 1, 20, 3]]} />
      </div>
      <div className="chart-card">
        <DashChart type="Bar" title="Fibonacci Sequence Bar" units={["Tickets Completed", "Tickets Closed"]} labels={["JD", "Mason", "Blake"]} values={[[100,200,300], [100,200,300]]} />
      </div>
      <div className="chart-card">
        <DashChart type="Line" title="Fibonacci Sequence - Exponential Growth" units={["Fibonacci", "Exponential"]} labels={["week 1", "week 2", "week 3", "week 4", "week 5", "week 6", "week 7", "week 8", "week 9", "week 10", "week 11", "week 12"]} values={[[4, 46, 76, 48, 54, 63, 37, 57, 95, 41, 45, 46], [65, 68, 5, 7, 29, 98, 42, 79, 86, 45, 90, 66]]} />
      </div>
    </article>
  )
}

export default Dashboard;