import React from 'react';

export default class Chatty extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    var connectedUsers = Object.keys(this.props.connectedUsers).map(function(socketId){
      return (<option key={socketId} value={socketId}>{this.props.connectedUsers[socketId].name}</option>)
    }, this)
    var publicMessages = this.props.publicMessages;
    publicMessages = publicMessages.map(function(message, key){
      return (<li key={key}>{message}</li>)
    })
    var privateMessages = this.props.privateMessages;
    privateMessages = privateMessages.map(function(message, key){
      return (<li key={key}>{message}</li>)
    })
    var selfMessages = this.props.selfMessages;
    selfMessages = selfMessages.map(function(message, key){
      return (<li key={key}>{message}</li>)
    })
    var roomMessages = this.props.roomMessages;
    roomMessages = roomMessages.map(function(message, key){
      return (<li key={key}>{message}</li>)
    })
    return (
      <div>
        <p>Hello, {this.props.name}</p>
        <button onClick={this.props.sendPublicMessage}>Public Message</button>
        <button onClick={this.props.sendPrivateMessage}>Private Message</button>
        <button onClick={this.props.sendSelfMessage}>Self Message</button>
        <button onClick={this.props.sendRoomMessage}>Room Message</button>
        <h2>Send Private Messages to:</h2>
        <select defaultValue={this.props.privateConversationSocketId} onChange={this.props.setPrivateConversationSocketId}>
          {connectedUsers}
        </select>
        <h2>Change Rooms</h2>
        <p>Current Room: {this.props.currentRoom}</p>
        <select defaultValue="default" onChange={this.props.setRoom}>
          <option value="default">Default</option>
          <option value="awesomeTown">Awesome Town</option>
          <option value="sneakyVillage">Sneaky Village</option>
          <option value="dunceIsland">Dunce Island</option>
        </select>
        <h2>Public Messages</h2>
        <ul id="publicMessages">
          {publicMessages}
        </ul>
        <h2>Private Messages</h2>
        <p>{this.props.privateConversationSocketId}</p>
        <ul id="privateMessages">
          {privateMessages}
        </ul>
        <h2>Talking to Yourself</h2>
        <ul id="selfMessages">
          {selfMessages}
        </ul>
        <h2>Room Messages</h2>
        <ul id="roomMessages">
          {roomMessages}
        </ul>
      </div>
    );
  }
}