import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { connect } from "react-redux";
import allActions from '../../../redux/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    setIfChangeHasBeenMadeToLayout: () => dispatch(allActions.dashboardActions.setIfChangeHasBeenMadeToLayout(true)),
    setCompletedLayoutChange: (bool) => dispatch(allActions.dashboardActions.setCompletedLayoutChange(bool))
  };
}

const mapStateToProps = (state) => {
  return {
    panelName: state.panelName,
    fetchedDashboardData: state.fetchedDashboardData,
    seriesColors: state.seriesColors
  };
};

function am4themes_myTheme(target) {
  if (target instanceof am4charts.Axis) {
    target.fill = am4core.color("#fff");
  }
  // if (target instanceof am4charts.Grid) {
  //   target.stroke = am4core.color("#fff");
  // }
  if (target instanceof am4charts.Legend) {
    target.fill = am4core.color("#fff");
  }
}


am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_myTheme);


class ChartContainer extends Component {

  constructor(props){
    super(props);
    this.state = {};
    this.mousedown = false
  }

  setLayoutChangeHasFinished(bool){
    this.props.setCompletedLayoutChange(bool)
  }

  async componentDidMount() {

    am4core.addLicense("CH200423334886122");

    let dataToUseForChart = this.props.dataobjects.data
    let graphOptions = this.props.dataobjects.graphOptions

    am4core.options.minPolylineStep = 5;

    let chart = am4core.create(`chart-container_${this.props.idnum}`, am4charts.XYChart);

    chart.cursor = new am4charts.XYCursor();

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.fontSize = '10px'
    // dateAxis.baseInterval = {
    //   "timeUnit": "hour",
    //   "count": 1
    // };
    // this makes the data to be grouped
    // dateAxis.groupData = true;
    // dateAxis.groupCount = 750;
    dateAxis.marginBottom = '-20px'

    // Create value axis
    chart.valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    chart.valueAxis.marginLeft = '-20px'
    chart.valueAxis.fontSize = '10px'


    let scrollbarX = new am4charts.XYChartScrollbar();


    //Used temporarilly to filter out datasets with large series counts to optimize performance
    // if(dataToUseForChart[dataObjectIndex].data.length < 10){

      let series

      for(let dataObjectIndex=0; dataObjectIndex<dataToUseForChart.length; dataObjectIndex++){

        for(let i=0; i<dataToUseForChart[dataObjectIndex].data.length; i++){

          series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.strokeWidth = 2
            series.tensionX = 0.8;
            series.data = []
            if(!!graphOptions && graphOptions.includes("scroll")){
              scrollbarX.series.push(series);
            }

          let serviceName
          let seriesName
          let deviceName

          if (dataToUseForChart[dataObjectIndex].data[i].target !== undefined){
            let sliceLastPeriod = dataToUseForChart[dataObjectIndex].data[i].target.slice(0, dataToUseForChart[dataObjectIndex].data[i].target.lastIndexOf('.'))
            seriesName = sliceLastPeriod.slice(sliceLastPeriod.lastIndexOf('.')+1)
            deviceName = dataToUseForChart[dataObjectIndex].info.device
            serviceName = dataToUseForChart[dataObjectIndex].info.displayName
          }

          let seriesText = serviceName + "\n" + deviceName + "\n" + seriesName

          series.name=seriesText

          let currentColor = dataToUseForChart[dataObjectIndex].data[i].color
          series.stroke = am4core.color(currentColor);
          series.fill = am4core.color(currentColor);
          series.fillOpacity = 0.1;
          series.tooltipText = serviceName + "\n" + deviceName + `\n${seriesName}: {valueY.value}`;

          for(let index=0; index<dataToUseForChart[dataObjectIndex].data[i].datapoints.length; index++){

            series.data.push(
              {
                date: dataToUseForChart[dataObjectIndex].data[i].datapoints[index][1]*1000,
                value: dataToUseForChart[dataObjectIndex].data[i].datapoints[index][0]
              }
            )
          }
        }
      }
    // }

    // Responsive
    chart.responsive.enabled = true;



    if(!!graphOptions && graphOptions.includes("scroll")){
      chart.scrollbarX = scrollbarX;
      scrollbarX.marginTop = '-5px'
    }


    chart.plotContainer.visible = true;

    this.chart = chart;

    chart.legend = new am4charts.Legend();
    let legendContainer = am4core.create(`legend-container_${this.props.idnum}`, am4core.Container);
    legendContainer.width = am4core.percent(100);
    legendContainer.height = am4core.percent(100);

    chart.legend.parent = legendContainer;
    chart.legend.scrollable = true;


    //observe style changes in golden layout panels
    //when style has changed, toggle setlayoutchangehasfinished
    //this will trigger a re-render of the MyGoldenPanel components in order to resize the graphs to fit their containers
    //also set aChangeHasBeenMade reducer to true
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutationRecord) {
          setTimeout(async function(){
            if(!this.mousedown){
              await this.setLayoutChangeHasFinished(false)
              this.setLayoutChangeHasFinished(true)
              await this.props.setIfChangeHasBeenMadeToLayout()
            }
          }.bind(this), 10);
        }.bind(this));
    }.bind(this));

    //Add mutation oberver to each GoldenLayout Panel
    for (let i=0; i<Array.from(document.getElementsByClassName('lm_content')).length; i++){
      let target = Array.from(document.getElementsByClassName('lm_content'))[i]
        if(target.id !== 'observer-attached'){
          observer.observe(target, { attributes : true, attributeFilter : ['style'] });
          target.id='observer-attached'
        }
    }

    //set mousedown variable so that the function in the mutation MutationObserver
    //only fires once the mouse is up and thus the layout change has been completed
    window.addEventListener('mousedown', e => {
      this.mousedown = true
    });
    window.addEventListener('mouseup', e => {
      this.mousedown = false
    });


  }




  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }




  render() {

    return (

      <div id={`wizard-graph-container_${this.props.idnum}`}
        style={{
          width: Array.from(document.getElementsByClassName('lm_content')).find(panel => panel.contains(document.getElementById(`layout_panel_${this.props.idnum}`))) && Array.from(document.getElementsByClassName('lm_content')).find(panel => panel.contains(document.getElementById(`layout_panel_${this.props.idnum}`))).style.width,
        }}
      >

        <div
            id={`chart-container_${this.props.idnum}`}
            style={{
              width: '100%',
              height: Array.from(document.getElementsByClassName('lm_content')).find(panel => panel.contains(document.getElementById(`layout_panel_${this.props.idnum}`)))  && `${Array.from(document.getElementsByClassName('lm_content')).find(panel => panel.contains(document.getElementById(`layout_panel_${this.props.idnum}`))).style.height.slice(0, Array.from(document.getElementsByClassName('lm_content')).find(panel => panel.contains(document.getElementById(`layout_panel_${this.props.idnum}`))).style.height.length-2)-50}px`,
              position: 'relative',
            }}
        />
        <div
            id={`legend-container_${this.props.idnum}`}
            style={{
              position: 'relative',
              width: "100%",
              maxHeight: "50px",
              fontSize: "10px"
            }}
        />

      </div>

    );
  }
}

// {!dataToUseForChart[dataObjectIndex].data[0].displayName ? 'Host' : dataToUseForChart[dataObjectIndex].data[0].displayName}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartContainer);
