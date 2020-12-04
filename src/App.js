import "./App.css";
import { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Collapse,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import Cart from "./components/Cart";
import { Route, Link } from "react-router-dom";
import HomePage from "./routes/HomePage";
import EmployeePage from "./routes/EmployeePage";
import Orders from "./routes/Orders";
import Authentication from "./routes/Authentication";
import { UserContext } from "./auth/UserProvider";
import axios from "axios";

function App() {
  const user = useContext(UserContext);
  const [order, setOrder] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];
    localStorage.setItem("cart", JSON.stringify(cart));
    setOrder(cart);
  }, []);

  function addToCart(item) {
    if (!user.loggedIn) {
      setOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const newOrder = [...order, item];
    setOrder(newOrder);
    localStorage.setItem("cart", JSON.stringify(newOrder));
  }

  function removeFromCart(index) {
    const newOrder = [...order];
    newOrder.splice(index, 1);
    setOrder(newOrder);
    localStorage.setItem("cart", JSON.stringify(newOrder));
  }

  function clearCart() {
    setOrder([]);
    localStorage.setItem("cart", JSON.stringify([]));
  }

  function checkOut() {
    setLoading(true);
    setTimeout(async () => {
      const response = await axios.post("/api/orders", {
        cart: order,
        userId: user.id,
      });
      setLoading(false);
      if (response.data.error) {
        setError(true);
        return;
      }
      clearCart();
      window.location = "/orders";
    }, 2000);
  }

  return (
    <div>
      <AppBar position="sticky" className="appbar">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            component={Link}
            to="/"
          >
            <HomeIcon />
          </IconButton>
          <Typography className="title" variant="h4">
            GRUBUP
          </Typography>
          {user.loggedIn && !user.isEmployee && (
            <Button color="inherit" href="/orders">
              My Orders
            </Button>
          )}
          {user.loggedIn ? (
            <Button
              onClick={() => {
                user.logOut();
              }}
              color="inherit"
            >
              Log Out
            </Button>
          ) : (
            <>
              <Button href="/login" color="inherit">
                Login
              </Button>
              <Button href="/signup" color="inherit">
                Sign Up
              </Button>
            </>
          )}
          {user.loggedIn && !user.isEmployee && (
            <Cart
              checkOut={checkOut}
              clearCart={clearCart}
              removeFromCart={removeFromCart}
              order={order}
              loading={loading}
            />
          )}
        </Toolbar>
      </AppBar>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          You must be logged in to add something to your cart!
        </Alert>
      </Collapse>
      <div className="content">
        <Route exact path="/">
          {user.isEmployee ? (
            <EmployeePage />
          ) : (
            <HomePage addToCart={addToCart} />
          )}
        </Route>
        <Route path="/orders">
          <Orders />
        </Route>
        <Route path="/login">
          <Authentication />
        </Route>
        <Route path="/signup">
          <Authentication signUp />
        </Route>
      </div>
    </div>
  );
}

export default App;
