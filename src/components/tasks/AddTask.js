import React, { Component } from 'react';
import { firebaseConnect, firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

class AddTask extends Component {
  state = {
    name: '',
    hours: 0,
    minutes: 0
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { firestore, auth } = this.props;
    const { name } = this.state;
    let { hours, minutes } = this.state;

    const check = this.props.validateTaskInputs(
      this.props.taskId,
      name,
      hours,
      minutes
    );

    if (check.error) {
      alert(check.msg);
      return;
    }

    hours = hours === null || hours === '' ? 0 : parseInt(hours);
    minutes = minutes === null || minutes === '' ? 0 : parseInt(minutes);
    const logged = parseInt(hours) * 60 + parseInt(minutes);

    const taskAdd = {
      uid: auth.uid,
      name,
      logged,
      started: null,
      last: null
    };

    firestore.add({ collection: 'tasks' }, taskAdd);

    this.setState({
      name: '',
      hours: 0,
      minutes: 0
    });
  }

  render() {
    return (
      <div className="container card bg-light">
        <div className="card-body">
          <form className="ml-auto my-0" onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="form-group col-md-6 col-lg-8">
                <input
                  name="name"
                  className="form-control mr-sm-2"
                  type="text"
                  placeholder="Task Name"
                  autoComplete="off"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group col-md-3 col-lg-2">
                <div className="input-group">
                  <input
                    name="hours"
                    className="form-control"
                    type="number"
                    placeholder="Hours"
                    autoComplete="off"
                    value={this.state.hours}
                    onChange={this.handleChange}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">h</div>
                  </div>
                </div>
              </div>
              <div className="form-group col-md-3 col-lg-2">
                <div className="input-group">
                  <input
                    name="minutes"
                    className="form-control"
                    type="number"
                    placeholder="Minutes"
                    autoComplete="off"
                    value={this.state.minutes}
                    onChange={this.handleChange}
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">m</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <button className="btn btn-md-block btn-primary">
                  Add Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

AddTask.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(),
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth
  }))
)(AddTask);
