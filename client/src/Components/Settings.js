import React, { Component } from 'react';
import './Styles/Settings.css';

class Settings extends Component {
  componentDidMount() {
    console.log('cdm')
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.updatesn(this.sn.value);
  }

  render() {
    const { user } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className="Settings">
        <label>Change your Screenname: (Currently {user.sn})</label>
        <input 
          type="text" 
          ref={(input) => this.sn = input} 
          placeholder="New Screenname" />     
        <input
          type="submit"
          value="Change Screenname" />   
      </form>
    )
  }
}
export default Settings;
