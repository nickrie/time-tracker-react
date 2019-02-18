import React from 'react';
import PropTypes from 'prop-types';

function TaskButtons(props) {
  const disabled = props.editTaskId !== null ? true : false;

  const handleEditClick = e => {
    props.editTask(props.taskId);
  };

  const handleDeleteClick = e => {
    props.deleteTask(props.taskId);
  };

  return (
    <div>
      <div className="d-none d-md-block">
        <button
          type="button"
          onClick={handleEditClick}
          className="btn btn-outline-dark btn-edit"
          disabled={disabled}
          style={{ marginRight: '2px' }}
        >
          <i className="fas fa-pencil-alt" />
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="btn btn-outline-dark btn-delete"
          disabled={disabled}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
      <div className="d-block d-md-none">
        <button
          type="button"
          onClick={handleEditClick}
          className="btn btn-outline-dark btn-edit"
          disabled={disabled}
        >
          <i className="fas fa-pencil-alt" />
        </button>
      </div>
    </div>
  );
}

TaskButtons.propTypes = {
  taskId: PropTypes.string.isRequired,
  deleteTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  editTaskId: PropTypes.string
};

export default TaskButtons;
