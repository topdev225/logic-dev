import React from 'react';
import MaterialTable from 'material-table';

export default class HostGroupsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.columns()
  }

  columns = () => {
    let allHosts = []
    for(let i=0; i<this.props.hostgroupsstatus.length; i++){
      for(let index=0; index<this.props.hostgroupsstatus[i].length; index++){
        let host = this.props.hostgroupsstatus[i][index]
        let hostObj = {
          hostgroup: host["hostgroup_alias"],
          hostsup: parseInt(host["hosts_up"]),
          hostsdown: parseInt(host["hosts_down_unhandled"]) + parseInt(host["hosts_down_unhandled"]),
          servicesup: parseInt(host["services_ok"]),
          servicesdown: parseInt(host["services_warning_unhandled"]) + parseInt(host["services_critical_unhandled"]) + parseInt(host["services_warning_handled"]) + parseInt(host["services_critical_handled"])
        }
        if (hostObj['hostsup'] === 0 && hostObj['hostsdown'] === 0 && hostObj['servicesup'] === 0 && hostObj['servicesdown'] === 0){
        } else {
          allHosts.push(hostObj)
        }
      }
    }
    return allHosts
  }

  render() {

    return (
      <MaterialTable
        style={{width: '100%', height: '275px', overflowY: 'scroll'}}
        columns={[
          { title: 'Hostgroup', field: 'hostgroup' },
          { title: 'Hosts Up', field: 'hostsup' },
          { title: 'Hosts Down', field: 'hostsdown' },
          { title: 'Services Up', field: 'servicesup' },
          { title: 'Services Down', field: 'servicesdown' },
        ]}
        data={this.columns()}
        options={{
          sorting: true,
          paging: false,
          search: false,
          showTitle: false,
          toolbar: false
        }}
      />
    )
  }
}
