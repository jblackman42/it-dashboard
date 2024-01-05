import React, { useContext, useRef, useState, useEffect } from "react";
import axios from "axios";

import { LoadingContext } from '../auth/ProtectedRoute';
import { getToken } from "../auth";
// import Chart from "chart.js/auto";
// import { CategoryScale } from "chart.js";
// import { Pie } from "react-chartjs-2";
// import axios from "axios";
// import Cookies from 'js-cookie';

// import { LoadingContext } from '../auth/ProtectedRoute';
import { DashChart } from "../components";

const getTickets = async () => {
  // console.log(onlyMyTickets)
  return await axios({
    method: "post",
    url: "https://my.pureheart.org/ministryplatformapi/procs/api_PHC_GetHelpdeskTickets",
    data: {
      "@Top": 2147483647, //biggest int in sql
      "@Skip": 0,
      "@IncludeClosedTickets": 1
    },
    headers: {
      "Authorization": `Bearer ${await getToken()}`,
      "Content-Type": "Application/JSON"
    }
  })
  .then(response => response.data[0])
}
// Chart.register(CategoryScale)

const Dashboard = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [tickets, setTickets] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
  
      startLoading();
      getTickets()
        .then(tickets => {
          // console.log(tickets)
          setTickets(tickets);
          console.log(tickets);
          
          // console.log(tickets.filter(ticket => ticket.Status_ID !== 4 && new Date(ticket.Request_Date).toLocaleDateString() === new Date().toLocaleDateString()));
          const openedToday = [...Array(30)].map((_,i) => i).reverse().map(i => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            // return new Date(today.setDate(today.getDate() - i)).toLocaleDateString();
            return tickets.filter(ticket => ticket.Status_ID !== 4 && new Date(ticket.Request_Date).toLocaleDateString() === date.toLocaleDateString()).length;
          })
          console.log(openedToday);
          stopLoading();
        })
        .catch((err) => {
          stopLoading();
        });
    }
  }, [startLoading, stopLoading]);

  return (
    <article id="dashboard">
      {/* <h1>This is a dashboard</h1> */}
      <div className="chart-card">
        <DashChart type="KPI" title="Tickets Opened Today" values={[[10, 15, 20, 5, 10, 60, 25, 40, 10, 12, 32, 32]]} />
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