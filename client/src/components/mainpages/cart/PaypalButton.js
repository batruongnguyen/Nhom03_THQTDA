import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";

export default function PaypalButton(props) {
  const [error, setError] = useState(null);
  const [paidfor, setPaidfor] = useState(false);

  const handleAprove = (orderID) => {
    setPaidfor(true);
  };

  if (paidfor) {
    alert("Thanh toán thành công!");
  }

  if (error) {
    alert(error);
  }

  async function createOrder(data, actions) {
    const result = await axios.get(
      "https://api.apilayer.com/fixer/latest?apikey=9GNJ2LAcNXX7qVSTbYgZ3JwxJjSto8q4&base=VND&symbols=USD"
    );
    console.log("Test: ", result);
    if (result.data.success) {
      console.log("Rate from API: ", result.data);
      var rate = result.data.rates.USD;
      console.log("Rate from API: ", rate);
    } else {
      rate = 0.000040298207;
      console.log("Can not get rate from");
    }
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: (Math.round(props.amount * rate * 100) / 100).toFixed(2),
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AQjUPdBdq6NtuZE419hwUR5dhXxMS_I4JFsZSU2C2OSsde9yAwTG2BJNOGCxxXdPxoMTvU5qwsUvz4DD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "horizontal",
          color: "silver",
          height: 36,
          tagline: false,
        }}
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={async (data, actions) => {
          const order = await actions.order.capture();
          console.log("order", order.payer);
          if (order) {
            props.tranSuccess(order, data);

            handleAprove(data.orderID);
          }
        }}
        onCancel={(data) => {
          console.log("thanh toán đã bị huỷ bỏ!", data);
        }}
        onError={(err) => {
          setError(err);
          console.error("thanh toán không thành công", err);
        }}
      />
    </PayPalScriptProvider>
  );
}
