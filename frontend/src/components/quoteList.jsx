import React from 'react';
import { gql, useQuery } from '@apollo/client';

import {Card} from 'react-bootstrap';

const QUOTE_LIST_QUERY = gql`
query user($userid: ID){
    user(userid: $userid) {
      id
      user_name
      email
      followingPosts{
        username
        post
        datetime
      }
    }
  }   
`;

function Quotelist(props) {
    let { loading, data } = useQuery(QUOTE_LIST_QUERY,{variables: {userid: props.id}});

    if(!loading && data && data.user){
        const posts = data.user.followingPosts.filter(({post}) => post && post.trim() != '' );
       
        const logs= posts.map((item,index) => {
            return <Card className="mr-3" key={index}>
                <Card.Body>
                    <blockquote className="blockquote mb-0">
                    <p>
                        {item.post}
                    </p>
                    <footer className="blockquote-footer">
                        {item.username +" : "} <cite title="Source Title">{item.datetime}</cite>
                    </footer>
                    </blockquote>
                </Card.Body>
            </Card>
        });
        return <div>{logs}</div>
    }
    else{
        return(<div>Loading...</div>)
    }
}
 
export default Quotelist;