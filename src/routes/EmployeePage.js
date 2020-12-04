import { useEffect, useState, useContext } from "react";
import {
  Paper,
  LinearProgress,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { UserContext } from "../auth/UserProvider";

const statusMap = {
  "Received Order": 25,
  "Preparing Order": 50,
  "Order Done": 75,
  "Picked Up": 100,
};

export default function EmployeePage() {
  const [orders, setOrders] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    axios.get("/api/orders/").then((response) => {
      setOrders(response.data);
    });
  }, []);

  function orderChange(event, index) {
    if (event.target.value === orders[index].status) return;
    const newOrders = [...orders];
    newOrders[index].newStatus = event.target.value;
    setOrders(newOrders);
  }

  async function saveChanges(index) {
    const order = orders[index];
    console.log(order._id);
    const response = await axios.post("/api/orders/" + order._id, { userId: user.id, status: order.newStatus });
    const data = response.data;
    if (data.error) alert(data.error);
    else window.location.reload();
  }

  return (
    <div style={{ width: "60%", margin: "0 auto 0 auto", minWidth: 700 }}>
      <h1>Orders</h1>
      {orders.map((order, orderIndex) => (
        <Paper key={order._id} className="category" elevation={0}>
          <h2>
            Order #{order._id.substring(order._id.length - 7).toUpperCase()}
          </h2>
          <LinearProgress
            style={{ marginTop: 10, marginBottom: 10 }}
            color="primary"
            variant="determinate"
            value={statusMap[order.status]}
          />
          <div style={{ margin: 20 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="center">
                      {item.category.charAt(0).toUpperCase() +
                        item.category.slice(1)}
                    </TableCell>
                    <TableCell align="right">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Typography variant="h6" color="textPrimary">
            <b>Status: </b>
            <Select
              style={{ minWidth: 150, margin: 5 }}
              labelId="select-label"
              id="select"
              value={order.newStatus ? order.newStatus : order.status}
              onChange={(e) => orderChange(e, orderIndex)}
            >
              <MenuItem value="Received Order">Received Order</MenuItem>
              <MenuItem value="Preparing Order">Preparing Order</MenuItem>
              <MenuItem value="Order Done">Order Done</MenuItem>
              <MenuItem value="Picked Up">Picked Up</MenuItem>
            </Select>
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <b>Date:</b> {new Date(order.date).toUTCString()}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            <b>Total: </b>${order.total}
          </Typography>
          {order.newStatus && order.newStatus !== order.status && (
            <Button
              onClick={() => saveChanges(orderIndex)}
              disableElevation
              style={{ marginTop: 30 }}
              variant="contained"
              color="secondary"
            >
              Save Changes
            </Button>
          )}
        </Paper>
      ))}
    </div>
  );
}
