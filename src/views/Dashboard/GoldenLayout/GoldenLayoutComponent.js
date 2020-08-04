import React from "react";
import ReactDOM from "react-dom";
import "./goldenLayout-dependencies";
import GoldenLayout from "golden-layout";
import "golden-layout/src/css/goldenlayout-base.css";
import "golden-layout/src/css/goldenlayout-light-theme.css";
import $ from "jquery";
import allActions from '../../../redux/actions'
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => {
  return {
    setIfChangeHasBeenMadeToLayout: () => dispatch(allActions.dashboardActions.setIfChangeHasBeenMadeToLayout(true)),
    setCompletedLayoutChange: (bool) => dispatch(allActions.dashboardActions.setCompletedLayoutChange(bool)),
    modifiableDashboardData: (data) => dispatch(allActions.dashboardActions.modifiableDashboardData(data)),
    panelIsBeingDeleted: (bool) => dispatch(allActions.dashbaordActions.panelIsBeingDeleted(bool))
  };
}

const mapStateToProps = (state) => {
  return {
    fetchedDashboardData: state.fetchedDashboardData,
    panelIsDeleted: state.panelIsDeleted
  };
};

class GoldenLayoutComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  setLayoutChangeHasFinished(bool){
    this.props.setCompletedLayoutChange(bool)
  }

  containerRef = React.createRef();

  componentRender(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels);
      newRenderPanels.add(reactComponentHandler);
      return { renderPanels: newRenderPanels };
    });
  }
  componentDestroy(reactComponentHandler) {
    this.setState(state => {
      let newRenderPanels = new Set(state.renderPanels);
      newRenderPanels.delete(reactComponentHandler);
      return { renderPanels: newRenderPanels };
    });
  }

  goldenLayoutInstance = undefined;

  async componentDidMount() {

    //declare layout instance
    this.goldenLayoutInstance = new GoldenLayout(
      this.props.config,
      this.containerRef.current
    );

    if (this.props.registerComponents instanceof Function){
      await this.props.registerComponents(this.goldenLayoutInstance, this.props.allchartdata)
    }

    this.goldenLayoutInstance.reactContainer = this;

    //create edit icon element and add to GoldenLayout panel headers
    this.goldenLayoutInstance.on( 'stackCreated', function( stack ){
      let editIcon = document.createElement('li')
      editIcon.innerHTML = '✎'
      editIcon.addEventListener("click", function(){
        this.props.setoptionsinwizardonclickofeditbutton(editIcon, this.props.fetchedDashboardData.modifiableDashboardData, this.props.tabvalue)
      }.bind(this));
      stack.header.controlsContainer.prepend( editIcon );
    }.bind(this))

    //delete panel from json
    this.goldenLayoutInstance.on( 'itemDestroyed', function( stack ){
      if(!!this.props.panelIsBeingDeleted){
        return
      }
      let modifiableDashboardData = this.props.fetchedDashboardData.modifiableDashboardData
      let dashboardJSON = JSON.parse(modifiableDashboardData[this.props.tabvalue].dashboard_json)
      let chartData = dashboardJSON.chart_data
      let panelToDelete = chartData.find(panel => panel.name === stack.config.title)
      let panelIndex = chartData.indexOf(panelToDelete)
      chartData.splice(panelIndex, 1)
      dashboardJSON['chart_data'] = chartData
      if(!chartData.length){
        let layoutConfig = `{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","content":[]}],"isClosable":true,"reorderEnabled":true,"title":"${modifiableDashboardData[this.props.tabvalue].dashboard_name}","openPopouts":[],"maximisedItemId":null}`
        let parsedConfig = JSON.parse(layoutConfig)
        dashboardJSON['config'] = parsedConfig
        let prevLayoutInstance = this.goldenLayoutInstance
        this.goldenLayoutInstance = new GoldenLayout(
          parsedConfig,
          this.containerRef.current
        )
        this.goldenLayoutInstance.init()
        prevLayoutInstance.destroy()
        this.props.setcurrentlayoutinstance(this.goldenLayoutInstance)
      }
      let stringifiedDashboardJSON = JSON.stringify(dashboardJSON)
      modifiableDashboardData[this.props.tabvalue].dashboard_json = stringifiedDashboardJSON
      this.props.modifiableDashboardData(modifiableDashboardData)
      this.props.setIfChangeHasBeenMadeToLayout()
      this.props.panelIsBeingDeleted(true)
      setTimeout(function(){
        this.props.panelIsBeingDeleted(false)
      }.bind(this), 2000);
    }.bind(this))

    //handle window resize event
    window.addEventListener('resize', () => {
        this.goldenLayoutInstance.updateSize();
      }
    );
    //set layout instance in local state
    await this.setState({
      goldenLayoutInstance: this.goldenLayoutInstance
    })

    //send layout instance up the tree
    this.props.setcurrentlayoutinstance(this.goldenLayoutInstance)

    //Remove unneeded padding from MUI Tabs
    document.querySelectorAll("div[class^='MuiBox-root']")[0].className=""

    this.goldenLayoutInstance.init()

    //trigger rendering of graphs
    await this.setLayoutChangeHasFinished(false)
    this.setLayoutChangeHasFinished(true)

}

  render() {

    let panels = Array.from(this.state.renderPanels || []);

    return (
      <div>
        <div ref={this.containerRef} {...this.props.htmlAttrs}>
          {panels.map((panel, index) => {
            return ReactDOM.createPortal(
              panel._getReactComponent(),
              panel._container.getElement()[0]
            );
          })}
        </div>
      </div>
    );
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoldenLayoutComponent);





//Patching internal GoldenLayout.__lm.utils.ReactComponentHandler:

const ReactComponentHandler = GoldenLayout["__lm"].utils.ReactComponentHandler;

class ReactComponentHandlerPatched extends ReactComponentHandler {
  _render() {
    var reactContainer = this._container.layoutManager.reactContainer; //Instance of GoldenLayoutComponent class
    if (reactContainer && reactContainer.componentRender)
      reactContainer.componentRender(this);

  }
  _destroy() {
    const reactContainer = this._container.layoutManager.reactContainer;
    if (reactContainer && reactContainer.componentDestroy) {
      reactContainer.componentDestroy(this);
    }
    this._container.off("open", this._render, this);
    this._container.off("destroy", this._destroy, this);
  }

  _getReactComponent() {
    //the following method is absolute copy of the original, provided to prevent depenency on window.React
    var defaultProps = {
      glEventHub: this._container.layoutManager.eventHub,
      glContainer: this._container
    };
    var props = $.extend(defaultProps, this._container._config.props);
    return React.createElement(this._reactClass, props);
  }
}

GoldenLayout["__lm"].utils.ReactComponentHandler = ReactComponentHandlerPatched;
