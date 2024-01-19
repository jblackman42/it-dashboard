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

function EditTicketMenu({
  showEditMenu,
  setShowEditMenu,
  editTicket,
  editTicketMissingFields,
  updateTickets,
}) {
  const { startLoading, stopLoading } = useContext(LoadingContext);
  const [ticketInputElements, setTicketInputElements] = useState([]);
  const [fieldOptionLabels, setFieldOptionLabels] = useState({});
  // const fieldOptionLabels = {};

  useEffect(() => {
    setTicketInputElements([]);
    const tempFieldOptionLabels = {};
    editTicketMissingFields.forEach((field, i) => {
      const {
        Ticket_Field,
        Ticket_Label_Field,
        Table_Name,
        Table_Label_Name,
        Table_Value_Name,
        Input_Label,
        Input_Type,
      } = field;

      if (!Table_Name) {
        const element = (
          <div className="edit-ticket-input" key={i}>
            <label htmlFor={Ticket_Field}>{Input_Label}</label>
            <input type={Input_Type} id={Ticket_Field} name={Ticket_Field} />
          </div>
        );
        setTicketInputElements((inputElems) => [...inputElems, element]);
        return;
      }

      startLoading();
      getTableDetails(Table_Name)
        .then((data) => {
          const element = (
            <div className="edit-ticket-input" key={i}>
              <label htmlFor={Ticket_Field}>{Input_Label}</label>
              <select id={Ticket_Field} name={Ticket_Field}>
                {data.map((value, i) => {
                  if (!tempFieldOptionLabels[Ticket_Field]) {
                    tempFieldOptionLabels[Ticket_Field] = {
                      Ticket_Label_Field: Ticket_Label_Field,
                      Labels: {},
                    };
                  }
                  tempFieldOptionLabels[Ticket_Field].Labels[
                    value[Table_Value_Name]
                  ] = value[Table_Label_Name];
                  // console.log(tempFieldOptionLabels);

                  return (
                    <option value={value[Table_Value_Name]} key={i}>
                      {value[Table_Label_Name]}
                    </option>
                  );
                })}
              </select>
            </div>
          );
          setTicketInputElements((inputElems) => [...inputElems, element]);
          stopLoading();
        })
        .catch((error) => {
          // console.log(error);
          stopLoading();
        });

      setFieldOptionLabels(tempFieldOptionLabels);
      //   console.log(field);
    });
    // setUser(JSON.parse(Cookies.get("user") ?? "{}"));
  }, [editTicketMissingFields, startLoading, stopLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    for (const [key, value] of formData) {
      console.log(key, value);
      // console.log(
      //   fieldOptionLabels[key].Ticket_Label_Field,
      //   fieldOptionLabels[key].Labels[value]
      // );
      editTicket[key] = isNaN(value) ? value : parseInt(value);
      if (fieldOptionLabels[key]) {
        editTicket[fieldOptionLabels[key].Ticket_Label_Field] =
          fieldOptionLabels[key].Labels[value];
      }
    }

    setShowEditMenu(false);
    startLoading();
    updateTickets([editTicket])
      .then(() => {
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    showEditMenu && (
      <div id="edit-menu-container" onClick={() => setShowEditMenu(false)}>
        <form
          id="edit-menu"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h3>{editTicket.IT_Help_Ticket_ID}</h3>
          <h3>These are the fields you are missing:</h3>
          {/* {editTicketMissingFields.map((field, i) => {
              return <p key={i}>{field.Input_Label}</p>;
            })} */}
          {ticketInputElements.map((element) => element)}
          <button type="button" onClick={() => setShowEditMenu(false)}>
            Cancel
          </button>
          <button type="submit">Confirm</button>
        </form>
      </div>
    )
  );
}

export default EditTicketMenu;
