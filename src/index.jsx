import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
// import logger from "redux-logger";
import rootReducer from "./Component/reducers";
import App from "./App";
import './index.css'

const store = createStore(rootReducer); //,applyMiddleware(logger)
const AppWithRouter = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
ReactDOM.render(<AppWithRouter />, document.getElementById("root"));

