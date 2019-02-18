import React, { useState } from 'react';
import { firebaseConnect, firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

function AddTask(props) {
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  // Form input onchange handler
  const handleChange = e => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'hours':
        setHours(e.target.value);
        break;
      case 'minutes':
        setMinutes(e.target.value);
        break;
      default:
        console.log('INVALID TARGET: ', e.target.name);
    }
  };

  // Submit button handler
  const handleSubmit = e => {
    e.preventDefault();

    const { firestore, auth } = props;

    // Validate the inputs
    const check = props.validateTaskInputs(props.taskId, name, hours, minutes);

    // If there was an error display it and prevent adding the task
    if (check.error) {
      alert(check.msg);
      return;
    }

    // Otherwise build the object to add the task in firestore

    const newHours = hours === null || hours === '' ? 0 : parseInt(hours);
    const newMinutes =
      minutes === null || minutes === '' ? 0 : parseInt(minutes);
    const logged = parseInt(newHours) * 60 + parseInt(newMinutes);
    const created = new Date();

    const taskAdd = {
      uid: auth.uid,
      created,
      name,
      logged,
      started: null,
      last: null
    };

    // Insert in firestore
    firestore.add({ collection: 'tasks' }, taskAdd).then(res => {
      // Append the doc id to the task object
      taskAdd.id = res.id;
      // Start the new task
      props.startTask(taskAdd);
    });

    // Add was successful, clear the form
    setName('');
    setHours(0);
    setMinutes(0);
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        <form className="ml-auto my-0" onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group col-md-6 col-lg-8">
              <input
                name="name"
                className="form-control mr-sm-2"
                type="text"
                placeholder="Task Name"
                autoComplete="off"
                value={name}
                onChange={handleChange}
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
                  value={hours}
                  onChange={handleChange}
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
                  value={minutes}
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <div className="input-group-text">m</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <button className="btn btn-md-block btn-primary">Add Task</button>
            </div>
            <div className="col text-right">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={props.hideForm}
              >
                <i className="fas fa-arrow-up" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
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
