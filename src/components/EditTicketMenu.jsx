import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { LoadingContext } from "../auth/ProtectedRoute";
import { getToken } from "../auth";

const getTableDetails = async (table) => {
  // console.log(onlyMyTickets)
  return await axios({
    method: "get",
    url: `https://my.pureheart.org/ministryplatformapi/tables/${table}`,
    headers: {
      Authorization: `Bearer ${await getToken()}`,
      "Content-Type": "Application/JSON",
    },
  }).then((response) => response.data);
};
function zeroOutSecondsAndMilliseconds(datetimeStr) {
  if (!datetimeStr) return null;
  return datetimeStr.replace(/:\d{2}\.\d{3}/, ":00.000");
}

function EditTicketMenu({
  showEditMenu,
  setShowEditMenu,
  ticketFields,
  ticketToEdit,
  ticketMissingFields,
  updateTickets,
}) {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [ticketInputElements, setTicketInputElements] = useState({});
  const [fieldOptionLabels, setFieldOptionLabels] = useState({});
  const [missingFields, setMissingFields] = useState(
    ticketMissingFields.map((field) => field.Ticket_Field)
  );

  useEffect(() => {
    if (!showEditMenu) return;
    setTicketInputElements({});
    setFieldOptionLabels({});

    ticketFields.forEach((field, i) => {
      const {
        Ticket_Field,
        Ticket_Label_Field,
        // Table_Name,
        Table_Label_Name,
        Table_Value_Name,
        Input_Label,
        Input_Type,
      } = field;
      const tempFieldOptionLabels = {};

      if (!field.Table_Name) {
        const element = (
          <div
            className={`${
              missingFields.includes(Ticket_Field) ? "required" : ""
            } edit-ticket-input`}
            key={i}
          >
            <label htmlFor={Ticket_Field}>{Input_Label}</label>
            <input
              type={Input_Type}
              id={Ticket_Field}
              name={Ticket_Field}
              defaultValue={
                Input_Type === "datetime-local"
                  ? zeroOutSecondsAndMilliseconds(ticketToEdit[Ticket_Field])
                  : ticketToEdit[Ticket_Field]
              }
            />
          </div>
        );

        setTicketInputElements((old) => ({ ...old, [Ticket_Field]: element }));
        return;
      }

      getTableDetails(field.Table_Name).then((data) => {
        // console.log(ticketToEdit[Ticket_Field] ?? data[0][Table_Value_Name]);
        const element = (
          <div
            className={`${
              missingFields.includes(Ticket_Field) ? "required" : ""
            } edit-ticket-input`}
            key={`input-${i}`}
          >
            <label htmlFor={Ticket_Field}>{Input_Label}</label>
            <select
              id={Ticket_Field}
              name={Ticket_Field}
              defaultValue={
                ticketToEdit[Ticket_Field] ?? data[0][Table_Value_Name]
              }
              // value={ticketToEdit[Ticket_Field] ?? data[0][Table_Value_Name]}
            >
              {data.map((value, j) => {
                if (!tempFieldOptionLabels[Ticket_Field]) {
                  tempFieldOptionLabels[Ticket_Field] = {
                    Ticket_Label_Field: Ticket_Label_Field,
                    Labels: {},
                  };
                }
                tempFieldOptionLabels[Ticket_Field].Labels[
                  value[Table_Value_Name]
                ] = value[Table_Label_Name];

                return (
                  <option
                    value={value[Table_Value_Name]}
                    key={`${Ticket_Field}-${j}`}
                  >
                    {value[Table_Label_Name]}
                  </option>
                );
              })}
            </select>
          </div>
        );

        setTicketInputElements((old) => ({ ...old, [Ticket_Field]: element }));
      });

      setFieldOptionLabels(tempFieldOptionLabels);
    });
  }, [showEditMenu, ticketFields, ticketToEdit, missingFields]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    for (const [key, value] of formData) {
      ticketToEdit[key] = isNaN(value) ? value : parseInt(value);
      if (fieldOptionLabels[key]) {
        ticketToEdit[fieldOptionLabels[key].Ticket_Label_Field] =
          fieldOptionLabels[key].Labels[value];
      }
    }

    setShowEditMenu(false);
    startLoading();
    updateTickets([ticketToEdit])
      .then(() => {
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  const handleClose = () => {
    setTicketInputElements({});
    setFieldOptionLabels({});
    setMissingFields([]);
    setShowEditMenu(false);
  };

  return (
    showEditMenu && (
      <div id="edit-menu-container" onClick={() => handleClose()}>
        <form
          id="edit-menu"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          {/* <h3>{ticketToEdit.IT_Help_Ticket_ID}</h3> */}
          <h3>These are the fields you are missing:</h3>

          {Object.values(ticketInputElements).map((element) => element)}

          <div className="button-container">
            <button type="button" onClick={() => handleClose()}>
              Cancel
            </button>
            <button type="submit">Confirm</button>
          </div>
        </form>
      </div>
    )
  );
}

export default EditTicketMenu;
