import React from 'react';
import { gql, useQuery, useMutation} from '@apollo/client';
import{Card} from 'react-bootstrap';

const USERS_LIST_QUERY = gql`{
        users{
            id
            user_name
            following{
                followingid
                    }
                }
            }
        `;

let MutationQry = gql`mutation addFollow($userid: ID, $followingid: ID){
        addFollow(userid: $userid, followingid: $followingid) 
            {
                userid
                followingid
            }
        }`;

function Userslist(props) {
    const [mutationData] = useMutation(MutationQry)
    const { loading:userlist, data: userdata } = useQuery(USERS_LIST_QUERY);
    if(!userlist ){
    const myData= userdata.users.filter( i => i.id == props.id) || [],
    following = myData.length && myData[0].following || [],
    followedIds = following.length ? following.map(i => i.followingid) : [];
    return ( 
        <div>
            {userdata.users && userdata.users.map((item)=>{
                let isFollowed = followedIds.indexOf(''+item.id) > -1,
                style= Object.assign({color: '#0988c5', fontWeight: 500, cursor: 'pointer'}, isFollowed && {pointerEvents: 'none'});
                if(item.id == props.id){
                    return;
                }
                return (
                    <div key={item.id}>
                        <Card style={{width: '18rem'}}>
                            <Card.Body>
                            <Card.Title>{item.user_name}</Card.Title> 
                            <span style={style}  onClick={(e)=> {
                                setTimeout(()=> {
                                    window.location.reload()
                                }, 500);
                                e.preventDefault();
                                e.target.innerText = 'Followed'
                                mutationData({variables: {userid: props.id, followingid:item.id}})
                                }}>{isFollowed ? 'Followed' : 'Follow' } </span>
                        </Card.Body>
                        </Card>
                    </div>
                    )
                })}
            </div>
        );
    }else{
        return ( 
            <div>Loading....</div>
        )
    }
    
}

export default (Userslist);

