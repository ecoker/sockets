import React from 'react';

export default class Name extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: null
    };
  }

  handleChange = (ev) => {
    this.setState({
      name: ev.target.value
    });
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.setYourName(this.state.name);
  }
  
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Your Name..." onChange={this.handleChange} />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}