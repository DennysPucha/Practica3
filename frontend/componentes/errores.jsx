import React from 'react';
const ErrorCard = ({ errors }) => {
    return (
      <div className="error-card">
        <h4>Errores:</h4>
        <ul>
          {Object.keys(errors).map((key, index) => (
            <li key={index}>{errors[key]?.message}</li>
          ))}
        </ul>
      </div>
    );
  };