import React, { Component } from 'react';
import TicketTable from '../Widgets/Home/TicketTable/TicketTable.js'
import TicketTableSkeleton from '../Widgets/Home/TicketTable/TicketTableSkeleton.js'
import TabContainer from '../Widgets/Home/IncidentsChart/TabContainer.js'
import SlaLoadChart from '../Widgets/Home/SlaChart/SlaChartContainer.js'
import SunburstChart from '../Widgets/Home/SunburstChart/SunburstChart.js'
import DateSelectorModal from '../../Components/DateSelectorModal/DateSelectorModal';
import { RotateSpinner } from "react-spinners-kit";

import {
  Card,
  CardContent,
  CardHeader,
} from '@material-ui/core';

import {
  Container,
  Row,
  Col
} from 'reactstrap';

class Home extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      incidentTabIndex: 0,
      startDate: new Date(new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0,0,0)),
      endDate: new Date()
    }
  }

  componentDidMount(){
    this.newDateFetch()
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }


  setDate = (dateType, date) => {
    this.setState({
      [dateType]: date
    })
  }

  setIncidentTabIndex = (index) => {
    this.setState({
      incidentTabIndex: index
    })
  }

  newDateFetch = () => {
    this.jiraFetch(this.state.startDate, this.state.endDate)
    this.slaFetch(this.state.startDate, this.state.endDate, this.props.organizations, this.props.clusteraccessjoined)
    this.getIncidentTabData(this.state.incidentTabIndex)
  }



  getIncidentTabData = async (tabIndex) => {

      let clusters = this.props.cluster_list

      const res = await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'incidents_chart',
            cluster: clusters[tabIndex],
            startDate: this.state.startDate,
            endDate: this.state.endDate,
          }
        })
        res.json()
        .then(res =>
          this.setState({
            incident_data: res
          })
        )
    }





      async jiraFetch(startDate, endDate){

        // endDate = new Date(endDate.setDate(endDate.getDate() + 1))

        await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'jira',
            startDate: startDate,
            endDate: endDate,
          }
        })
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            p1: json.priority[0],
            p2: json.priority[1],
            p3: json.priority[2],
            p4: json.priority[3],
            closedby: json.closedby,
            issue_type: json.issue_type,
            reporter: json.reporter,
            priority_count: json.priority_count
          })
        })
      }



      slaFetch = async (startDate, endDate, organizations, clusterNames) => {

        this.setState({
          slaData: undefined
        })

        let slaData = []

        for(let i=0; i<Object.keys(organizations).length; i++){

          let hostNames = []

          for(let index=0; index<organizations[Object.keys(organizations)[i]].host_data.length; index++){
            let obj = organizations[Object.keys(organizations)[i]].host_data[index]
            if(obj.attrs.vars && obj.attrs.vars.sla === true){
              hostNames.push(obj.name)
            }
          }

          if(!!hostNames.length){
            await fetch(`${process.env.REACT_APP_FETCH_URL}`, {
              headers: {
                function: 'sla',
                hostnames: hostNames,
                org: clusterNames[i],
                startdate: startDate,
                enddate: endDate
              }
            })
            .then((res) => res.json())
            .then((json) => {
              slaData.push(json)
            })
          }

        }
        this.setState({
          slaData: slaData
        })

      }


  loading = () => <div className="animated fadeIn pt-1 text-center">
  <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}>
    <RotateSpinner
      size={350}
      color="rgb(242,97,39)"
      loading={true}
    />
  </div>
  </div>

  render() {

    return (

      <Container style={{ padding: '0px', maxHeight: '550px' }} fluid>

        {

          (
            !this.state.incident_data &&
            !this.state.slaData &&
            !this.state.p1
          )

          ?

          <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}>
            <RotateSpinner
              size={350}
              color="rgb(242,97,39)"
              loading={true}
            />
          </div>

          :

          <>

            <div style={{
              display: 'flex',
              top: '40px',
              background: '#fff',
              height: '45px',
              width: '100%',
              zIndex: '100',

              // borderBottom: '.5px solid',
              // borderColor: 'lightgrey'
            }} >

            <div style={{margin: '5px'}}>

                <DateSelectorModal
                  startdate={this.state.startDate}
                  enddate={this.state.endDate}
                  setdate={this.setDate}
                  newdatefetch={this.newDateFetch}
                />

              </div>

            </div>

            <Row style={{marginTop: '10px', paddingLeft: '25px', paddingRight: '25px', height: '350px'}}>

              <Card style={{height: '100%', width: '100%' }}
              raised={true}>
                <CardHeader title="DAILY DEVICE AVAILABILITY"
                subheader="Percentage of the day selected devices were available." />
                <CardContent>
                    <SlaLoadChart
                      organizations={this.props.organizations}
                      orgslength={this.props.orgslength}
                      slafetch={this.slaFetch}
                      clusteraccessjoined={this.props.clusteraccessjoined}
                      sladata={this.state.slaData}
                    />
                </CardContent>
              </Card>

            </Row>

            <Row style={{ padding: '5px', paddingRight: '0px', maxHeight: '100%' }}>
              <Col>
              <div style={{padding: '5px', height: '100%'}}>
                <Card raised={true} style={{height: '100%'}}>
                  <CardHeader
                    title='INCIDENTS SUNBURST'
                    subheader='Current active incidents by device group' />
                  <CardContent>
                    <SunburstChart/>
                  </CardContent>
                </Card>
                </div>
              </Col>
              <Col >
                <div style={{padding: '5px', paddingLeft: '0px', paddingRight: '10px'}}>
                { this.state.p1 ?
                    <TicketTable
                      p1={ this.state.p1 }
                      p2={ this.state.p2 }
                      p3={ this.state.p3 }
                      p4={ this.state.p4 }
                      closedby={ this.state.closedby }
                      issue_type={ this.state.issue_type }
                      reporter={ this.state.reporter }
                      priority_count={ this.state.priority_count }
                    />
                    :
                    <TicketTableSkeleton/>
                  }
                </div>
                <div style={{padding: '5px', paddingLeft: '0px', paddingRight: '10px'}}>
              { this.props.cluster_list.length >= 1 &&
               <Card raised={true}>
                  <CardHeader
                  title='MULTI SITE INCIDENT HISTORY'
                  subheader='Overview of incident trends by site' />
                  <CardContent>
                      <TabContainer
                        organizations={this.props.organizations}
                        cluster_list={this.props.cluster_list}
                        startDate={this.props.date.startDate}
                        endDate={this.props.date.endDate}
                        getIncidentTabData={this.getIncidentTabData}
                        incident_data={this.state.incident_data}
                        tabindex={this.state.incidentTabIndex}
                        settabindex={this.setIncidentTabIndex}
                      />
                  </CardContent>
                </Card>
              }
              { this.props.cluster_list.length === 0 &&
               <Card raised={true}>
                  <CardHeader
                  title='SITE INCIDENT HISTORY'
                  subheader='Overview of incident trends' />
                  <CardContent>
                      <TabContainer
                        organizations={this.props.organizations}
                        cluster_list={this.props.cluster_list}
                        startDate={this.props.date.startDate}
                        endDate={this.props.date.endDate}
                        getIncidentTabData={this.getIncidentTabData}
                        incident_data={this.state.incident_data}
                        tabindex={this.state.incidentTabIndex}
                        settabindex={this.setIncidentTabIndex}
                      />
                  </CardContent>
                </Card>
              }
                </div>
              </Col>


            </Row>

          </>

        }

      </Container>
    );
  }
}

export default Home;
