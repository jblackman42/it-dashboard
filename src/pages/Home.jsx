import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import { Ticket } from "../components";
import { getToken } from "../auth";

const getTickets = async (user_id, onlyMyTickets) => {
  const token = await getToken();
  if (!token) return null;

  // console.log(onlyMyTickets)
  return await axios({
    method: "post",
    url: "https://my.pureheart.org/ministryplatformapi/procs/api_PHC_GetHelpdeskTickets",
    data: {
      "@Top": 100,
      "@Skip": 0,
      "@IncludeClosedTickets": 0,
      "@User_ID": onlyMyTickets ? parseInt(user_id) : null
    },
    headers: {
      "Authorization": `Bearer ${await getToken()}`,
      "Content-Type": "Application/JSON"
    }
  })
  .then(response => response.data[0])
}

const columns = [
  {
    title: "To-Do",
    filter: ticket => ticket.Status_ID === 1,
    sortFunc: (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
  },
  {
    title: "Waiting",
    filter: ticket => ticket.Status_ID === 8,
    sortFunc: (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
  },
  {
    title: "Working",
    filter: ticket => ticket.Status_ID === 2,
    sortFunc: (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
  },
  {
    title: "Complete",
    filter: ticket => ticket.Status_ID === 3,
    sortFunc: (ticketA, ticketB) => new Date(ticketB.Request_Date) - new Date(ticketA.Request_Date)
  }
]

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState({});
  const [onlyMyTickets, setOnlyMyTickets] = useState(true);

  useEffect(() => {
    if (Cookies.get("user")) setUser(JSON.parse(Cookies.get("user")));
  }, []);
  
  useEffect(() => {
    console.log(onlyMyTickets)
    if (user.userid) getTickets(user.userid, onlyMyTickets)
      .then(tickets => {
        console.log(tickets)
        setTickets(tickets)
      })
  }, [user, onlyMyTickets]);

  return (
    <article id="home">
      <div className="filter-container">
        <input type="checkbox" id="my-tickets" checked={onlyMyTickets} onChange={() => setOnlyMyTickets(!onlyMyTickets)} />
        <label htmlFor="my-tickets">My Tickets</label>
      </div>
      <div className="kanban-board">
        {Boolean(tickets && tickets.length) && columns.map((column, i) => {
          return (
            <div className="kanban-column" key={i}>
              <h2>{column.title}</h2>
              {tickets.filter(column.filter).sort(column.sortFunc).map(ticket => {
                const { IT_Help_Ticket_ID } = ticket;
                return <Ticket ticketData={ticket} key={ IT_Help_Ticket_ID } />
              })}
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default Home;