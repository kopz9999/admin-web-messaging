import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import linkState from 'react-link-state';
// import { push } from 'react-router-redux';

// App Actions
import * as AuthActions from '../../actions/authActions';
// App Assets
import styles from './SignIn.css';
import logo from './images/logo.png';

function mapStateToProps({ auth }) {
  return { ...auth };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(AuthActions, dispatch) };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    const redirectTo = this.props.location.query.next || '/home';
    this.state = {
      username: '',
      password: '',
      redirectTo
    };
  }

  handleSubmit(e) {
    const { doLogin } = this.props.actions;
    if (!this.props.isAuthenticating) {
      e.preventDefault();
      doLogin(this.state.username, this.state.password, this.state.redirectTo);
    }
  }

  renderLoginFailure() {
    const { statusText } = this.props;
    if (statusText) {
      return (
        <div className={styles.errorNotification}>
          { statusText }
        </div>
      );
    } else {
      return null;
    }
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
              { this.renderLoginFailure() }
              <div className={styles.inputGroup}>
                <div className={styles.inputRow}>
                  <input type="email"
                         placeholder="Email"
                         valueLink={linkState(this, 'username')} />
                </div>
                <div className={styles.inputRow}>
                  <input type="password"
                         placeholder="Password"
                         valueLink={linkState(this, 'password')} />
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
