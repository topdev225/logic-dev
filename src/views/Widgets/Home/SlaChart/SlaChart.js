import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

class SlaChart extends Component {
  componentDidMount() {
    am4core.addLicense("CH200423334886122");
    let chart = am4core.create("slaChart", am4charts.XYChart);

    chart.cursor = new am4charts.XYCursor();

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.min = 99;
    valueAxis.max = 100.25;
    valueAxis.strictMinMax = true;
    valueAxis.numberFormatter = new am4core.NumberFormatter();
    valueAxis.numberFormatter.numberFormat = "###.##'%'";

    let series

    for(let i=0; i<this.props.slaData.length; i++){

      for(let index=0; index<Object.keys(this.props.slaData[i]).length; index++){

        series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = "value";
          series.dataFields.dateX = "date";
          series.strokeWidth = 2
          series.tensionX = 0.8;
          series.data = []

        for(let objects=0; objects<this.props.slaData[i][Object.keys(this.props.slaData[i])[index]].length; objects++){

          let currentObject = this.props.slaData[i][Object.keys(this.props.slaData[i])[index]][objects]

          series.name = currentObject.name1
          series.tooltipText = `{dateX}\n ${currentObject.name1}: {valueY.value} %`;

          var circleBullet = series.bullets.push(new am4charts.CircleBullet());
          circleBullet.circle.stroke = am4core.color("#fff");
          circleBullet.circle.strokeWidth = 2;

          let dataObj = {}
          dataObj['date'] = new Date(currentObject.date)
          dataObj['value'] = currentObject.availablity

            series.data.push(dataObj)
        }
      }
    }



    this.chart = chart;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'right'

  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div id="slaChart" style={{ width: "100%", height: "260px" }}></div>
    );
  }
}

export default SlaChart;
