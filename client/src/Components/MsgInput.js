import React, { Component } from 'react';
import './Styles/MsgInput.css';

class MsgInput extends Component {
  constructor() {
    super();
    this.state = {
      msg: ''
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.sendMessage(this.state.msg);

    this.setState({ msg: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="MsgInput">
        <input onChange={this.handleChange} type="text" placeholder="Enter your message" value={this.state.msg} name="msg" />
        <input onClick={this.handleSubmit} type="submit" value="Send Message" />
      </form>
    );
  }
}
export default MsgInput;