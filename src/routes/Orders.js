import { useEffect, useContext, useState } from "react";
import { UserContext } from "../auth/UserProvider";
import { Paper, Typography, LinearProgress } from "@material-ui/core";
import axios from "axios";

const statusMap = {
  "Received Order": 25,
  "Preparing Order": 50,
  "Order Done": 75,
  "Picked Up": 100
};

export default function Orders() {
  const user = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders/" + user.id).then((response) => {
      setOrders(response.data);
    });
  }, []);

  if (orders.length === 0) return <center><Typography variant="h2">You currently have no orders.</Typography></center>;

  return (
    <div style={{ width: "50%", margin: "0 auto 0 auto" }}>
      <h1>Orders</h1>
      {orders.map((order) => (
        <Paper key={order._id} className="category" elevation={0}>
          <h2>Order #{order._id.substring(order._id.length - 7).toUpperCase()}</h2>
          <LinearProgress style={{ marginTop: 10, marginBottom: 10 }} color="secondary" variant="determinate" value={statusMap[order.status]} />
          <Typography variant="h6" color="textPrimary"><b>Status: </b>{order.status}</Typography>
          <Typography variant="subtitle1" color="textSecondary"><b>Date:</b> {new Date(order.date).toUTCString()}</Typography>
          <Typography variant="subtitle1" color="textSecondary"><b>Total: </b>${order.total}</Typography>
        </Paper>
      ))}
    </div>
  );
}
