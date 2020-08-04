import React, { Component } from 'react';
import DashboardTabs from './DashboardTabs'
import { connect } from "react-redux";
import allActions from '../../redux/actions'


const mapStateToProps = (state) => {
  return {
    panelEditToggled: state.panelIsBeingEdited.edit,
    panelIsBeingAdded: state.panelIsBeingEdited.adding
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchPanelAddState: () => dispatch(allActions.dashboardActions.panelIsBeingAdded(true)),
  };
}

class DashboardTabsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(){
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'fetchdashboards',
        email: this.props.useremail,
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      if (json.length){
        this.props.handlesetfetcheddashboards(json, 0)
      } else {
        this.props.handlesetfetcheddashboards([], 0)
      }
    })
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(!!this.props.panelIsBeingAdded || !!nextProps.panelIsBeingAdded){
  //     return true
  //   }
  //   if(
  //     this.props.dashboarddata !== nextProps.dashboarddata ||
  //     !this.props.dashboarddata
  //   ){
  //     return true
  //   } else {
  //     return true
  //   }
  // }

  render() {

    return (

      <div>
        { !this.props.panelEditToggled &&
        <DashboardTabs
          setcurrentlayoutinstance={this.props.setcurrentlayoutinstance}
          useremail={this.props.useremail}
          setdashboardname={this.props.setdashboardname}
          currentlyselecteddashboardname={this.props.currentlyselecteddashboardname}
          tabvalue={this.props.tabvalue}
          settabvalue={this.props.settabvalue}
          handlesetfetcheddashboards={this.props.handlesetfetcheddashboards}
          currentlayout={this.props.currentlayout}
          thereisdata={this.props.thereisdata}
          allchartdata={this.props.allchartdata}
          setfetcheddashboarddata={this.props.setfetcheddashboarddata}
          dashboardcanrender={this.props.dashboardcanrender}
          setdashboardcanrender={this.props.setdashboardcanrender}
          setoptionsinwizardonclickofeditbutton={this.props.setoptionsinwizardonclickofeditbutton}
        />
        }
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardTabsContainer);
