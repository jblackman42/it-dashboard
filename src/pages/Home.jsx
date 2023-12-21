import React, { useState, useEffect } from "react";
import axios from "axios";

import { Ticket } from "../components";
import { getToken } from "../auth";

const getTickets = async () => {
  const token = await getToken();
  if (!token) return null;
  return await axios({
    method: "post",
    url: "https://my.pureheart.org/ministryplatformapi/procs/api_PHC_GetHelpdeskTickets",
    data: {
      "@Top": 100,
      "@Skip": 0,
      "@IncludeClosedTickets": 0
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
    status: 1
  },
  {
    title: "Waiting",
    status: 8
  },
  {
    title: "Working",
    status: 2
  },
  {
    title: "Complete",
    status: 3
  }
]

const Home = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets()
      .then(tickets => {
        setTickets(tickets)
      })
  }, []);

  return (
    <article id="home">
      {Boolean(tickets.length) && columns.map(column => {
        return (
          <div className="kanban-column">
            <h2>{column.title}</h2>
            {tickets.filter(ticket => ticket.Status_ID === column.status).map(ticket => {
              const { IT_Help_Ticket_ID } = ticket;
              return <Ticket ticketData={ticket} key={ IT_Help_Ticket_ID } />
            })}
          </div>
        )
      })}
    </article>
  )
}

export default Home;