import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router';
import './App.css';
import io from 'socket.io-client';
import Messages from './Components/Messages';
import MsgInput from './Components/MsgInput';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Header from './Components/Header';
import Nav from './Components/Nav';

class App extends Component {
  constructor() {
    super();
    this.state = {
      msg: null,
      messages: [],
      user: {
      }
    };
    this.socket = io();

    this.socket.on('message', message => {
      this.setState({
        messages: [...this.state.messages, message]
      });
    });
  }

  async componentDidMount() {
    const getRecentMessages = await fetch('/api/recentmessages');
    const parseMessages = await getRecentMessages.json();

    const formatMessages = parseMessages.messages.map( async message => {
      const userRes = await fetch(`/api/users/${message.user_id}`);
      const { user } = await userRes.json();

      return { msg: message.message, user};
    });

    const messages = await Promise.all(formatMessages);
    this.setState({ messages });

  }

  sendMessage = (msg) => {
    if (msg.length && this.state.user.sn) {
      this.socket.send({
        msg,
        user: this.state.user
      });
    }
  }

  signInUser = ({ user }) => {
    this.setState({ user });
    this.socket.emit('newuser', user);
  }

  signout = () => {
    this.socket.emit('signout', this.state.user);
    this.setState({ user: {} });
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <Header user={this.state.user} />
        <Nav signout={this.signout} user={this.state.user}/>
        <Switch>
          <Route path="/signin/signup" render={(props) => {
            return (
              <SignUp signInUser={this.signInUser} {...props}/>
            );
          }} />          
          <Route path="/signin" render={(props) => {
            return (
              <SignIn signInUser={this.signInUser} {...props}/>
            );
          }} />
          <Route path="/" render={(props) => {
            return (
              <Fragment>
                <Messages user={this.state.user} messages={this.state.messages} {...props}/>
                <MsgInput user={this.state.user} sendMessage={this.sendMessage}/>
              </Fragment>
            );
          }} />
        </Switch>
      </div>
    );
  }
}

export default App;
