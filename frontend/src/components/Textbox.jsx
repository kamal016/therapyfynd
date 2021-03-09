import React, {  Component } from 'react';
import { toast } from "react-toastify";

import ReactBootstrap,{
    Form, Button
    } from 'react-bootstrap';

class Textbox extends Component {
    
    constructor(){
        super();
        this.state={ text:''}
    }

    handleChange = event =>{
    this.setState({ 'text':event.target.value })
    }
    handleSubmit = async event =>{
        event.preventDefault();
        try{
            const data = { post:this.state.text, id: this.props.id, username: this.props.name}
            const response = await fetch(
                "http://localhost:5000/home/post",
                {
                    method: "POST",
                    headers: {
                    "Content-type": "application/json",
                    jwt_token: localStorage.token
                    },
                    body: JSON.stringify(data) 
                });
            response.status=== 200 ? toast.success("Posted Successfully") : toast.error("Try again");
            
            this.setState({ 'text': '' });
            event.target.reset();
        }catch (err) {
                  console.error(err.message);
                }

    }

    render() { 

        return ( 
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="Textarea" name ="textbox"  style={{ width:'30rem'}}>
                        <Form.Label>Write your Quote.</Form.Label>
                        <Form.Control required as="textarea" onChange={this.handleChange} rows={3} maxLength="200" />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
         );
    }
}
 
export default Textbox;