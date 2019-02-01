import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-light py-3 text-center text-success">
      <p className="mb-0">
        &copy; <a href="https://github.com/nickrie">Nick Riemondi</a>
        {' ' + new Date().getFullYear()}
      </p>
    </footer>
  );
}
