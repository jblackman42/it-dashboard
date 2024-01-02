import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import { LoadingContext } from '../auth/ProtectedRoute';
import { Ticket } from "../components";
import { getToken } from "../auth";

const getTickets = async (user_id, onlyMyTickets) => {
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

const updateTickets = async (updatedTickets) => {
  return await axios({
    method: "put",
    url: "https://my.pureheart.org/ministryplatformapi/tables/IT_Help_Tickets",
    params: {
      $allowCreate: "false",
      $select: "IT_Help_Ticket_ID, Description, Agent_ID, Priority_ID, Request_Date, Request_Method_ID, Request_Title, Resolve_Date, Status_ID, Tag_ID, Ticket_Requestor_ID"
    },
    data: updatedTickets,
    headers: {
      "Authorization": `Bearer ${await getToken()}`,
      "Content-Type": "Application/JSON"
    }
  })
  .then(response => response.data)
}

class Column {
  constructor(title, status, visibilityCondition, filter, sortFunc) {
    this.title = title
    this.status = status
    this.visibilityCondition = visibilityCondition
    this.filter = (ticket) => filter(ticket, this.status);
    this.sortFunc = sortFunc
  }
}


const Home = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState({});
  // filter options
  const [onlyMyTickets, setOnlyMyTickets] = useState(true);
  const [showWaiting, setShowWaiting] = useState(false);
  
  const columns = [
    new Column(
      "Waiting",
      8,
      showWaiting,
      (ticket, status) => ticket.Status_ID === status,
      (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
    ),
    new Column(
      "To-Do",
      1,
      null,
      (ticket, status) => ticket.Status_ID === status,
      (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
    ),
    new Column(
      "Working",
      2,
      null,
      (ticket, status) => ticket.Status_ID === status,
      (ticketA, ticketB) => parseInt(ticketA.Priority) - parseInt(ticketB.Priority)
    ),
    new Column(
      "Complete",
      3,
      null,
      (ticket, status) => ticket.Status_ID === status,
      (ticketA, ticketB) => {
        // Check if either ticket has a null resolve date
        if (ticketA.Resolve_Date === null && ticketB.Resolve_Date !== null) {
          return -1; // ticketA comes first (is 'smaller') because it's null
        } else if (ticketB.Resolve_Date === null && ticketA.Resolve_Date !== null) {
          return 1; // ticketB comes first because ticketA is not null
        } else if (ticketA.Resolve_Date === null && ticketB.Resolve_Date === null) {
          return 0; // Both are null, considered equal
        } else {
          // If both dates are not null, compare them normally
          return new Date(ticketB.Resolve_Date) - new Date(ticketA.Resolve_Date);
        }
      }
    )
  ];

  useEffect(() => {
    if (Cookies.get("user")) setUser(JSON.parse(Cookies.get("user")));
  }, []);
  
  useEffect(() => {
    startLoading();
    // console.log(onlyMyTickets)
    if (user.userid) getTickets(user.userid, onlyMyTickets)
      .then(tickets => {
        // console.log(tickets)
        setTickets(tickets)
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  }, [user, onlyMyTickets, startLoading, stopLoading]);

  const handleTicketUpdate = (Ticket_ID, Field_Name, Field_Value) => {
    // console.log(Field_Value)
    // return null;
    const currTicketIndex = tickets.findIndex(ticket => ticket.IT_Help_Ticket_ID === Ticket_ID);
    if (currTicketIndex === -1 || tickets[currTicketIndex][Field_Name] === Field_Value) return;
  
    const updatedTicket = {
      ...tickets[currTicketIndex],
      [Field_Name]: Field_Value
    };
  
    startLoading();
    updateTickets([updatedTicket])
      .then(newTicketsData => {
        // console.log(newTicketsData);
        // Create a new array with the updated ticket
        const updatedTickets = tickets.map((ticket, index) => {
          if (index === currTicketIndex) {
            return { ...ticket, [Field_Name]: newTicketsData[0][Field_Name] };
          }
          return ticket;
        });
        setTickets(updatedTickets);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  }  

  return (
    <article id="home">
      <div className="filter-container">
        <input type="checkbox" id="my-tickets" checked={onlyMyTickets} onChange={() => setOnlyMyTickets(!onlyMyTickets)} />
        <label htmlFor="my-tickets">My Tickets</label>

        <input type="checkbox" id="show-waiting" checked={showWaiting} onChange={() => setShowWaiting(!showWaiting)} />
        <label htmlFor="show-waiting">Show Waiting</label>
      </div>
      <div className="kanban-board">
        {Boolean(tickets && tickets.length) && columns.map((column, i) => {
          return (
            (column.visibilityCondition !== null ? column.visibilityCondition : true) && <div className="kanban-column" key={i}>
              <h2>{column.title} {column.status}</h2>
              {tickets.filter(column.filter).sort(column.sortFunc).map(ticket => {
                const { IT_Help_Ticket_ID } = ticket;
                return <Ticket ticketData={ticket} handleTicketUpdate={handleTicketUpdate} currentColumnIndex={i} columns={columns} key={ IT_Help_Ticket_ID } />
              })}
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default Home;