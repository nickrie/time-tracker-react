import React, { useState, useEffect } from 'react';
import Moment from 'moment';

import AppNavbar from './layout/AppNavbar';
import AppFooter from './layout/AppFooter';
import AddTask from './tasks/AddTask';
import EditTask from './tasks/EditTask';
import Tasks from './tasks/Tasks';

function Main(props) {
  const [tasks, setTasks] = useState([]);
  const [formHidden, setFormHidden] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [startedTaskId, setStartedTaskId] = useState(null);
  const [stoppedTaskId, setStoppedTaskId] = useState(null);

  // Load tasks from LocalStorage on mount
  useEffect(
    () => {
      // Get Tasks from LS
      if (window.localStorage.getItem('tasks-v2') === null) {
        setTasks([]);
      } else {
        setTasks(JSON.parse(window.localStorage.getItem('tasks-v2')));
      }
    },
    [] // only run on mount/unmount
  );

  // Update LocalStorage when tasks state changes
  useEffect(() => {
    // Update LS
    window.localStorage.setItem('tasks-v2', JSON.stringify(tasks));
  }, [tasks]);

  // Hide the add/edit form
  const hideForm = () => {
    setFormHidden(true);
  };

  // Show the add/edit form
  const showForm = () => {
    setFormHidden(false);
  };

  // Edit a task
  const editTask = taskId => {
    showForm();
    setEditTaskId(taskId);
  };

  // Cancel the edit form
  const cancelEdit = () => {
    setEditTaskId(null);
  };

  // Add a task
  const addTask = task => {
    // Add the task
    setTasks([task, ...tasks]);
    // Start the task
    // TODO: FIX this won't work because tasks isn't set yet
    //    by the time the toggle goes to updateTask
    toggleTask(task);
  };

  // Update a task
  const updateTask = task => {
    // Find the index of this task
    let idx = -1;
    tasks.forEach((compareTask, compareIdx) => {
      if (task.id === compareTask.id) {
        idx = compareIdx;
      }
    });
    if (idx !== -1) {
      // Update the taskId
      setTasks([...tasks.slice(0, idx), task, ...tasks.slice(idx + 1)]);
    }
  };

  // Delete a task
  const deleteTask = id => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // Remove the task
      setTasks(tasks.filter(task => task.id !== id));
      // If we deleted from the Edit Form, hide it
      cancelEdit();
    }
  };

  // Toggle a task
  const toggleTask = task => {
    console.log('toggle', task);
    if (task.started === null) {
      startTask(task);
    } else {
      stopRunningTasks();
    }
  };

  // Start a task timer
  const startTask = task => {
    // Stop any running tasks first
    stopRunningTasks();

    // Build the update object
    const taskUpdate = {
      id: task.id,
      name: task.name,
      logged: task.logged,
      started: new Date(),
      last: task.last
    };

    // Update LS
    updateTask(taskUpdate);
    // Mark this task id as started for the action icon
    setStartedTaskId(task.id);
    // Clear startedTaskId after one second
    setTimeout(() => {
      setStartedTaskId(null);
    }, 1000);

    return false;
  };

  // Stop all running task timers
  //  NOTE: although the app limits one running app at a time,
  //    since the user is free to edit LocalStorage assume more
  //    than one could be running.
  const stopRunningTasks = () => {
    let taskUpdate;

    tasks.forEach(task => {
      if (task.started !== null) {
        // Calculate new logged time
        //  Don't update logged time or last date if it was active for less than 5 seconds
        const a = Moment(new Date());
        const b = Moment(task.started);
        const seconds = a.diff(b, 'seconds');
        const minutes = seconds < 5 ? 0 : Math.ceil(seconds / 60);

        if (minutes > 0) {
          // Time was logged, stop the task and update logged time and last started
          const logged = parseInt(task.logged) + minutes;
          const last = new Date();
          taskUpdate = {
            id: task.id,
            name: task.name,
            logged,
            started: null,
            last
          };
        } else {
          // No time was logged, so just stop the task
          taskUpdate = {
            id: task.id,
            name: task.name,
            logged: task.logged,
            started: null,
            last: task.last
          };
        }

        // Update the task
        updateTask(taskUpdate);
        // Mark this task id as stopped for the action icon
        setStoppedTaskId(task.id);
        // Clear startedTaskId after one second
        setTimeout(() => {
          setStoppedTaskId(null);
        }, 1000);
      }
    });
  };

  // Validate task form input values
  const validateTaskInputs = (id, name, hours, minutes) => {
    // Ensure name is not empty
    if (name.trim() === '') {
      return {
        error: true,
        focus: 'name',
        msg: 'NAME is required.'
      };
    }

    // Ensure another task with that name doesn't already exist
    let nameExists = false;
    tasks.forEach(task => {
      if (task.name === name && task.id !== id) {
        nameExists = true;
      }
    });
    if (nameExists === true) {
      return {
        error: true,
        focus: 'name',
        msg: 'A task already exists with that name.'
      };
    }

    // Check hours and minutes to ensure they are integer values of the expected size
    hours = hours === null || hours === '' ? 0 : parseInt(hours);
    minutes = minutes === null || minutes === '' ? 0 : parseInt(minutes);
    if (hours < 0 || minutes < 0 || isNaN(hours) || isNaN(minutes)) {
      return {
        error: true,
        focus: 'hours',
        msg: 'Hours and minutes must be positive integer values.'
      };
    }

    // Ensure minutes value is valid
    if (minutes >= 60) {
      return {
        error: true,
        focus: 'minutes',
        msg: 'Minutes must be under 60.'
      };
    }

    // Ensure a reasonable upper limit on hours
    if (hours >= 1000) {
      return {
        error: true,
        focus: 'minutes',
        msg: 'Hours should not exceed 1000.'
      };
    }

    return { error: false };
  };

  // Build the form

  let form = '';

  if (formHidden) {
    form = '';
  } else if (editTaskId === null) {
    form = (
      <AddTask
        startTask={startTask}
        addTask={addTask}
        hideForm={hideForm}
        validateTaskInputs={validateTaskInputs}
      />
    );
  } else {
    form = (
      <EditTask
        task={tasks.filter(task => task.id === editTaskId)[0]}
        cancelEdit={cancelEdit}
        deleteTask={deleteTask}
        updateTask={updateTask}
        validateTaskInputs={validateTaskInputs}
      />
    );
  }

  // Output

  return (
    <div className="main">
      <AppNavbar formHidden={formHidden} showForm={showForm} />
      <div className="container mt-2">
        {form}
        <Tasks
          tasks={tasks}
          editTask={editTask}
          deleteTask={deleteTask}
          startTask={startTask}
          stopRunningTasks={stopRunningTasks}
          editTaskId={editTaskId}
          startedTaskId={startedTaskId}
          stoppedTaskId={stoppedTaskId}
        />
      </div>
      <AppFooter />
    </div>
  );
}

export default Main;
