import React, { useState, useEffect } from "react";
import Home from "../component/Home";
import Axios from "axios";
import Login from "../component/auth/Login";
import Signup from "../component/auth/Sign-in";
import Valid from "../component/auth/Valid";
import { HeaderLoggedin, HeaderLoggout } from "../component/layout/Header";
import Footer from "../component/layout/Footer";
import { Route, Switch } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Error from "../component/helpers/404";

const Init = (props) => {
  const [loggedin, setLoggedin] = useState(false);
  const login = () => {
    setLoggedin(!loggedin);
  };
  const logout = () => {
    setLoggedin(!loggedin);
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/users/checkLogin", {
      withCredentials: true,
    })
      .then((response) => {
        if (response.data.jwt) setLoggedin(true);
        else setLoggedin(false);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const [darkMode, setDarkMode] = useState(false);

  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container direction="column">
        <Grid item>
          {loggedin && (
            <HeaderLoggedin
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              logout={logout}
            />
          )}
          {!loggedin && (
            <HeaderLoggout darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </Grid>
        <Grid item container>
          {/* remove xs={0} for error google ghrome */}
          <Grid item sm={2} />
          <Grid item xs={12} sm={8}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/confirm/:cnfId" component={Valid} />
              <Route path="/Sign-up" component={Signup} />
              <Route path="/Login" component={() => <Login login={login} />} />
              <Route path="*" component={() => <Error isAuth={loggedin} />} />
            </Switch>
          </Grid>
          <Grid item sm={2} />
        </Grid>
        {/* <Grid item container>
        </Grid> */}
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Init;
