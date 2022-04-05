import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

//const reducer = (state, action) => newState

// reducers (outside the component function)
const emailReducer = (state, action) => {
  if (action.type === 'USER_EMAIL_INPUT') {
    //             email input, isValid will return true. if there is @ symbol.
    //                   ↓           ↓
    return { value: action.val, isValid: action.val.includes('@') }; //
  }
  if (action.type === 'INPUT_BLUR_EMAIL') {
    //          emailState.value,  return true if emailState.value has @ symbol
    //                 ↓             ↓
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_PASSWORD_INPUT') {
    //          password input, isValid will return true. if password is greater than 6 characters.
    //                   ↓           ↓
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR_PASSWORD') {
    //        passwordState.value, return true if password greater than 6 characters.
    //                 ↓             ↓
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

// function component.  received props from App.js { onLogin }  --------------------
const Login = (props) => {
  // constants ---------------------

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  // object destructuring with alias.
  //         value     alias
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  // useEffect ---------------------
  useEffect(() => {
    // debouncing - delay the function 500ms
    const identifier = setTimeout(() => {
      console.log('Checking Form Validity');
      setFormIsValid(emailIsValid && passwordIsValid); // if both are true, return true.
    }, 500);
    // clean up - if not 500ms cleartTimeout
    return () => {
      console.log('CLEAN UP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]); //emailIsValid, passwordIsValidare ... are dependencies of useEffect here. if one or both updates their state. useEffect triggers.
  //   ↑               ↑
  //  alias           alias

  // handler ---------------------

  // email
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: 'USER_EMAIL_INPUT', val: event.target.value });
  };

  // Every time you get out of focus from the input field, the event will trigger.
  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR_EMAIL' });
    console.log('blur triggered!');
  };

  // password
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_PASSWORD_INPUT', val: event.target.value });

    // setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  // Every time you get out of focus from the input field, the event will trigger.
  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR_PASSWORD' });
    console.log('blur triggered!');
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  // JSX ---------------------

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
