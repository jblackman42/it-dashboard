import React, { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

import ticketFieldsData from "../config/fields.json";
import {
  getTickets,
  updateTickets,
  handleTicketError,
} from "../config/tickets";
import Column from "../config/Column";

import { LoadingContext } from "../auth/ProtectedRoute";
import { Ticket, EditTicketMenu } from "../components";

const Home = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState({});
  // edit ticket options
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState({});
  const [ticketMissingFields, setTicketMissingFields] = useState([]);
  // filter options
  const [onlyMyTickets, setOnlyMyTickets] = useState(true);
  const [showWaiting, setShowWaiting] = useState(false);

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) setUser(JSON.parse(user));
  }, []);

  useEffect(() => {
    // console.log(onlyMyTickets)
    if (user.userid) {
      startLoading();
      getTickets(user.userid, onlyMyTickets)
        .then((tickets) => {
          // console.log(tickets);
          setTickets(tickets);
          stopLoading();
        })
        .catch((err) => {
          handleTicketError();
          stopLoading();
        });
    }
  }, [user, onlyMyTickets, startLoading, stopLoading]);

  const ticketFields = [
    ticketFieldsData.Request_Date,
    ticketFieldsData.Tag_ID,
    ticketFieldsData.Status_ID,
    ticketFieldsData.Priority_ID,
    ticketFieldsData.Agent_ID,
    ticketFieldsData.Request_Method_ID,
    ticketFieldsData.Resolve_Date,
  ];

  const columns = [
    new Column({
      title: "To-Do",
      status: 1,
    }),
    new Column({
      title: "Waiting",
      status: 8,
      visibilityCondition: showWaiting,
      requiredFields: [
        ticketFieldsData.Priority_ID,
        ticketFieldsData.Tag_ID,
        ticketFieldsData.Agent_ID,
        ticketFieldsData.Request_Method_ID,
      ],
    }),
    new Column({
      title: "Working",
      status: 2,
      requiredFields: [
        ticketFieldsData.Priority_ID,
        ticketFieldsData.Tag_ID,
        ticketFieldsData.Agent_ID,
        ticketFieldsData.Request_Method_ID,
      ],
    }),
    new Column({
      title: "Complete",
      status: 3,
      maxLength: 2,
      sortFunc: (ticketA, ticketB) => {
        // Check if either ticket has a null resolve date
        if (ticketA.Resolve_Date === null && ticketB.Resolve_Date !== null) {
          return -1; // ticketA comes first (is 'smaller') because it's null
        } else if (
          ticketB.Resolve_Date === null &&
          ticketA.Resolve_Date !== null
        ) {
          return 1; // ticketB comes first because ticketA is not null
        } else if (
          ticketA.Resolve_Date === null &&
          ticketB.Resolve_Date === null
        ) {
          return 0; // Both are null, considered equal
        } else {
          // If both dates are not null, compare them normally
          return (
            new Date(ticketB.Resolve_Date) - new Date(ticketA.Resolve_Date)
          );
        }
      },
      requiredFields: [
        ticketFieldsData.Priority_ID,
        ticketFieldsData.Tag_ID,
        ticketFieldsData.Agent_ID,
        ticketFieldsData.Request_Method_ID,
        ticketFieldsData.Resolve_Date,
      ],
    }),
  ];

  const handleTicketUpdate = (Ticket_ID, Field_Name, Field_Value) => {
    // get current ticket
    const currTicket =
      tickets[
        tickets.findIndex((ticket) => ticket.IT_Help_Ticket_ID === Ticket_ID)
      ];
    if (!currTicket || currTicket[Field_Name] === Field_Value) return;

    // if the value changing is status id that means the column is changing
    // must check required fields of column
    if (Field_Name === "Status_ID") {
      const currColumn =
        columns[columns.findIndex((column) => column.status === Field_Value)];
      if (currColumn) {
        const missingFields = currColumn.requiredFields.filter((field) => {
          return currTicket[field.Ticket_Field] === null;
        });
        if (missingFields.length) {
          const cloneCurrTicket = { ...currTicket };
          cloneCurrTicket[Field_Name] = Field_Value;
          cloneCurrTicket.Status = currColumn.title;
          setShowEditMenu(true);
          setTicketToEdit(cloneCurrTicket);
          setTicketMissingFields(missingFields);
          return;
        }
      }
    }
    // console.log("no missing fields found: updating ticket.");
    const updatedTicket = {
      ...currTicket,
      [Field_Name]: Field_Value,
    };

    startLoading();
    updateTickets([updatedTicket], tickets, setTickets)
      .then(() => {
        stopLoading();
      })
      .catch((err) => {
        handleTicketError();
        stopLoading();
      });
  };

  const shortenArrToMaxLength = (arr, maxLength) =>
    maxLength !== null ? arr.slice(0, maxLength) : arr;

  return (
    <article id="kanban">
      <EditTicketMenu
        showEditMenu={showEditMenu}
        setShowEditMenu={setShowEditMenu}
        ticketFields={ticketFields}
        ticketToEdit={ticketToEdit}
        ticketMissingFields={ticketMissingFields}
        updateTickets={(x) => updateTickets(x, tickets, setTickets)}
      />
      <div className="filter-container">
        <input
          type="checkbox"
          id="my-tickets"
          checked={onlyMyTickets}
          onChange={() => setOnlyMyTickets(!onlyMyTickets)}
        />
        <label htmlFor="my-tickets">My Tickets</label>

        <input
          type="checkbox"
          id="show-waiting"
          checked={showWaiting}
          onChange={() => setShowWaiting(!showWaiting)}
        />
        <label htmlFor="show-waiting">Show Waiting</label>
      </div>
      <div
        className="kanban-board"
        style={{
          gridTemplateColumns: `repeat(${
            columns.filter((column) => column.visibilityCondition !== false)
              .length
          }, 1fr)`,
        }}
      >
        {Boolean(tickets && tickets.length) &&
          columns.map((column, i) => {
            return (
              (column.visibilityCondition !== null
                ? column.visibilityCondition
                : true) && (
                <div className="kanban-column" key={i}>
                  <h2>
                    {column.title} {column.status}
                  </h2>
                  {shortenArrToMaxLength(
                    tickets.filter(column.filter).sort(column.sortFunc),
                    column.maxLength
                  ).map((ticket) => {
                    const { IT_Help_Ticket_ID } = ticket;
                    return (
                      <Ticket
                        ticketData={ticket}
                        handleTicketUpdate={handleTicketUpdate}
                        currentColumnIndex={i}
                        columns={columns}
                        key={IT_Help_Ticket_ID}
                      />
                    );
                  })}
                </div>
              )
            );
          })}
      </div>
    </article>
  );
};

export default Home;
