import React, { useContext, useRef, useMemo, useState, useEffect } from "react";
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

const pushToArray = (setArrayFunction, value) => {
  return setArrayFunction(currentArr => [...currentArr, value]);
}

const Dashboard = () => {
  const initialized = useRef(false);
  const { startLoading, stopLoading } = useContext(LoadingContext);

  const daysBack = 30;
  const oldestDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    return date;
  }, []);
  const daysBackArray = [...Array(daysBack)].map((_, i) => i).reverse().map(i => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString('en-us', {month: 'short', day: 'numeric', year: 'numeric'});
  })

  // const [tickets, setTickets] = useState([]);
  const [openedToday, setOpenedToday] = useState([]);
  const [resolvedToday, setResolvedToday] = useState([]);
  
  const [ticketStatusLabels, setTicketStatusLabels] = useState([]);
  const [ticketStatusValues, setTicketStatusValues] = useState([]);

  const [ticketPriorityLabels, setTicketPriorityLabels] = useState([]);
  const [ticketPriorityValues, setTicketPriorityValues] = useState([]);

  const [ticketMethodsLabels, setTicketMethodsLabels] = useState([]);
  const [ticketMethodsValues, setTicketMethodsValues] = useState([]);

  const [ticketsCompletedUsers, setTicketsCompletedUsers] = useState([]);
  const [ticketsCompletedByUser, setTicketsCompletedByUser] = useState([]);

  const [totalTicketsOpened, setTotalTicketsOpened] = useState(0);
  const [totalTicketResolved, setTotalTicketsResolved] = useState(0);

  const [daysBackTicketsOpened, setDaysBackTicketsOpened] = useState(0);
  const [daysBackTicketResolved, setDaysBackTicketsResolved] = useState(0);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
  
      startLoading();
      getTickets()
        .then(tickets => {
          console.log(tickets);
          
          [...new Set(tickets.filter(ticket => ticket.Status).map(ticket => ticket.Status))].sort().forEach(status => {
            pushToArray(setTicketStatusLabels, status);
            pushToArray(setTicketStatusValues, tickets.filter(ticket => new Date(ticket.Request_Date) > oldestDate && ticket.Status === status).length);
          });

          [...new Set(tickets.filter(ticket => ticket.Priority).map(ticket => ticket.Priority))].sort().forEach(priority => {
            pushToArray(setTicketPriorityLabels, priority);
            pushToArray(setTicketPriorityValues, tickets.filter(ticket => new Date(ticket.Request_Date) > oldestDate && ticket.Priority === priority).length);
          });

          [...new Set(tickets.filter(ticket => ticket.Request_Method).map(ticket => ticket.Request_Method))].sort().forEach(method => {
            pushToArray(setTicketMethodsLabels, method);
            pushToArray(setTicketMethodsValues, tickets.filter(ticket => new Date(ticket.Request_Date) > oldestDate && ticket.Request_Method === method).length);
          });

          [...new Set(tickets.filter(ticket => ticket.Status_ID === 3 && ticket.Agent).map(ticket => ticket.Agent))].sort().forEach(agent => {
            pushToArray(setTicketsCompletedUsers, agent);
            pushToArray(setTicketsCompletedByUser, tickets.filter(ticket => new Date(ticket.Request_Date) > oldestDate && ticket.Agent === agent).length);
          });

          daysBackArray.forEach(date => {

            pushToArray(setOpenedToday, tickets.filter(ticket => ticket.Status_ID !== 4 && new Date(ticket.Request_Date).toLocaleDateString() === new Date(date).toLocaleDateString()).length);
            pushToArray(setResolvedToday, tickets.filter(ticket => ticket.Status_ID === 3 && new Date(ticket.Resolve_Date).toLocaleDateString() === new Date(date).toLocaleDateString()).length)
            

          });

          setTotalTicketsOpened(tickets.filter(ticket => ticket.Status_ID !== 4).length);
          setTotalTicketsResolved(tickets.filter(ticket => ticket.Status_ID === 3).length);

          setDaysBackTicketsOpened(tickets.filter(ticket => ticket.Status_ID !== 4 && new Date(ticket.Request_Date) > oldestDate).length)
          setDaysBackTicketsResolved(tickets.filter(ticket => ticket.Status_ID === 3 && new Date(ticket.Resolve_Date) > oldestDate).length)

          stopLoading();
        })
        .catch((err) => {
          stopLoading();
        });
    }
  }, [startLoading, stopLoading, oldestDate, daysBackArray]);

  return (
    <article id="dashboard">
      <div className="row">
        <div className="column">
          <DashChart type="Doughnut" title={`Ticket By Status - (Last ${daysBack} Days)`} units={["Tickets"]} labels={ticketStatusLabels} values={[ticketStatusValues]} />
        </div>
        <div className="column">
          <DashChart type="KPI" title="Tickets Opened - (Today)" values={openedToday} reverse={true} daysBack={7}/>
          <DashChart type="KPI" title="Tickets Resolved - (Today)" values={resolvedToday} daysBack={7}/>
        </div>
        <div className="column">
          <DashChart type="KPI" title={`Tickets Opened - (Last ${daysBack} Days)`} values={[daysBackTicketsOpened]}/>
          <DashChart type="KPI" title="Total Tickets Opened" values={[totalTicketsOpened]}/>
        </div>
        <div className="column">
          <DashChart type="KPI" title={`Tickets Resolved - (Last ${daysBack} Days)`} values={[daysBackTicketResolved]}/>
          <DashChart type="KPI" title="Total Tickets Resolved" values={[totalTicketResolved]}/>
        </div>
        <div className="column">
          <DashChart type="Doughnut" title={`Ticket By Priority - (Last ${daysBack} Days)`} units={["Tickets"]} labels={ticketPriorityLabels} values={[ticketPriorityValues]} />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <DashChart type="Doughnut" title={`Ticket By Method - (Last ${daysBack} Days)`} units={["Tickets"]} labels={ticketMethodsLabels} values={[ticketMethodsValues]} />
        </div>
        <div className="column">
          <DashChart type="Bar" title={`Tickets By Agent - (Last ${daysBack} Days)`} units={["Tickets Completed"]} labels={ticketsCompletedUsers} values={[ticketsCompletedByUser]} />
        </div>
      </div>
      {/* <div className="chart-card">
        <DashChart type="Line" title={`Tickets By Date - (Last ${daysBack} Days)`} units={["Tickets Resolved", "Tickets Opened"]} labels={daysBackArray} values={[resolvedToday, openedToday]} />
      </div> */}
    </article>
  )
}

export default Dashboard;