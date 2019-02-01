import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TaskButtons extends Component {
  constructor(props) {
    super(props);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleEditClick() {
    this.props.editTask(this.props.taskId);
  }

  handleDeleteClick() {
    this.props.onDeleteClick(this.props.taskId);
  }

  render() {
    const disabled = this.props.editTaskId !== null ? true : false;
    return (
      <div>
        <div className="d-none d-md-block">
          <button
            type="button"
            onClick={this.handleEditClick}
            className="btn btn-outline-dark btn-edit"
            disabled={disabled}
            style={{ marginRight: '2px' }}
          >
            <i className="fas fa-pencil-alt" />
          </button>
          <button
            type="button"
            onClick={this.handleDeleteClick}
            className="btn btn-outline-dark btn-delete"
            disabled={disabled}
          >
            <i className="fas fa-trash" />
          </button>
        </div>
        <div className="d-block d-md-none">
          <button
            type="button"
            onClick={this.handleEditClick}
            className="btn btn-outline-dark btn-edit"
            disabled={disabled}
          >
            <i className="fas fa-pencil-alt" />
          </button>
        </div>
      </div>
    );
  }
}

TaskButtons.propTypes = {
  taskId: PropTypes.string.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  editTaskId: PropTypes.string
};

export default TaskButtons;
