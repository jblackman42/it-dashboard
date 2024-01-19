import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { LoadingContext } from "../auth/ProtectedRoute";
import { Ticket, EditTicketMenu } from "../components";
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
      "@User_ID": onlyMyTickets ? parseInt(user_id) : null,
    },
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "Application/JSON",
    },
  }).then((response) => response.data[0]);
};

class Column {
  constructor({
    title,
    status,
    visibilityCondition = null,
    filter = (ticket, status) => ticket.Status_ID === status,
    sortFunc = (ticketA, ticketB) =>
      parseInt(ticketA.Priority) - parseInt(ticketB.Priority),
    requiredFields = [],
    maxLength = null,
  }) {
    this.title = title;
    this.status = status;
    this.visibilityCondition = visibilityCondition;
    this.filter = (ticket) => filter(ticket, this.status);
    this.sortFunc = sortFunc;
    this.requiredFields = requiredFields;
    this.maxLength = maxLength;
  }
}

const Home = () => {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState({});
  // edit ticket options
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editTicket, setEditTicket] = useState({});
  const [editTicketMissingFields, setEditTicketMissingFields] = useState([]);
  // filter options
  const [onlyMyTickets, setOnlyMyTickets] = useState(true);
  const [showWaiting, setShowWaiting] = useState(false);

  const updateTickets = async (updatedTickets) => {
    // console.log(updatedTickets);
    await axios({
      method: "put",
      url: "https://my.pureheart.org/ministryplatformapi/tables/IT_Help_Tickets",
      params: {
        $allowCreate: "false",
        $select:
          "IT_Help_Ticket_ID, Description, Agent_ID, Priority_ID, Request_Date, Request_Method_ID, Request_Title, Resolve_Date, Status_ID, Tag_ID, Ticket_Requestor_ID",
      },
      data: updatedTickets,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        "Content-Type": "Application/JSON",
      },
    }).then((response) => {
      if (response.status < 200 && response.status >= 300) return; //return if status isn't a 200 response
      const cloneTickets = [...tickets];
      updatedTickets.forEach((newTicket) => {
        const oldTicketIndex = cloneTickets.findIndex(
          (t) => t.IT_Help_Ticket_ID === newTicket.IT_Help_Ticket_ID
        );
        cloneTickets[oldTicketIndex] = newTicket;
      });
      setTickets(cloneTickets);
    });
  };

  const ticketFields = {
    Priority_ID: {
      Ticket_Field: "Priority_ID", // field on ticket that is foreign key to desired table
      Ticket_Label_Field: "Priority", // field on ticket that should be set to the label of the selected value
      Table_Name: "Ticket_Priority", // name of table Ticket_Field is foreign key to
      Table_Value_Name: "Ticket_Priority_ID", // field name on table to use as option value in dropdown
      Table_Label_Name: "Priority", // field on table user should see on dropdown option
      Input_Label: "Ticket Priority", // label for select input
      Input_Type: null, // if field is not a key to another table, use this default html input type
    },
    Tag_ID: {
      Ticket_Field: "Tag_ID",
      Ticket_Label_Field: "Tag",
      Table_Name: "Helpdesk_Tags",
      Table_Value_Name: "IT_Help_ID",
      Table_Label_Name: "Tag",
      Input_Label: "Tag",
      Input_Type: null,
    },
    Agent_ID: {
      Ticket_Field: "Agent_ID",
      Ticket_Label_Field: "Agent_Name",
      Table_Name: "IT_Operators",
      Table_Value_Name: "IT_Operators_ID",
      Table_Label_Name: "First_Name",
      Input_Label: "Agent",
      Input_Type: null,
    },
    Request_Method_ID: {
      Ticket_Field: "Request_Method_ID",
      Ticket_Label_Field: "Request_Method",
      Table_Name: "IT_Ticket_Request_Methods",
      Table_Value_Name: "IT_Ticket_Request_Method_ID",
      Table_Label_Name: "Ticket_Request_Method",
      Input_Label: "Request Method",
      Input_Type: null,
    },
    Resolve_Date: {
      Ticket_Field: "Resolve_Date",
      Ticket_Label_Field: null,
      Table_Name: null,
      Table_Value_Name: null,
      Table_Label_Name: null,
      Input_Label: "Resolve Date",
      Input_Type: "datetime-local",
    },
  };

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
        ticketFields.Priority_ID,
        ticketFields.Tag_ID,
        ticketFields.Agent_ID,
        ticketFields.Request_Method_ID,
      ],
    }),
    new Column({
      title: "Working",
      status: 2,
      requiredFields: [
        ticketFields.Priority_ID,
        ticketFields.Tag_ID,
        ticketFields.Agent_ID,
        ticketFields.Request_Method_ID,
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
        ticketFields.Priority_ID,
        ticketFields.Tag_ID,
        ticketFields.Agent_ID,
        ticketFields.Request_Method_ID,
        ticketFields.Resolve_Date,
      ],
    }),
  ];

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
          stopLoading();
        });
    }
  }, [user, onlyMyTickets, startLoading, stopLoading]);

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
          setEditTicket(cloneCurrTicket);
          setEditTicketMissingFields(missingFields);
          return;
        }
      }
      // console.log(tickets[currTicketIndex][Field_Name]);
      // console.log(Field_Value);
    }
    console.log("no missing fields found: updating ticket.");
    const updatedTicket = {
      ...currTicket,
      [Field_Name]: Field_Value,
    };

    startLoading();
    updateTickets([updatedTicket])
      .then(() => {
        stopLoading();
      })
      .catch((err) => {
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
        editTicket={editTicket}
        editTicketMissingFields={editTicketMissingFields}
        updateTickets={updateTickets}
      />
      {/* {showEditMenu && (
        <div id="edit-menu-container" onClick={() => setShowEditMenu(false)}>
          <div id="edit-menu" onClick={(e) => e.stopPropagation()}>
            <h3>{editTicket.Request_Title}</h3>
            {editTicketMissingFields.map((field, i) => {
              return <p key={i}>{field.Input_Label}</p>;
            })}
          </div>
        </div>
      )} */}
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
