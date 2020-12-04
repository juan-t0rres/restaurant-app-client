import { useState } from "react";
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemSecondaryAction,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CancelIcon from "@material-ui/icons/Cancel";

function Cart(props) {
  const { order, loading } = props;
  const [open, setOpen] = useState(false);
  const [checkOut, setCheckOut] = useState(false);

  function getTotal() {
    const sub = getSubtotal();
    const total = sub + sub * 0.065;
    return total.toFixed(2);
  }

  function getSubtotal() {
    let sum = 0;
    for (const item of order) {
      sum += item.price;
    }
    return sum;
  }

  return (
    <div className="cart">
      <Badge
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={order && order.length}
        color="secondary"
      >
        <IconButton
          className="menu-button"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={(event) => {
            if (order.length > 0) setOpen(true);
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
      </Badge>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 80, left: 999999999 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {order.map((item, index) => (
            <ListItem style={{ minWidth: 300 }} key={index * 999}>
              <ListItemAvatar>
                <Avatar src={item.url} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={"$" + item.price} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    if (order.length === 1) setOpen(false);
                    props.removeFromCart(index);
                  }}
                  edge="end"
                  aria-label="delete"
                >
                  <CancelIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => {
            setOpen(false);
            setCheckOut(true);
          }}
          style={{ width: "50%" }}
          disableElevation
          color="secondary"
        >
          Check Out
        </Button>
        <Button
          style={{ width: "50%" }}
          disableElevation
          color="primary"
          onClick={() => {
            props.clearCart();
            setOpen(false);
          }}
        >
          Clear
        </Button>
      </Popover>
      <Modal open={checkOut} onClose={() => setCheckOut(false)}>
        <div className="checkout-modal">
          <h1>Check Out</h1>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.map((item, index) => (
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
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              marginBottom: 10,
              textAlign: "center"
            }}
          >
            <Typography variant="body2" color="textPrimary">
              Subtotal: ${getSubtotal().toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textPrimary">
              Tax: ${(getSubtotal() * 0.065).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textPrimary"><b>Total: ${getTotal()}</b></Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="secondary"
              style={{ marginRight: 5 }}
              variant="contained"
              disableElevation
              disabled={loading}
              onClick={props.checkOut}
            >
              {loading ? (
                <CircularProgress color="secondary" size={20} />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button
              onClick={() => setCheckOut(false)}
              color="primary"
              style={{ marginLeft: 5 }}
              variant="contained"
              disableElevation
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Cart;
