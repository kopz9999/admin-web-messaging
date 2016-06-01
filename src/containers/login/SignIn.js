import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
// import { push } from 'react-router-redux';

// App Actions
import * as LoginActions from '../../actions/loginActions';
// App Assets
import styles from './SignIn.css';
import logo from './images/logo.png';

function mapStateToProps({ login }) {
  return { login };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(LoginActions, dispatch) };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
export default class SignIn extends Component {
  get loginState() {
    return this.props.login;
  }

  get actions() {
    return this.props.actions;
  }

  // TODO: Handle with AJAX request
  handleSubmit(e) {
    const { loginSuccess } = this.actions;
    e.preventDefault();
    loginSuccess();
  }

  componentDidUpdate(prevProps, prevState) {
    const { loggedIn } = this.loginState;
    if (loggedIn) this.props.history.push('/home');
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <form className={styles.padded} onSubmit={this.handleSubmit.bind(this)}>
            <div className={styles.logo}>
              <img src={logo} />
            </div>
            <div className={styles.fieldBox}>
              <h1 className={styles.title}>Login</h1>
              <div className={styles.inputGroup}>
                <div className={styles.inputRow}>
                  <input type="email" placeholder="Email" />
                </div>
                <div className={styles.inputRow}>
                  <input type="password" placeholder="Password" />
                </div>
              </div>
              <button className={styles.submitButton}>Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
