import axios from "axios";
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

const updateTickets = async (updatedTickets, allTickets, setTicketsFunc) => {
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
    const cloneTickets = [...allTickets];
    updatedTickets.forEach((newTicket) => {
      const oldTicketIndex = cloneTickets.findIndex(
        (t) => t.IT_Help_Ticket_ID === newTicket.IT_Help_Ticket_ID
      );
      cloneTickets[oldTicketIndex] = newTicket;
    });
    setTicketsFunc(cloneTickets);
  });
};

const handleTicketError = () => {
  alert("something terrible happened");
};

export { getTickets, updateTickets, handleTicketError };
