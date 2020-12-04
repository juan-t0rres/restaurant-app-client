import { useState, useEffect } from "react";
import {
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Grid,
  Divider,
  Paper
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import axios from "axios";

export default function HomePage(props) {
  const [menu, setMenu] = useState(null);
  const [searchText, setSearchText] = useState("");

  function validSearch(text, name) {
    if (name.indexOf(text) === 0) return true;
    const split = name.split(" ");
    for (const word of split) {
      if (word.indexOf(text) === 0) return true;
    }
    return false;
  }

  function search(event) {
    const text = event.target.value;
    setSearchText(text);
    const newMenu = [...menu];
    for (const category of newMenu) {
      let visible = false;
      for (const item of category.items) {
        item.hidden = !validSearch(text.toLowerCase(), item.name.toLowerCase());
        if (!item.hidden) visible = true;
      }
      category.hidden = !visible;
    }
    setMenu(newMenu);
  }

  useEffect(() => {
    axios.get("/api/menu").then((menu) => {
      const arr = menu.data;
      const entrees = arr.filter((item) => item.category === "entrees");
      const sides = arr.filter((item) => item.category === "sides");
      const appetizers = arr.filter((item) => item.category === "appetizers");
      const desserts = arr.filter((item) => item.category === "desserts");

      setMenu([
        { id: 100, name: "entrees", items: entrees },
        { id: 200, name: "sides", items: sides },
        { id: 300, name: "appetizers", items: appetizers },
        { id: 400, name: "desserts", items: desserts },
      ]);
    });
  }, []);

  return (
    <div className="home">
      <TextField
        fullWidth
        variant="outlined"
        label="Search for an item"
        onChange={search}
        value={searchText}
        style={{ marginBottom: 30, backgroundColor: "#fff" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {menu &&
        menu.map((category) => {
          return (
            <Paper
              style={category.hidden ? { display: "none" } : {}}
              key={category.id}
              className="category"
            >
              <h1>{category.name}</h1>
              <Divider style={{ marginBottom: 30 }} />
              <Grid container direction="row" justify="center" spacing={2}>
                {category.items.map((item) => (
                  <Grid
                    style={item.hidden ? { display: "none" } : {}}
                    key={item.id}
                    item
                  >
                    <Card elevation={5} className="menu-item">
                      <CardMedia className="menu-item-img" image={item.url} />
                      <CardContent>
                        <Typography
                          color="inherit"
                          gutterBottom
                          variant="body1"
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          color="inherit"
                          variant="body2"
                          component="p"
                        >
                          ${item.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton
                          color="inherit"
                          onClick={() => props.addToCart(item)}
                        >
                          <AddShoppingCartIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          );
        })}
    </div>
  );
}
