import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import LoggedTime from './LoggedTime';
import LastActive from './LastActive';
import TaskButtons from './TaskButtons';
import { displayActiveMinutes } from './../../helpers/display';

function Task(props) {
  // # of minutes the task has been active
  const [activeMinutes, setActiveMinutes] = useState(0);

  // Current date to use for calculating last active, updated via setInterval to force the display change
  const [nowDate, setNowDate] = useState(null);

  let refreshTimer;

  useEffect(() => {
    const { task } = props;

    setActiveMinutes(displayActiveMinutes(task));
    setNowDate(new Date());

    // Update our Time Logged and Last Active values every 5 seconds
    refreshTimer = setInterval(updateTimeValues, 5000);

    return function clear() {
      clearInterval(refreshTimer);
    };
  });

  // Returns a boolean indicating whether or not the task is currently active
  const isActive = () => {
    return props.task.started !== null;
  };

  // Updates state values used for calculating Time Logged and Last Active
  const updateTimeValues = () => {
    setActiveMinutes(displayActiveMinutes(props.task));
    setNowDate(new Date());
  };

  // Row click handler
  const handleRowClick = e => {
    const { task } = props;

    // Bail if they clicked the edit/delete button/icon
    //  those actions have their own click handlers in TaskButtons
    if (
      e.target.classList.contains('btn-edit') ||
      e.target.classList.contains('fa-pencil-alt') ||
      e.target.classList.contains('btn-delete') ||
      e.target.classList.contains('fa-trash')
    ) {
      return;
    }

    // If this task is active, stop it
    if (isActive()) {
      props.stopRunningTasks();
    } else {
      // start the task (this also stops any other running tasks)
      props.startTask(task);
    }
  };

  const { task } = props;

  // Set row classes

  let rowClasses = 'row row-task border-top p-2 align-items-center';

  if (props.stoppedTaskId === task.id) {
    rowClasses += ' bg-danger';
  } else if (isActive()) {
    rowClasses += ' bg-success';
  } else if (props.editTaskId === task.id) {
    rowClasses += ' bg-primary text-light';
  }

  // Set row hover icon

  let hoverIconClasses = '';

  if (isActive()) {
    hoverIconClasses += 'hover-icon fas fa-stop';
  } else {
    hoverIconClasses += 'hover-icon fas fa-play';
  }

  // Set row action icon if we just started/stopped a task

  let actionIconClasses = '';

  if (props.stoppedTaskId === task.id) {
    actionIconClasses = 'fas fa-hand-paper';
  } else if (props.startedTaskId === task.id) {
    actionIconClasses = 'fas fa-rocket';
  }

  // Build icon tag

  let icon = '';
  if (actionIconClasses !== '') {
    icon = <i className={actionIconClasses} />;
  } else {
    icon = <i className={hoverIconClasses} />;
  }

  return (
    <div className={rowClasses} onClick={handleRowClick}>
      <div className="col col-1">{icon}</div>
      <div
        className={
          'col col-4' +
          (props.editTaskId === task.id ? ' bg-primary text-light' : '')
        }
      >
        {task.name}
      </div>
      <div className="col col-3 text-right">
        <LoggedTime minutes={task.logged} activeMinutes={activeMinutes} />
      </div>
      <div className="col col-2">
        <LastActive isActive={isActive()} last={task.last} now={nowDate} />
      </div>
      <div className="col col-2">
        <TaskButtons
          taskId={task.id}
          deleteTask={props.deleteTask}
          editTask={props.editTask}
          editTaskId={props.editTaskId}
        />
      </div>
    </div>
  );
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  editTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  startTask: PropTypes.func.isRequired,
  stopRunningTasks: PropTypes.func.isRequired,
  editTaskId: PropTypes.string,
  startedTaskId: PropTypes.string,
  stoppedTaskId: PropTypes.string
};

export default Task;
