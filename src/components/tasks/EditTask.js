import React, { useState, useEffect } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import LoadingScreen from './../LoadingScreen';
import { displayMinutes, displayActiveMinutes } from './../../helpers/display';

function EditTask(props) {
  const [loadedTaskId, setLoadedTaskId] = useState(false);
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);

  let refreshTimer;

  // Update the activeMinutes state for the edit screen message indicating
  //  that the logged time does not include active time
  const updateActiveMinutes = loadedTaskId => {
    if (loadedTaskId) {
      setActiveMinutes(displayActiveMinutes(props.task));
    }
  };

  useEffect(() => {
    // If we're editing a new task
    if (
      typeof props.task !== 'undefined' &&
      (!loadedTaskId || loadedTaskId !== props.task.id)
    ) {
      const { task } = props;
      let newHours = 0;
      let newMinutes = 0;

      if (task.logged > 60) {
        newHours = Math.floor(task.logged / 60);
        newMinutes = task.logged % 60;
      } else {
        newMinutes = task.logged;
      }

      // Set state with task values
      setLoadedTaskId(task.id);
      setName(task.name);
      setHours(newHours);
      setMinutes(newMinutes);
      setActiveMinutes(displayActiveMinutes(task));
      // If we're editing an Active task,
      //  Refresh active minutes every 5 seconds
      if (task.started !== null) {
        refreshTimer = setInterval(() => {
          updateActiveMinutes(task.id);
        }, 5000);
      }
    }

    return function clear() {
      clearInterval(refreshTimer);
    };
  }, [props.task]);

  // Input onchange handler
  //  TODO: re-use function in AddTask.js since it's the same
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

  // Prevent the form from submitting
  const handleSubmit = e => {
    e.preventDefault();
  };

  // Cancel button handler
  const handleCancelClick = e => {
    e.preventDefault();
    props.cancelEdit();
  };

  // Delete button handler
  const handleDeleteClick = () => {
    props.deleteTask(props.task.id);
  };

  // Submit button handler
  const handleSubmitClick = e => {
    e.preventDefault();

    const { firestore } = props;

    // Validate the inputs
    const check = props.validateTaskInputs(props.task.id, name, hours, minutes);

    // If there was an error display it and prevent the update
    if (check.error) {
      alert(check.msg);
      return;
    }

    // Otherwise build the object to update firestore

    const newHours = hours === null || hours === '' ? 0 : parseInt(hours);
    const newMinutes =
      minutes === null || minutes === '' ? 0 : parseInt(minutes);
    const logged = parseInt(newHours) * 60 + parseInt(newMinutes);

    const taskUpdate = {
      name,
      logged
    };

    // Update firestore
    firestore.update({ collection: 'tasks', doc: props.task.id }, taskUpdate);

    // Update was successful, hide the edit form
    props.cancelEdit();
  };

  // Output

  const { task } = props;

  if (task) {
    return (
      <div className="card bg-primary text-light">
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
                    min="0"
                    max="999"
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
                    min="0"
                    max="59"
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
              <div
                id="edit-help"
                className="col-md-5 col-lg-4 text-light order-md-2"
              >
                {activeMinutes > 0
                  ? 'NOTE: This does not include the current active time of ' +
                    displayMinutes(activeMinutes) +
                    '.'
                  : ''}
              </div>
              <div className="col-md-7 col-lg-8 order-md-1">
                <button
                  onClick={handleSubmitClick}
                  className="btn btn-success mr-1 my-2 my-sm-0"
                >
                  Submit Changes
                </button>
                <button
                  onClick={handleCancelClick}
                  className="btn btn-warning mr-1 my-2 my-sm-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="btn btn-danger mr-1 my-2 my-sm-0"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return <LoadingScreen />;
  }
}

EditTask.propTypes = {
  firestore: PropTypes.object.isRequired,
  taskId: PropTypes.string,
  task: PropTypes.object
};

export default compose(
  firestoreConnect(props => [
    { collection: 'tasks', storeAs: 'task', doc: props.taskId }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    task: ordered.task && ordered.task[0]
  }))
)(EditTask);
