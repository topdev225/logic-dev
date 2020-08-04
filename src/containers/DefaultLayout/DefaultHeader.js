import React, { Component } from 'react';
import { Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DefaultHeaderMenu from './DefaultHeaderMenu'

import { AppNavbarBrand } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import icon from '../../assets/img/brand/LOGiC_Logo_Icon.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      right: false,
      left: true
    }
  }

  openNav(type){
    if(type === 'right'){
      if(!this.state.right){
        document.querySelector('body').classList.add('aside-menu-md-show')
        document.querySelector('body').classList.add('aside-menu-show')
      } else if (!!this.state.right){
        document.querySelector('body').classList.remove('aside-menu-md-show')
        document.querySelector('body').classList.remove('aside-menu-show')
      }
    } else if (type === 'left'){
      if(!this.state.left){
        document.querySelector('body').classList.add('sidebar-lg-show')
        document.querySelector('body').classList.add('sidebar-show')
      } else if (!!this.state.left){
        document.querySelector('body').classList.remove('sidebar-lg-show')
        document.querySelector('body').classList.remove('sidebar-show')
      }
    }
    this.setState({
      [type]: !this.state[type]
    })
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (

      <AppBar style={{backgroundColor: '#fff'}}>

        <Toolbar style={{padding: '0px', minHeight: '65px'}}>

            <AppNavbarBrand
              full={{ src: logo, height: '45px', width: '150px', alt: 'LOGiC Logo' }}
              minimized={{ src: icon, width: '40px', height: '30px', alt: 'LOGiC Icon' }}
            />

          <IconButton
            color="primary"
            aria-label="menu"
            style={{marginLeft: '15px'}}
            onClick={() => this.openNav('left')}
          >
            <MenuIcon />
          </IconButton>

          <Nav className="d-md-down-none" navbar>
          </Nav>

          <Nav className="ml-auto" navbar>

            <DefaultHeaderMenu
              logout={this.props.onLogout}
              profile={this.props.profile}
            />

            <IconButton
              color="primary"
              aria-label="menu"
              style={{marginRight: '15px'}}
              onClick={() => this.openNav('right')}
            >
              <MenuIcon />
            </IconButton>

          </Nav>

        </Toolbar>

      </AppBar>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
