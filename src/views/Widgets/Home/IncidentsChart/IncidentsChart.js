import React, { Component } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);


class IncidentsChart extends Component {


  constructor(props){
    super(props);
    this.state = {};
    this.mousedown = false
  }




  componentDidMount(){

    am4core.addLicense("CH200423334886122");
    let chart = am4core.create('stacked_bar_chart', am4charts.XYChart);

    chart.data = this.props.data

    chart.xAxes.push(new am4charts.DateAxis());
    chart.dateFormatter.inputDateFormat = "yyyy-MM-ddTHH:mm:ss.SSSZ"
    chart.dateFormatter.dateFormat = "MMM d"

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;

    function createSeries(name, field) {

      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.name = name;
      // series.columns.template.fill = am4core.color(color);
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.sequencedInterpolation = true;

      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{dateX}: {valueY}";

      return series;
    }

    // createSeries("Precoursors", "warnings", "#FFFF00");
    // createSeries("Incidents", "criticals", "#FF0000");

    createSeries("Precoursors", "warnings");
    createSeries("Incidents", "criticals");

    // Legend
    chart.legend = new am4charts.Legend();

    this.chart = chart;

  }



  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }





  render(){
    return (
      <div>
        <div id='stacked_bar_chart'  style={{height: "300px" }}></div>
      </div>
    )
  }

}

export default IncidentsChart
