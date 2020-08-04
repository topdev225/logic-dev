import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Paper from '@material-ui/core/Paper';

am4core.useTheme(am4themes_animated);

class ChartContainer extends Component {
  componentDidMount() {

    am4core.addLicense("CH200423334886122");

    am4core.options.minPolylineStep = 5;

    let chart = am4core.create(`slaChart_${this.props.index}`, am4charts.XYChart);

    // chart.paddingRight = 20;

    chart.cursor = new am4charts.XYCursor();

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    // dateAxis.baseInterval = {
    //   "timeUnit": "hour",
    //   "count": 1
    // };
    // this makes the data to be grouped
    dateAxis.groupData = true;
    dateAxis.groupCount = 1000;

    // Create value axis
    chart.valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let scrollbarX = new am4charts.XYChartScrollbar();

    //Used temporarilly to filter out datasets with large series counts to optimize performance
    if(this.props.chartdata.length < 10){

      let series

      for(let i=0; i<this.props.chartdata.length; i++){

        series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = "value";
          series.dataFields.dateX = "date";
          series.strokeWidth = 2
          series.tensionX = 0.8;
          series.data = []
          scrollbarX.series.push(series);

        let seriesName

        if (this.props.chartdata[i].target !== undefined){
          let sliceLastPeriod = this.props.chartdata[i].target.slice(0, this.props.chartdata[i].target.lastIndexOf('.'))
          seriesName = sliceLastPeriod.slice(sliceLastPeriod.lastIndexOf('.')+1)
        }

        series.name=seriesName

        series.tooltipText = `${seriesName}: {valueY.value}`;

        for(let index=0; index<this.props.chartdata[i].datapoints.length; index++){

          series.data.push(
            {
              date: this.props.chartdata[i].datapoints[index][1]*1000,
              value: this.props.chartdata[i].datapoints[index][0]
            }
          )
        }
      }
    }

    chart.scrollbarX = scrollbarX;

    chart.plotContainer.visible = true;

    this.chart = chart;

    chart.legend = new am4charts.Legend();

  }

  componentWillUnmount() {
    // if (this.chart) {
    //   this.chart.dispose();
    // }
  }

  render() {
    return (
      <div style={{width: 'auto', maxWidth: '100%'}}>

            <Paper style={{marginBottom: '15px'}} elevation={4}>
              <h4 style={{marginLeft: '10px', marginTop: '10px', padding: '10px'}}>
                {!this.props.chartdata[0].displayName ? 'Host' : this.props.chartdata[0].displayName}
              </h4>

              <div className="chart-wrapper">
                <div id={`slaChart_${this.props.index}`} style={{ width: "100%", height: "400px" }}></div>
              </div>

            </Paper>

      </div>
    );
  }
}

export default ChartContainer
