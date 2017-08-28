import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { login, decrypting, setKeys } from '../modules/account';
import CreateWallet from './CreateWallet.js'
import { encrypt_wif, decrypt_wif } from '../util/Passphrase.js';
import storage from 'electron-json-storage';
import _ from 'lodash';

const logo = require('../images/neon-logo2.png');

let wif_input;
let passphrase_input;

const onWifChange = (dispatch, history) => {
  // TODO: changed back to only WIF login for now, getting weird errors with private key hex login
  //
  dispatch(decrypting(true));
  setTimeout(() => {
    decrypt_wif(wif_input.value, passphrase_input.value).then((wif) => {
      dispatch(login(wif));
      history.push('/dashboard');
    });
  }, 500);
};

class LoginLocalStorage extends Component {

  componentDidMount = () => {
    storage.get('keys', (error, data) => {
      this.props.dispatch(setKeys(data));
    });
  }

  render = () => {
    const dispatch = this.props.dispatch;
    const loggedIn = this.props.loggedIn;
    return (<div id="loginPage">
      <div className="login">
        <div className="logo"><img src={logo} width="60px"/></div>
        <input type="text" placeholder="Enter your passphrase here" ref={(node) => passphrase_input = node}  />
        <div className="selectBox">
          <label>Encrypted key:</label>
          <select ref={(node) => wif_input = node}>
            {_.map(this.props.accountKeys, (value, key) => <option value={value}>{key}</option>)}
          </select>
        </div>
        <div className="loginButtons">
          <button onClick={(e) => onWifChange(dispatch, this.props.history)}>Login</button>
          <Link to="/create"><button className="altButton">New Wallet</button></Link>
          <Link to="/loginPrivateKey"><button className="altButton">Use Private Key</button></Link>
          <Link to="/"><button className="altButton">Use New Encrypted Key</button></Link>
        </div>
        {this.props.decrypting === true ? <div className="decrypting">Decrypting keys...</div> : <div></div>}
        <div id="footer">Created by Ethan Fast and COZ. Donations: Adr3XjZ5QDzVJrWvzmsTTchpLRRGSzgS5A</div>
      </div>
    </div>);
  }

}

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn,
  wif: state.account.wif,
  decrypting: state.account.decrypting,
  accountKeys: state.account.accountKeys
});

LoginLocalStorage = connect(mapStateToProps)(LoginLocalStorage);

export default LoginLocalStorage;