import React, { useState, useEffect } from "react";
import axios from "axios";

// import { LoadingContext } from "../auth/ProtectedRoute";
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
}) {
  const [ticketInputElements, setTicketInputElements] = useState([]);

  useEffect(() => {
    setTicketInputElements([]);
    editTicketMissingFields.forEach((field) => {
      const {
        Ticket_Field,
        Table_Name,
        Table_Label_Name,
        Table_Value_Name,
        Input_Label,
        // Input_Type
      } = field;
      getTableDetails(Table_Name)
        .then((data) => {
          const element = (
            <div className="edit-ticket-input" key={Table_Name}>
              <label htmlFor={Ticket_Field}>{Input_Label}</label>
              <select id={Ticket_Field}>
                {data.map((value, i) => {
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
        })
        .catch((error) => {
          console.log(error);
        });
      //   console.log(field);
    });
    // setUser(JSON.parse(Cookies.get("user") ?? "{}"));
  }, [editTicketMissingFields]);

  return (
    showEditMenu && (
      <>
        <div id="edit-menu-container" onClick={() => setShowEditMenu(false)}>
          <div id="edit-menu" onClick={(e) => e.stopPropagation()}>
            <h3>{editTicket.IT_Help_Ticket_ID}</h3>
            <h3>These are the fields you are missing:</h3>
            {/* {editTicketMissingFields.map((field, i) => {
              return <p key={i}>{field.Input_Label}</p>;
            })} */}
            {ticketInputElements.map((element) => element)}
          </div>
        </div>
      </>
    )
  );
}

export default EditTicketMenu;
