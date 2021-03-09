import React , { Fragment, useState, useEffect } from 'react';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { toast } from "react-toastify";

//components
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/Home";
import Myposts from "./components/myPosts";

toast.configure();

const client = new ApolloClient({
  uri: 'http://127.0.0.1:5000/graphql',
  cache: new InMemoryCache()
});

function App(){

  const checkAuthenticated = async () => {
    try {
      const res = await fetch("http://localhost:5000/authentication/verify", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseRes = await res.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  return(
    <ApolloProvider client={client}>
      <Fragment>
        <Router>
          <div className="container">
            <Switch>
              <Route
                exact path="/login"
                render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)}
              />
              <Route
                exact path="/register"
                render={props => !isAuthenticated ? (<Register {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)}
              />
              <Route
                exact path="/home"
                render={props => isAuthenticated ? (<Home {...props} setAuth={setAuth} />) : (<Redirect to="/login" />)}
              />
              <Route
              exact path="/"
              render={props => isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/login" />)}
              />
              <Route
              exact path="/myPosts"
              render={props => isAuthenticated ? (<Myposts {...props} setAuth={setAuth} />) : (<Redirect to="/myPosts" />)}
              />
              
            </Switch>
          </div>
        </Router>
      </Fragment>
    </ApolloProvider>
  )
}
 
export default App;

