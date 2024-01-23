import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import { LoadingContext } from '../auth/ProtectedRoute';
import { getToken } from "../auth";

const getHaInformation = async () => {
    // console.log(onlyMyTickets)
    return await axios({
      method: "post",
      url: "https://my.pureheart.org/ministryplatformapi/procs/PHCGetHaMinistryQuestionInfo",
      data: {
        "@DaysBack": 100
      },
      headers: {
        "Authorization": `Bearer ${await getToken()}`,
        "Content-Type": "Application/JSON"
      }
    })
    .then(response => response.data)
  }

const Ha = () => {
    // const daysBack = 365
    const [questions, setQuestions] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [monthData, setMonthData] = useState([]);
    const [user, setUser] = useState({});
 
    const { startLoading, stopLoading } = useContext(LoadingContext);
 
    useEffect(() => {
      if (Cookies.get("user")) setUser(JSON.parse(Cookies.get("user")));
    }, []);
 
    useEffect(() => {
        if (user.userid) {
            startLoading();
          getHaInformation().then(data => {
            const [questions, weekData, monthData] = data;
            setQuestions(questions);
            setWeekData(weekData);
            setMonthData(monthData);
            
            stopLoading();
          }).catch(err => {
            console.log(err); //remove this in production but it's usefull for now
            stopLoading();
          })
        };
    }, [startLoading, stopLoading]);

    return (
        <div>
            <h1>Hello World!</h1>
            {questions.map((question, index) => (
                <div key={index}>
                    <h2>{question.Question_Title}</h2>
                    <p>{question.Question_Description}</p>
                </div>
            ))}
        </div>
    );
}

export default Ha