import React, { useState ,useEffect} from 'react';
import Mynav from './Mynav'
import Textbox from './Textbox'
import Userslist from './Userslist'
import Quotelist from './quoteList'
import { toast } from "react-toastify";
import {Row, Col, Container} from 'react-bootstrap';


function Home({ setAuth }){

  const [data, setName] = useState([])
  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/home/", {
        method: "POST",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      setName(parseData);
    } catch (err) {
      console.error(err.message);
    }
  };
   const logout = e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };


useEffect(() => {
  getProfile();
}, []);

    return (
        <div>
            <Mynav name = {data.user_name} id= {data.id} logout = {logout} />
            <Container className="mt-5">
              <Row>
                <Col className="mt-5" md={8}>
                  <Row className="mt-5" md ={8}>
                    <Textbox name = {data.user_name} id= {data.id}  />
                  </Row>
                  <Row className="mt-5">
                    <Quotelist id= {data.id}/>
                  </Row>
                </Col>
                <Col className="mt-5" md={4}>
                  <Userslist  id={data.id} />
                </Col>
              </Row>
            </Container>
        </div>
    );
}

export default Home;
