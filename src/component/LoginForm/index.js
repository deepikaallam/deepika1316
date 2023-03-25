import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => this.setState({username: event.target.value})

  onChangePassword = event => this.setState({password: event.target.value})

  onSubmitSuccessView = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props

    history.replace('/')
  }

  onSubmitFailureView = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  renderUsernameField = () => (
    <>
      <label htmlFor="username" className="input-label">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="input-field"
        placeholder="Username"
        onChange={this.onChangeUsername}
      />
    </>
  )

  renderPasswordField = () => (
    <>
      <label htmlFor="password" className="input-label">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="input-field"
        placeholder="Password"
        onChange={this.onChangePassword}
      />
    </>
  )

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccessView(data.jwt_token)
    } else {
      this.onSubmitFailureView(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {showSubmitError, errorMsg} = this.state

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showSubmitError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
