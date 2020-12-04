import { useState, useContext } from "react";
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Divider,
  Button,
} from "@material-ui/core";
import axios from "axios";
import { UserContext } from "../auth/UserProvider";

export default function Authentication(props) {
  const isSignUp = props.signUp;
  const user = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function createUser() {
    if (confirmPassword !== password) {
      alert("Passwords do not match.");
      return;
    }
    const response = await axios.post("/api/users/signup", {
      name: name,
      email: email,
      password: password,
    });
    if (response && !response.data.error) {
      alert("Account successfully created!");
      window.location.href = "/login";
    } else if (response && response.data.error) {
      alert(response.data.error);
    } else {
      alert("Error signing up.");
    }
  }

  async function getUser() {
    const response = await axios.post("/api/users/login", {
      email: email,
      password: password,
    });
    const data = response.data;
    if (!data || data.error || !data.token) {
      alert("Incorrect credentials.");
      return;
    }
    user.setUser(response.data.token);
  }

  return (
    <Paper className="page" elevation={3}>
      <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
      <Divider style={{ marginTop: 0, marginBottom: 15 }} />
      <form className="form" autoComplete="off">
        <Grid container direction="column" spacing={1}>
          {isSignUp && (
            <Grid item>
              <TextField
                onChange={(e) => setName(e.target.value)}
                fullWidth
                label="Name"
                variant="outlined"
              />
            </Grid>
          )}
          <Grid item>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              label="Email"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") isSignUp ? createUser() : getUser();
              }}
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
            />
          </Grid>
          {isSignUp && (
            <Grid item>
              <TextField
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type="password"
              />
            </Grid>
          )}
        </Grid>
        <br />
        <center>
          <Button
            onClick={() => {
              isSignUp ? createUser() : getUser();
            }}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </center>
      </form>
    </Paper>
  );
}
