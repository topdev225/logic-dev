import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_sunburst from "@amcharts/amcharts4/plugins/sunburst";

am4core.useTheme(am4themes_animated);
// am4core.useTheme(am4themes_dataviz);

class StackedBarChart extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    am4core.addLicense("CH200423334886122");

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // create chart
    var chart = am4core.create("sunburt_chart", am4plugins_sunburst.Sunburst);

    chart.padding(0,0,0,0);
    chart.radius = am4core.percent(98);

    chart.data = [{
      name: "Building 1",
      children: [
        { name: "Devices Up", value: 95 },
        { name: "Devices Down", value: 5 }
      ]
    },
    {
      name: "Building 2",
      children: [
        { name: "Devices Up", value: 2 },
        { name: "Devices Down", value: 98 }
      ]
    },
    {
      name: "Building 3",
      children: [
        {
          name: "DAS",
          children: [
            { name: "Devices Up", value: 75 },
            { name: "Devices Down", value: 25 }
          ]
        },
        { name: "Network", value: 148 },
        {
          name: "Switches", children: [
            { name: "Devices Up", value: 23 },
            { name: "Devices Down", value: 77 }
          ]
        },
        { name: "Servers", value: 100 }
      ]
    },
    {
      name: "Building 4",
      children: [
        { name: "Devices Up", value: 2 },
        { name: "Devices Down", value: 98 }
      ]
    },
    {
      name: "Building 5",
      children: [
        {
          name: "DAS",
          children: [
        { name: "Devices Up", value: 89 },
        { name: "Devices Down", value: 11 }
          ]
        },
        {
          name: "WiFi",
          children: [
        { name: "Devices Up", value: 54 },
        { name: "Devices Down", value: 46 }
        ]
        }
      ]
    }];

    chart.colors.step = 2;
    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(10);

    // define data fields
    chart.dataFields.value = "value";
    chart.dataFields.name = "name";
    chart.dataFields.children = "children";


    var level0SeriesTemplate = new am4plugins_sunburst.SunburstSeries();
    level0SeriesTemplate.hiddenInLegend = false;
    chart.seriesTemplates.setKey("0", level0SeriesTemplate)

    // this makes labels to be hidden if they don't fit
    level0SeriesTemplate.labels.template.truncate = true;
    level0SeriesTemplate.labels.template.hideOversized = true;

    level0SeriesTemplate.labels.template.adapter.add("rotation", function(rotation, target) {
      target.maxWidth = target.dataItem.slice.radius - target.dataItem.slice.innerRadius - 10;
      target.maxHeight = Math.abs(target.dataItem.slice.arc * (target.dataItem.slice.innerRadius + target.dataItem.slice.radius) / 2 * am4core.math.RADIANS);

      return rotation;
    })


    var level1SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey("1", level1SeriesTemplate)
    level1SeriesTemplate.fillOpacity = 0.75;
    level1SeriesTemplate.hiddenInLegend = true;

    var level2SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey("2", level2SeriesTemplate)
    level2SeriesTemplate.fillOpacity = 0.5;
    level2SeriesTemplate.hiddenInLegend = true;

    chart.legend = new am4charts.Legend();
    let legendContainer = am4core.create(`sunburst_legend`, am4core.Container);
    legendContainer.width = am4core.percent(100);
    legendContainer.height = am4core.percent(100);

    chart.legend.parent = legendContainer;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div id='sunburt_chart'  style={{height: "500px", width: '100%' }}/>
        <div id='sunburst_legend' style={{
          height: 'auto',
          marginTop: '75px',
          marginBottom: '-75px',
          fontSize: "15px"
        }}/>
      </div>
    );
  }
}

export default StackedBarChart;
