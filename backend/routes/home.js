const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../database.js");

router.post("/", authorize, async (req, res) => {
  try {
    let queryStr = `SELECT user_name,id FROM users WHERE id = '${req.user.id}';`
    const user = await pool.query(queryStr); 
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post('/post',authorize, async (req, res)=>{
  try{
      const timestamp = Date.now()
      let datetime = new Date();
      let query_str = `INSERT INTO posts (userid ,username ,post,timestamp, datetime) VALUES ('${req.body.id}','${req.body.username}', '${req.body.post.replace("'","")}','${timestamp}', '${datetime}')  RETURNING *`

      pool.query(query_str,(err, result)=>{
          if(err){
            res.status(400).send("not posted")
            console.log(err.stack);
          }
          else{
            res.status(200).send("posted")
          }
        })
  }catch(e){
    console.log(e);
  }
})

module.exports = router;