import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
// am4core.useTheme(am4themes_dataviz);

class PieChart extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    // Create chart
    am4core.addLicense("CH200423334886122");
    let chart = am4core.create(this.props.divId, am4charts.PieChart);

    //Format date from props
    let chartData = []
    let dataObjKeys = Object.keys(this.props.dataObj)
    for(let i=0; i<dataObjKeys.length; i++){
      let item = {"item": dataObjKeys[i], "total": this.props.dataObj[dataObjKeys[i]]}
      chartData.push(item)
    }
    chart.data = chartData

    // Create series
    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "total";
    series.dataFields.category = "item";
    series.hiddenState.properties.endAngle = -90;

    series.ticks.template.disabled = true;
    series.alignLabels = false;
    series.labels.template.text = null;
    // series.labels.template.radius = am4core.percent(-40);
    // series.labels.template.fill = am4core.color("white");

    // Create Title
    let title = chart.titles.create();
    title.text = this.props.title;
    title.fontSize = 25;
    title.marginTop = 30;
    title.marginRight = 100
    //Creatae legend
    chart.legend = new am4charts.Legend();
    // let legendContainer = am4core.create(`legenddiv_${this.props.divId}`, am4core.Container);
    // legendContainer.width = am4core.percent(100);
    // legendContainer.height = am4core.percent(100);
    // chart.legend.parent = legendContainer;
    chart.legend.scrollable = true;
    chart.legend.position = 'right'

  }


  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div>
        <div id={this.props.divId} style={{ width: "500px", height: "300px" }}></div>

      </div>
    );
  }
}

export default PieChart;
