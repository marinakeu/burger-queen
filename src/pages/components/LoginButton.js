import React from 'react';

function LoginButton(props) {
  return (
    <button className="button" onClick={props.onClick}>
      {props.text}
    </button>
  );
}

export default LoginButton;