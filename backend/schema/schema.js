const graphql = require("graphql")
const pool = require("../database.js");
const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = graphql;

const PostType = new GraphQLObjectType({
    name:'Posts',
    fields:()=>({
        userid:{type: GraphQLString},
        username:{type: GraphQLString},
        post:{type: GraphQLString},
        timestamp: {type: GraphQLString},
        datetime:{type: GraphQLString},
    })
});

const FollowPostType = new GraphQLObjectType({
    name:'FollowPost',
    fields:()=>({
        username: {type: GraphQLString},
        post:{type: GraphQLString},
        datetime:{type: GraphQLString},
    })
})


const UsersType = new GraphQLObjectType({
    name:'Users',
    fields:()=>({
        id:{type: GraphQLID},
        user_name: {type: GraphQLString},
        email: {type: GraphQLString},
        timestamp:{type: GraphQLString},
        following:{
            type: new GraphQLList(FollowType),
            resolve: async(parent, args)=>{
                try{
                    let postList = await pool.query(`SELECT userid, followingid, timestamp FROM follow WHERE userid = '${parent.id}'`)
                    return(postList.rows); 
                }catch(e){
                    console.log("Fetch time  error invalid",e);
                }  

            }
        },
        followingPosts:{
            type: new GraphQLList(FollowPostType),
            resolve: async(parent, args)=>{
                try{
                    let postList = await pool.query(`SELECT p.username, post, datetime
                                                        FROM follow AS f
                                                        FULL JOIN posts AS p
                                                        ON p.userid = f.followingid
                                                        where f.userid = '${parent.id}'
                                                        order by p.timestamp desc
                                                        limit 30 `)
                    return(postList.rows); 
                }catch(e){
                    console.log(e);
                }    
            }
        }
    })
});

const FollowType = new GraphQLObjectType({
    name:'follow',
    fields:()=>({
        userid:{type: GraphQLString},
        followingid: {type: GraphQLString},
        followPost:{
            type: new GraphQLList(FollowPostType),
            resolve: async(parent, args)=>{
                try{
                    let postList = await pool.query(`SELECT p.username, post, datetime
                                                        FROM follow AS f
                                                        FULL JOIN posts AS p
                                                        ON p.userid = f.followingid
                                                        where f.userid = '${parent.userid}'
                                                        order by p.timestamp desc
                                                        limit 30 `)
                    return(postList.rows); 
                }catch(e){
                    console.log(e);
                }    

            }

        }
        
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:() => ({
        follow:{
            type: new GraphQLList(FollowType),
            args: {userid:{type: GraphQLID}},
            resolve: async (parent, args) =>{
                try{
                    let postList = await pool.query(`SELECT userid, followingid FROM follow WHERE userid = '${args.userid}'`)
                    return(postList.rows); 
                }catch(e){
                    console.log(e);
                }           
            }
        },
        posts:{
            type: new GraphQLList(PostType),
            args: {userid:{type: GraphQLID}},
            resolve: async (parent, args) =>{
                try{
                    let postList = await pool.query(`SELECT userid, username, post, timestamp, datetime FROM posts WHERE userid = '${args.userid}' ORDER BY timestamp DESC`)
                    console.log(postList.rows[0], args)
                    return(postList.rows); 
                }catch(e){
                    console.log(e);
                }           
            }
        },

        users:{
            type: new GraphQLList(UsersType),
            resolve: async (parent, args)=>{
                try{
                    let user = await pool.query(`SELECT id, user_name,  email, timestamp FROM users`)
                    return(user.rows); 
                }catch(e){
                    console.log(e);
                }
            }
        },
        user:{
            type: UsersType,
            args:{userid:{type: GraphQLID}},
            resolve: async (parent, args)=>{
                try{
                    let user = await pool.query(`SELECT id, user_name,  email, timestamp FROM users WHERE id = '${args.userid}'`)
                    return(user.rows[0]); 
                }catch(e){
                    console.log("Loading");
                }
            }
        }
    })
});

const Mutation = new GraphQLObjectType(
    {
        name: 'Mutation',
        fields: {
        addPost: {
            type: PostType,
            args: {
                userid:{type: GraphQLID},
                username:{type: GraphQLID},
                post:{type: GraphQLString}

            },
            resolve : async (parent, args)=>{
                try{
                    const timestamp = Date.now()
                    let datetime = new Date();
                    let postList = await pool.query(`INSERT INTO posts (userid, username ,post,timestamp, datetime) VALUES ('${args.userid}','${args.username}', '${args.post.replace("'","")}','${timestamp}', '${datetime}')  RETURNING *`)
                    console.log(postList.rows[0]);
                    return(postList.rows[0]); 
                }catch(e){
                    console.log(e);
                }
            }
        },
        addFollow: {
            type: FollowType,
            args: {
                userid:{type: GraphQLID },
                followingid:{type:  GraphQLID}
            },
            resolve : async (parent, args)=>{
                try{
                    const timestamp = Date.now()
                    
                    let response = await pool.query(`INSERT INTO follow (followingid, userid, timestamp) VALUES ('${args.followingid}', '${args.userid}', '${timestamp}') RETURNING *`)
                    return(response.rows[0]); 
                }catch(e){
                    console.log(e);
                }
            }
        },

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});