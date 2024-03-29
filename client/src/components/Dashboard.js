import React, { useContext, useEffect, useState } from "react";
// import "./../components/dashboard.css"
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import StripeCheckout from "react-stripe-checkout";


const Dashboard = () => {


    const [product, setproduct] = useState({
        name :"Give me FUND",
        price:10,
        productBy: "Give Me Fund Inc.",
      })
    
      const makePayment = token => {
        const body = {
          token,
        }
        const headers ={
          "Content-Type": "application/json"
        }
        return fetch(`http://localhost:8080/payment`,{
          method:"POST",
          headers,
          body:JSON.stringify(body)
        }).then(response =>{
          console.log("RESPONSE",response);
          const {status} = response;
          console.log("STATUS",status);
        })
        .catch(error => console.log(error))
      }





  const { logindata, setLoginData } = useContext(LoginContext);

  const [data, setData] = useState(false);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      history("*");
    } else {
      console.log("user verify");
      setLoginData(data);
      history("/dash");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <>
      {data ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          <img
            src="./man.png"
            style={{ width: "25px", marginTop: 5, marginLeft:625,marginBottom:5, alignItems:"end", justifyContent:"left" }}
            alt=""
          />
          <h1>User Name:{logindata ? logindata.ValidUserOne.fname : ""}</h1>
          &nbsp;
          &nbsp;
          &nbsp;
          <h2>User Email: {logindata ? logindata.ValidUserOne.email : ""}</h2>
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    
      <section className="bg-black text-white flex items-center justify-center">
        
        <div class="content">
          {/* <nav>
           <li>
               <ul>
                   <a href=""></a>
               </ul>
           </li>
       </nav> */}

          <h2 className="text-2xl mb-4">
            <span className="text-blue-500 text-2xl font-bold">Need Funds</span>{" "}
            For Your <br></br>Medical Treatment?
          </h2>
          <h4 className="mb-4">
            Don't worry you've come to the right platform.
          </h4>
          <hr className="bg-white text-white"></hr>
          <p className="mt-4">
            With 0%* platform fee, you can raise funds too!{" "}
          </p>
          <br></br>
          <br></br>

          <StripeCheckout
            stripeKey="pk_test_51OqeyCSCVcOtAboHV4gtgH5TDvhRwoxhi6qEPz7AReQS36JCFmB17dcOPToFRoGw64z14kfphH85W0x44nfvRV9t00oH2a4YoG"
            token={makePayment}
            name="Stripe"
            amount={10000}
          >
            <button className="flex items-center justify-center mt-6 border rounded-xl text-gray-950 px-5 py-3  bg-blue-300 hover:bg-blue-950 hover:text-blue-400">
              Start A Free fundraiser
            </button>
          </StripeCheckout>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
