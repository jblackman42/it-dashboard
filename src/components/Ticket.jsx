import React from "react";

import { FaRegComment, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import sanitizeHtml from "sanitize-html";

function Ticket({
  ticketData,
  handleTicketUpdate,
  currentColumnIndex,
  columns,
}) {
  const {
    IT_Help_Ticket_ID,
    Request_Title,
    Description,
    Request_Date,
    Tag,
    Status,
    Status_ID,
    Priority,
    Agent_Name,
    Request_Method,
    Attachments_Count,
    Notes_Count,
  } = ticketData;

  const getNextColumn = (currIndex) => {
    const nextIndex = currIndex + 1;
    if (nextIndex > columns.length - 1) {
      return columns[currIndex];
    }
    const nextColumn = columns[nextIndex];

    if (nextColumn.visibilityCondition === false) {
      return nextIndex + 1 > columns.length + 1
        ? columns[currIndex]
        : getNextColumn(nextIndex);
    }

    return nextColumn;
  };
  const getPrevColumn = (currIndex) => {
    const prevIndex = currIndex - 1;
    if (prevIndex < 0) {
      // console.log('no previous column');
      return columns[currIndex];
    }
    const prevColumn = columns[prevIndex];

    if (prevColumn.visibilityCondition === false) {
      // console.log('column is hidden, retrieving prev column');
      return prevIndex - 1 < 0 ? columns[currIndex] : getPrevColumn(prevIndex);
    }

    return prevColumn;
  };

  // const [details, setDetails] = useState([]);

  // useEffect(() => {
  //   setDetails([
  //     {
  //       label: "Request Date:",
  //       value: !ticketData.Request_Date
  //         ? "Invalid Date"
  //         : new Date(ticketData.Request_Date).toLocaleDateString("en-us", {
  //             month: "short",
  //             day: "numeric",
  //             year: "numeric",
  //           }),
  //     },
  //     {
  //       label: "Tag",
  //       value: ticketData.Tag ?? "Unknown",
  //     },
  //     {
  //       label: "Status",
  //       value: ticketData.Status ?? "Unknown",
  //     },
  //     {
  //       label: "Priority",
  //       value: ticketData.Priority ?? "Unknown",
  //     },
  //     {
  //       label: "Agent",
  //       value: ticketData.Agent_Name ?? "Unknown",
  //     },
  //     {
  //       label: "Request Method",
  //       value: ticketData.Request_Method ?? "Unknown",
  //     },
  //   ]);
  // }, [ticketData]);

  // const details =

  const ticketClassList = [];
  const priorityClasses = ["critical", "high", "medium", "low"];
  if (Priority) ticketClassList.push(priorityClasses[parseInt(Priority) - 1]);
  if (Status_ID === 3) ticketClassList.push("complete");

  // const currColumn = columns[currentColumnIndex];
  const getCurrNextColumnStatus = () => {
    const nextCol = getNextColumn(currentColumnIndex);
    return nextCol.status;
  };
  const getCurrPrevColumnStatus = () => {
    const prevCol = getPrevColumn(currentColumnIndex);
    return prevCol.status;
  };

  return (
    <div className="ticket-container">
      <div
        className={
          "ticket" +
          (ticketClassList.length ? ` ${ticketClassList.join(" ")}` : "")
        }
      >
        <h1 className="ticket-title" title={Request_Title}>
          {Request_Title}
        </h1>
        <div className="info-column">
          <div className="description-container">
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(Description) }}
            />
          </div>
          <div className="details-grid">
            <div className="detail">
              <div className="label">Request Date:</div>
              <div className="value">
                {!Request_Date
                  ? "Invalid Date"
                  : new Date(Request_Date).toLocaleDateString("en-us", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
              </div>
            </div>
            <div className="detail">
              <div className="label">Tag:</div>
              <div className="value">{Tag}</div>
            </div>
            <div className="detail">
              <div className="label">Status:</div>
              <div className="value">{Status}</div>
            </div>
            <div className="detail">
              <div className="label">Priority:</div>
              <div className="value">{Priority}</div>
            </div>
            <div className="detail">
              <div className="label">Agent:</div>
              <div className="value">{Agent_Name}</div>
            </div>
            <div className="detail">
              <div className="label">Request Method:</div>
              <div className="value">{Request_Method}</div>
            </div>
            {/* {details.map((detail, i) => {
              return (
                <div className="detail" key={i}>
                  <p className="label">{detail.label}</p>
                  <p className="value">{detail.value}</p>
                </div>
              );
            })} */}
          </div>
        </div>
        <div className="button-container-column">
          <div className="button-container-row">
            <button className="icon-button xl green" title="Complete Ticket">
              <IoCheckmarkCircle />
            </button>
            <button className="icon-button xl red" title="Close Ticket">
              <IoCloseCircle />
            </button>
          </div>
          <div className="button-container-row">
            <button
              className="icon-button l"
              title="Move Left"
              onClick={() =>
                handleTicketUpdate(
                  IT_Help_Ticket_ID,
                  "Status_ID",
                  getCurrPrevColumnStatus()
                )
              }
            >
              <FaArrowLeft />
            </button>
            <button
              className="icon-button l"
              title="Move Right"
              onClick={() =>
                handleTicketUpdate(
                  IT_Help_Ticket_ID,
                  "Status_ID",
                  getCurrNextColumnStatus()
                )
              }
            >
              <FaArrowRight />
            </button>
          </div>
          {/* <a href={`https://my.pureheart.org/mp/331-3315/${IT_Help_Ticket_ID}`} target="_blank" className="link-button">View on MP</a> */}
          <div style={{ marginTop: "auto" }}>
            <button
              className="icon-button m"
              title={`View ${Notes_Count} Note${Notes_Count === 1 ? "" : "s"}`}
            >
              <FaRegComment /> {Notes_Count}
            </button>
            <button
              className="icon-button m"
              title={`View ${Attachments_Count} Attachment${
                Attachments_Count === 1 ? "" : "s"
              }`}
            >
              <ImAttachment /> {Attachments_Count}
            </button>
          </div>
          {/* <div className="button-container-row bottom">
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Ticket;
