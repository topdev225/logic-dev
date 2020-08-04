import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/img/brand/logo.png'
import terms_of_use from '../../assets/files/terms_of_use_v0.pdf'
import webapp_privacy_policy from '../../assets/files/webapp_privacy_policy_v0.pdf'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {

  openTerms(){
    window.open(terms_of_use)
  }

  openPrivacy(){
    window.open(webapp_privacy_policy)
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (

        <React.Fragment>

            <a href='/assets/files/terms_of_use_v0.pdf' style={{cursor: 'pointer'}}>TERMS OF USE</a>

            <a href='/assets/files/webapp_privacy_policy_v0.pdf' style={{cursor: 'pointer'}}>PRIVACY POLICY</a>

            <img src={logo} style={{ height: '40px', width: '150px', position: 'fixed', right: '0px'}} alt='Client Logo'></img>

        </React.Fragment>


    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
