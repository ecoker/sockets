import React from 'react';
var io = require('socket.io-client');

/* STYLES */
import '../../styles/base.scss';

/* COMPONENTS */
import Name from './name.js';
import Chatty from './chatty.js';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      name: null,
      publicMessages:[],
      privateMessages:[],
      selfMessages:[],
      roomMessages:[],
      connectedUsers: {},
      privateConversationSocketId: null,
      currentRoom:'default'
    };
    this.socket = io('http://localhost:3000');
    this.patch = require('socketio-wildcard')(io.Manager);
    this.patch(this.socket);
    this.socket.on('*', this.socketEvents);
  }
  socketEvents = (socketEvent) => {
    var name    = socketEvent.data[0];
    var payload = socketEvent.data[1];
    switch(name) {
      case 'name':
        this.setState({
            name: payload
        })
        break;
      case 'public':
        var messages = this.state.publicMessages;
        messages.push(payload);
        this.setState({
            publicMessages: messages
        })
        break;
      case 'private':
        var messages = this.state.privateMessages;
        messages.push(payload);
        this.setState({
            privateMessages: messages
        })
        break;
      case 'self':
        var messages = this.state.selfMessages;
        messages.push(payload);
        this.setState({
            selfMessages: messages
        })
        break;
      case 'users':
        var privateConversationSocketId = (this.state.privateConversationSocketId && payload[privateConversationSocketId]) ?
          this.state.privateConversationSocketId
          : Object.keys(payload)[0];
        this.setState({
            connectedUsers: payload,
            privateConversationSocketId: privateConversationSocketId
        })
        break;
      case 'change-room':
        this.setState({
          currentRoom: payload
        })
        break;
      case 'room':
        var messages = this.state.roomMessages;
        messages.push(payload.message);
        this.setState({
            roomMessages: messages
        })
        break;
      default:
        console.log('no handler');
    }
  }
  sendPublicMessage = (ev) => {
    ev.preventDefault();
    this.socket.emit('public', 'new public message');
  }
  sendPrivateMessage = (ev) => {
    ev.preventDefault();
    this.socket.emit('private', {
      socketId: this.state.privateConversationSocketId,
      message: 'new private message'
    });
  }
  sendSelfMessage = (ev) => {
    ev.preventDefault();
    this.socket.emit('self', 'new self message');
  }
  sendRoomMessage = (ev) => {
    ev.preventDefault();
    this.socket.emit('room', {
      room: this.state.currentRoom,
      message:'new room message'
    });
  }
  setYourName = (name) => {
    this.socket.emit('name', name);
  }
  setPrivateConversationSocketId = (ev) => {
    this.setState({
      privateConversationSocketId: ev.target.value
    })
  }
  setRoom = (ev) => {
    this.socket.emit('change-room', {
      leave: this.state.currentRoom,
      join: ev.target.value
    });
  }
  render() {
    return (
      <div>
        {
          this.state.name ? 
            <Chatty
              name={this.state.name}
              connectedUsers={this.state.connectedUsers}
              publicMessages={this.state.publicMessages}
              privateMessages={this.state.privateMessages} 
              selfMessages={this.state.selfMessages} 
              roomMessages={this.state.roomMessages}
              sendPublicMessage={this.sendPublicMessage}
              sendPrivateMessage={this.sendPrivateMessage}
              sendSelfMessage={this.sendSelfMessage} 
              sendRoomMessage={this.sendRoomMessage} 
              setPrivateConversationSocketId={this.setPrivateConversationSocketId}
              setRoom={this.setRoom}
              currentRoom={this.state.currentRoom}
              privateConversationSocketId={this.state.privateConversationSocketId} />
            : <Name 
              setYourName={this.setYourName} />
        }
      </div>
    );
  }
}
