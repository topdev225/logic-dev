import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import ColorPickerItem from './ColorPickerItem'


export default class ColorPickerTable extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.service === nextProps.service &&
      this.props.service_series === nextProps.service_series
    ){
      return false
    } else {
      return true
    }
  }

  render(){

    return (
      <MaterialTable
        columns={this.props.service_series.map((series, i) => {
          return {
              title: series,
              headerStyle: {
                textAlign: 'center'
              },
              field: 'series',
              render: rowData => <div style={{display: 'flex', justifyContent: 'center'}}>
                      <ColorPickerItem
                        key={i}
                        series={series}
                        service={this.props.service}
                        service_series={this.props.service_series}
                      />
                    </div>
            }
          })}
        data={[{series: true}]}
        components={{
          Container: props => <Paper {...props} elevation={0}/>
        }}
        options={{
          sorting: false,
          paging: false,
          search: false,
          showTitle: false,
          toolbar: false,
          pageSize: 1,
        }}
      />
    );
  }
}
