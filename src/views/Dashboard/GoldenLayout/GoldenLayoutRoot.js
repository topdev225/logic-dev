import React from "react";
import GoldenLayoutComponent from "./GoldenLayoutComponent";
import MyGoldenPanel from "./MyGoldenPanel";
import { AppContext } from "./appContext";
import allActions from '../../../redux/actions'
import { connect } from "react-redux";

function mapDispatchToProps(dispatch) {
  return {
    setIfChangeHasBeenMadeToLayout: () => dispatch(allActions.dashboardActions.setIfChangeHasBeenMadeToLayout(true)),
    setCompletedLayoutChange: (bool) => dispatch(allActions.dashboardActions.setCompletedLayoutChange(bool))
  };
}

class GoldenLayoutRoot extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  setLayoutChangeHasFinished(bool){
    this.props.setCompletedLayoutChange(bool)
  }



  render() {
    return (
      <div>
        <AppContext.Provider value={this.state.contextValue}>
          { this.props.allchartdata &&
            <GoldenLayoutComponent //config from simple react example: https://golden-layout.com/examples/#qZXEyv
              setcurrentlayoutinstance={this.props.setcurrentlayoutinstance}
              allchartdata={this.props.allchartdata}
              key={this.props.childkey}
              setoptionsinwizardonclickofeditbutton={this.props.setoptionsinwizardonclickofeditbutton}
              currentlyselecteddashboardname={this.props.currentlyselecteddashboardname}
              tabvalue={this.props.tabvalue}
              htmlAttrs={{ style: {
                height: `100%`,
                width: '100%',
                position: 'absolute',
                backgroundColor: '#212121' } }}
              config={this.props.config}
              registerComponents={async (dashboardLayout, chartData) =>
                chartData.map((chartDataObject, i) => {
                  return dashboardLayout.registerComponent(chartDataObject.name, () => {
                    return <div id={`layout_panel_${i}`}>
                      { document.getElementById(`layout_panel_${i}`) &&
                        <MyGoldenPanel
                          dataobjects={chartDataObject}
                          idnum={i}
                          updatedashboard={this.props.updatedashboard}
                          tabvalue={this.props.tabvalue}
                        />
                      }
                    </div>
                  }
                   )
                 })
              }
            />
          }
        </AppContext.Provider>
      </div>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(GoldenLayoutRoot);
