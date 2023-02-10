/* eslint-disable */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";



import { ProtectedRoute } from "./Component/authPath/protected.route";
import Layout from "./Component/structure/Layout";
import Page404 from "./Component/structure/Page404";
import auth from "./Component/authPath/auth";
import Login from "./Component/Login";
import Tracking from "./Component/Tracking";


export default function App() {
  const url = useLocation();
  const history = useHistory();

  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });

  useEffect(() => {
    if (url.pathname === "/") {
      if (auth.isAuthenticated()) {
        history.push("/Home");
      }
    }
  }, []);

  return (
    <>
      {/* <Router basename="/"> */}
      <Switch >
        <Route exact path="/" component={Login} />
        <Route path="/Page404" component={Page404} />
        <Route path="/Tracking/:id" component={Tracking} />
        <ProtectedRoute path="/Home" component={Layout} />
        {/* -- Error Page -- */}
        <Route path="*">
          <Redirect to="/Page404" />
        </Route>
      </Switch>
      {/* </Router> */}
    </>
  );
}
