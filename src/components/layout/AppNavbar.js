import React from 'react';
import PropTypes from 'prop-types';

function AppNavbar(props) {
  return (
    <div className="navbar sticky-top navbar-expand-md navbar-dark bg-primary">
      <div className="container">
        <a href="#!" className="navbar-brand">
          <i className="fas fa-tasks pr-3" />
          Time Tracker v2
        </a>
        <a href="https://github.com/nickrie" className="text-light ml-2">
          <i className="fab fa-github fa-2x" />
        </a>
        {props.formHidden ? (
          <div className="ml-3">
            <a href="#!" onClick={props.showForm} className="text-light">
              <i className="fas fa-arrow-down fa-2x" />
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

AppNavbar.propTypes = {
  formHidden: PropTypes.bool,
  showForm: PropTypes.func
};

export default AppNavbar;
