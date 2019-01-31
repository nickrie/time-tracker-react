import React, { Component } from 'react';

export default class TaskButtons extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick() {
    this.props.onDeleteClick(this.props.taskId);
  }

  render() {
    return (
      <div>
        <div className="d-none d-lg-block">
          <button type="button" className="btn btn-outline-dark btn-edit mr-1">
            <i className="fas fa-pencil-alt" />
          </button>
          <button
            type="button"
            onClick={this.handleDeleteClick}
            className="btn btn-outline-dark btn-delete"
          >
            <i className="fas fa-trash" />
          </button>
        </div>
        <div className="d-block d-lg-none">
          <button type="button" className="btn btn-outline-dark btn-edit">
            <i className="fas fa-pencil-alt" />
          </button>
        </div>
      </div>
    );
  }
}
