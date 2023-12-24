// import React, { useEffect, useState } from 'react';
import React from 'react';

import { FaRegComment, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import sanitizeHtml from 'sanitize-html';

function Ticket({ ticketData, handleTicketUpdate, currentColumnIndex, columns }) {
  // console.log(ticketData)
  const { IT_Help_Ticket_ID, Request_Title, Description, Request_Date, Tag, Status, Status_ID, Priority, Agent, Request_Method, Attachments_Count, Notes_Count } = ticketData;
  
  const details = [
    {
      label: "Request Date:",
      value: !Request_Date ? "Invalid Date" : new Date(Request_Date).toLocaleDateString('en-us', {month: 'short', day: 'numeric', year: 'numeric'})
    },
    {
      label: "Tag",
      value: Tag ?? "Unknown"
    },
    {
      label: "Status",
      value: Status ?? "Unknown"
    },
    {
      label: "Priority",
      value: Priority ?? "Unknown"
    },
    {
      label: "Agent",
      value: Agent ?? "Unknown"
    },
    {
      label: "Request Method",
      value: Request_Method ?? "Unknown"
    }
  ];
  

  const ticketClassList = [];
  const priorityClasses = ['critical', 'high', 'medium', 'low'];
  if (Priority) ticketClassList.push(priorityClasses[parseInt(Priority) - 1]);
  if (Status_ID === 3) ticketClassList.push('complete'); 

  return (
    <div className="ticket-container">

      <div className={"ticket" + (ticketClassList.length ? ` ${ticketClassList.join(" ")}` : '')}>
        <h1 className="ticket-title">{Request_Title}</h1>
        <div className="info-column">
          <div className="description-container">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(Description) }} />
          </div>
          <div className="details-grid">
            {details.map((detail, i) => {
              return (
                <div className="detail" key={i}>
                  <p className="label">{detail.label}</p>
                  <p className="value">{detail.value}</p>
                </div>
              )
            })}
          </div>
        </div>
        <div className="button-container-column">
          <div className="button-container-row">
            <button className="icon-button xl green" title="Complete Ticket"><IoCheckmarkCircle /></button>
            <button className="icon-button xl red" title="Close Ticket"><IoCloseCircle /></button>
          </div>
          <div className="button-container-row">
            <button className="icon-button l" title="Move Left" onClick={() => 
              handleTicketUpdate(
                IT_Help_Ticket_ID,
                "Status_ID",
                currentColumnIndex - 1 >= 0 ? columns[currentColumnIndex - 1].status : columns[currentColumnIndex].status,
              )
            }><FaArrowLeft /></button>
            <button className="icon-button l" title="Move Right" onClick={() => 
              handleTicketUpdate(
                IT_Help_Ticket_ID,
                "Status_ID",
                currentColumnIndex + 1 < columns.length ? columns[currentColumnIndex + 1].status : columns[currentColumnIndex].status,
              )
            }><FaArrowRight /></button>
          </div>
          {/* <a href={`https://my.pureheart.org/mp/331-3315/${IT_Help_Ticket_ID}`} target="_blank" className="link-button">View on MP</a> */}
          <div style={{ marginTop: "auto" }}>
            <button className="icon-button m" title={`View ${Notes_Count} Note${Notes_Count===1?'':'s'}`}><FaRegComment /> {Notes_Count}</button>
            <button className="icon-button m" title={`View ${Attachments_Count} Attachment${Attachments_Count===1?'':'s'}`}><ImAttachment /> {Attachments_Count}</button>
          </div>
          {/* <div className="button-container-row bottom">
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Ticket;