import React, { useState ,useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import {Card, Row, Nav, Navbar} from 'react-bootstrap';

const USERQUOTE_LIST_QUERY = gql`
query userpost($userid: ID){
    posts(userid: $userid) {
      post
      datetime
    }
  }   
`;

function MyPosts () {
    const [userdata, setName] = useState([])
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

    useEffect(() => {
        getProfile();
    }, []);
    
    let { loading, data } = useQuery(USERQUOTE_LIST_QUERY,{variables: {userid: userdata.id}});
    
    if(!loading && data && data.posts){
        return (
                <div>
                    <Row>
                        <Navbar  fixed="top" bg="light" variant="light" className= "mb-5">
                            <Navbar.Brand>Quotationary</Navbar.Brand>
                            <Nav className="mr-auto">
                                <Nav.Link href="/home">Home</Nav.Link>
                                <Nav.Link href="/myPosts">My Posts</Nav.Link>
                            </Nav> 
                        </Navbar>
                    </Row>
                    <Row className="mt-5">
                        {data.posts && data.posts.map((item, index)=>{
                                return(
                            <div key = {index} className = "mt-1" style={{ width:'60rem'}}>
                                <Card>
                                    <Card.Body>
                                    <Card.Text>
                                        {item.post}
                                    </Card.Text>
                                    <Card.Text>
                                        <small className="text-muted">{item.datetime}</small>
                                    </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                            )    
                        })}
                    </Row>
                </div>  
            );
        }
    else{
        return(<h1>Loading...</h1>)
        }
    }

export default MyPosts;
