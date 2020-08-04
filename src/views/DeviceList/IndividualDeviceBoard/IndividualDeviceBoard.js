import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import IndividualDeviceBoardChild from './IndividualDeviceBoardChild'
import ChartContainer from './ChartContainer'
import TextBlock from './TextBlock'
import CheckNowButton from './CheckNowButton'
import DateSelectorModal from '../../../Components/DateSelectorModal'
import SilenceAlarm from './SilenceAlarm'
import { Container } from 'reactstrap';
import DeviceBoardTabs from './DeviceBoardTabs'
import { compose } from 'redux';
import { connect } from 'react-redux';
import allActions from '../../../redux/actions'
import queryString from 'query-string';

import {
  Card,
  CardHeader
} from '@material-ui/core';


import {
  Row,
  Col,
} from 'reactstrap';

class IndividualDeviceBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organizations: {},
      cluster_access_length: 1,
      leftMargin: "",
      topMargin: "",
      activeTab: new Array(4).fill('1'),
      serviceVars: {},
      selectedServiceVars: {},
      serviceVarValues: {},
      startDate: new Date(new Date().setHours(0,0,0)),
      endDate: new Date(),
      chartDataHasBeenUpdated: true,
      dateAndTimeHaveBeenChanged: true,
      stringsHaveBeenRendered: false,
      graphsHaveBeenRendered: false,
      showStatic: true,
      emptyRender: false,
      treeItemInfo: {organization: undefined, name: undefined},
      hostUdfChartData: [],
      servicesUdfChartData: [],
      check_units: "",
      check_interval: null,
    };
    this.toggle = this.toggle.bind(this);
  }



  componentDidMount(){
    let params = queryString.parse(this.props.location.search)
    if(!!params.device && !!params.org && ((this.state.treeItemInfo.organization !== params.org) || (this.state.treeItemInfo.name !== params.devices))){
      this.triggerNewQueryFetch(params)
    }
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }




  triggerNewQueryFetch(queryObj){
    let treeItemInfo = {}
    treeItemInfo['organization'] = queryObj.org
    treeItemInfo['name'] = queryObj.device
    this.fetchDataForSelectedTreeItem(treeItemInfo)
    this.setState({
      treeItemInfo: treeItemInfo
    })
  }




  updateDimensions = () => {
    if (window.innerWidth > 560){
      this.setState({
        leftMargin: window.getComputedStyle(document.getElementById('devices'), null).width,
        topMargin: '0px'
      })
    } else {
      this.setState({
        leftMargin: '0px',
        topMargin: window.getComputedStyle(document.getElementById('devices'), null).height
      })
    }
  }




  setChartDataInState = (data) => {
    this.setState({
      chartData: data
    })
  }

  setObjectNameInState = (name) => {
    this.setState({
      objectName: name
    })
  }

  setDisplayNameInState = (name) => {
    this.setState({
      displayName: name
    })
  }

  setTemplateInState = (template) => {
    this.setState({
      template: template
    })
  }

  setTemplatesInState = (templates) => {
    this.setState({
      templates: templates
    })
  }

  setGroupInState = (group, e) => {
    if(e && e.currentTarget.nodeName === "svg"){
      group = [...this.state.group]
      let groupObject
      groupObject = this.state.groups.find(obj => obj.display_name === e.target.parentElement.parentElement.textContent)
      if(!groupObject){
        groupObject = this.state.groups.find(obj => obj.display_name === e.target.parentElement.innerText)
      }
      let index = group.indexOf(groupObject.object_name)
      group.splice(index, 1)
    } else if(this.state.group){
      group = [...this.state.group]
      let groupToAdd = this.state.groups.find(obj => obj.display_name === e.target.textContent)
      if(!groupToAdd){
        if(e.target.value === 0){
          let displayName = e.currentTarget.innerText.slice(5).slice(0,-1)
          let objectName = displayName.split(' ').join('').toLowerCase()
          groupToAdd = {display_name: displayName, object_name: objectName, object_type: "object"}
        } else {
          let displayName = e.target.value
          if(!displayName){return}
          let objectName = displayName.split(' ').join('').toLowerCase()
          groupToAdd = {display_name: displayName, object_name: objectName, object_type: "object"}
        }
        this.setState({
          groups: [...this.state.groups, groupToAdd]
        })
      }
      group.push(groupToAdd.object_name)
    }
    this.setState({
      group: group
    })
  }



  setGroupsInState = (groups) => {
    this.setState({
      groups: groups
    })
  }

  setOidInState = (oid) => {
    this.setState({
      oid: oid
    })
  }

  setPriorityInState = (priority) => {
    this.setState({
      priority: priority
    })
  }

  setHostIpInState = (ip) => {
    this.setState({
      hostip: ip
    })
  }

  setServicesInState = (services) => {
    this.setState({
      services: services,
    })
  }

  setDeviceAndOrgNamesInState = (device, org) => {
    this.setState({
      deviceName: device,
      orgName: org
    })
  }

  setVarsInState = (varsObj) => {
    this.setState({
      vars: varsObj
    })
  }

  setValueInState = (type, value) => {
    this.setState({
      [type]: value
    })
  }

  setUserVarsInState(varsObj){
    varsObj["hosts"] = varsObj['hosts'].filter(v => v.slice(0,5) === "user_").map(uv => uv.slice(5))
    varsObj["services"] = varsObj['services'].filter(v => v.slice(0,5) === "user_").map(uv => uv.slice(5))
    this.setState({
      userVars: varsObj
    })
  }


  getUdfDataForTable(data){
    let hostVarObjects = []
    if(data['host'].vars){
      let hostVarStrings = Object.keys(data['host'].vars).filter(v => v.slice(0,5) === "user_").map(uv => uv.slice(5))
      for(let i=0; i<hostVarStrings.length; i++){
        let hostVar = hostVarStrings[i]
        let hostVarValue = data['host'].vars[`user_${hostVar}`]
        hostVarObjects.push({udfName: hostVar, udfValue: hostVarValue})
      }
    }
    let serviceVarObjects = []
    for(let si=0; si<data['services'].length; si++){
      let serviceInstance = []
      if(data['services'][si].vars){
        let serviceVarStrings = Object.keys(data['services'][si].vars).filter(v => v.slice(0,5) === "user_").map(uv => uv.slice(5))
        for(let vi=0; vi<serviceVarStrings.length; vi++){
          let serviceVar = serviceVarStrings[vi]
          let serviceVarValue = data['services'][si].vars[`user_${serviceVar}`]
          serviceInstance.push({udfName: serviceVar, udfValue: serviceVarValue})
        }
      }
      serviceVarObjects.push(serviceInstance)
    }
    this.setState({
      hostUdfChartData: hostVarObjects,
      servicesUdfChartData: serviceVarObjects
    })
  }


  setHostVarInState = (hostVar) => {
    this.setState({
      hostVar: hostVar
    })
  }

  setHostVarValueInState = (hostVarValue) => {
    this.setState({
      hostVarValue: hostVarValue
    })
  }

  setSelectedServiceVarsInState = (selectedServiceVar, index) => {
    let serviceVars = {...this.state.selectedServiceVars}
    serviceVars[index] = selectedServiceVar
    this.setState({
      selectedServiceVars: serviceVars
    })
  }

  setServiceVarsInState = (serviceVar, index) => {
    let vars = {...this.state.serviceVars}
    vars[index] = serviceVar
    this.setState({
      serviceVars: vars
    })
  }

  setServiceVarValuesInState = (serviceVarValue, index) => {
    let values = {...this.state.serviceVarValues}
    values[index] = serviceVarValue
    this.setState({
      serviceVarValues: values
    })
  }

  setChartDataHasBeenUpdated = (bool) => {
    this.setState({
      chartDataHasBeenUpdated: bool
    })
  }

  setUdfChartData = (data) => {
    this.setState({
      udfChartData: data
    })
  }

  updateUdfChartData = (data) => {
    this.setState({
      udfChartData: data
    })
  }

  updateService = (target, index) => {

    let newServices = [...this.state.services]

    let options = {
      'Service Name': ['object_name'],
      'Label': ['snmp_label'],
      'Precursor Level One': ['snmp_warning'],
      'Incident Level One': ['snmp_critical'],
      'Precursor Level Two': ['snmp_warning'],
      'Incident Level Two': ['snmp_critical'],
      'Threshold Type': ['snmp_threshold_direction'],
      'Precursor Ticket Priority': ['warning_priority'],
      'Incident Ticket Priority': ['critical_priority'],
      'Priority': ['jira_priority'],
    }

    let option = options[target.name]
    let value = target.value

    if(newServices[index].vars.snmp_threshold_direction === "range" && (target.name === 'Precursor Level One' || target.name === 'Incident Level One')){
      if(!newServices[index].vars[options[target.name]]){
        value = `${target.value}:`
      } else {
        value = `${target.value}:${newServices[index].vars[options[target.name]].slice(newServices[index].vars[options[target.name]].indexOf(':')+1)}`
      }
    } else if (newServices[index].vars.snmp_threshold_direction === "range" && (target.name === 'Precursor Level Two' || target.name === 'Incident Level Two')){
      if(!newServices[index].vars[options[target.name]]){
        value = `:${target.value}`
      } else {
        value = `${newServices[index].vars[options[target.name]].slice(0,newServices[index].vars[options[target.name]].indexOf(':'))}:${target.value}`
      }
    }

    if(option[0] === "object_name"){
      newServices[index][option] = value
    } else {
      newServices[index]['vars'][option] = value
    }

    this.setState({
      services: newServices
    })
  }


  setDate = (dateType, date) => {
    this.setState({
      [dateType]: date
    })
  }


  mapAllCharts = (data, type) => {

    let graphs = []
    let strings = []

    for(let i=1; i<data.length; i++){
      if (Array.isArray(data[i])){
        if (data[i][0]['Type'] === 'Host'){
          graphs.unshift(data[i])
        } else {
          graphs.push(data[i])
        }
      } else {
        strings.push(data[i])
      }
    }
    let allResults = strings.concat(graphs)
    if(allResults.length > 1){

      if (type === 'strings'){
        return strings.map((element, i) => {
          if (typeof element === 'string') {
              var static_data = element.split(";+;")
              this.setState({
                stringsHaveBeenRendered: true
              })
              return React.createElement(TextBlock, {static_display_name: static_data[0], static_output: static_data[1], key: i})
          } else {
              this.setState({
                stringsHaveBeenRendered: true
              })
              return null
          }
        })
      } else if (type === 'graphs'){
        return graphs.map((element, i) => {
          let chartProps = {
            chartdata: element,
            key: i,
            index: i
          }
          if (Array.isArray(element) && element.length) {
              this.setState({
                graphsHaveBeenRendered: true,
                showStatic: true
              })
              return React.createElement(ChartContainer, chartProps)
          } else {
              this.setState({
                graphsHaveBeenRendered: true,
                showStatic: true
              })
              return null
          }
        })
      }
    } else {
      let chartProps = {
        chartdata: [
          {
            datapoints: [
              [null, Math.floor(this.state.startDate.getTime()/1000)-70000],
              [null, Math.floor(this.state.endDate.getTime()/1000)+20000]
            ]
          }
        ],
        key: 0,
        index: 0
      }
      this.setState({
        emptyRender: true,
        showStatic: true
      })
      return React.createElement(ChartContainer, chartProps)
      }
  }




  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }



  newDateFetch = async () => {
    if(window.location.search !== ""){
      await this.fetchDataForSelectedTreeItem(this.state.treeItemInfo)
      this.setState({
        dateAndTimeHaveBeenChanged: true
      })
    }
  }






  saveTreeItemInfo = (info) => {
    this.setState({
      treeItemInfo: info
    })
  }






  fetchDataForSelectedTreeItem = async (treeItemInfo) => {

    this.setState({
      fetchHasStarted: true,
      showStatic: false
    })

    let cluster

    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    let startDateString = this.state.startDate.toString()
    let endDateString = this.state.endDate.toString()

    await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'device',
        organization: treeItemInfo.organization,
        name: treeItemInfo.name,
        startDate: startDateString,
        endDate: endDateString,
        timeZone: timeZone
      }
    })
    .then((res) => {
      return res.json()})
    .then(async function(json) {

      console.log(json)

      cluster = json[0]

      let configData = json.filter(el => !Array.isArray(el) && typeof el !== 'string')

      this.setServicesInState(configData[0].services)

      this.setObjectNameInState(configData[0].host.object_name)
      this.setDisplayNameInState(configData[0].host.display_name)

      if(configData[0].withtemplate.imports !== undefined){
        this.setTemplateInState(configData[0].withtemplate.imports[0])
      }

      if(configData[0].host.groups !== undefined){
        this.setValueInState('group', configData[0].host.groups)
      } else {
        this.setValueInState('group', [])
      }

      if(configData[0].host.vars && configData[0].host.vars.priority !== undefined){
        this.setPriorityInState(configData[0].host.vars.priority)
      }

      if(configData[0].host.vars && configData[0].host.vars.snmp_oid_index !== undefined){
        this.setOidInState(configData[0].host.vars.snmp_oid_index)
      } else {
        this.setOidInState(null)
      }

      if(configData[0].host.vars && configData[0].host.vars.snmp_host_ip !== undefined){
        this.setHostIpInState(configData[0].host.vars.snmp_host_ip)
      } else {
        this.setHostIpInState(null)
      }

      if(configData[0].host.vars && configData[0].host.vars.sla !== undefined){
        this.setValueInState('sla', true)
      } else {
        this.setValueInState('sla', false)
      }

      if(configData[0].host.check_command === "check_snmp_logic"){
        this.setValueInState('ip', configData[0].host.vars.snmp_host_ip )
        this.setState({
          dasDevice: true
        })
      } else {
        this.setValueInState('ip', configData[0].host.address )
        this.setState({
          dasDevice: false
        })
      }

      let hostNameTypes = this.props.state.organizations[Object.keys(this.props.state.organizations)[this.props.cluster_list.indexOf(treeItemInfo.organization)]].host_data.map(host => {
         return {
           "name":host.attrs.name,
           "display_name":host.attrs.display_name
         }
       })
      hostNameTypes.push({"name":null, "display_name":"None"})

      this.setValueInState('host_name_types', hostNameTypes)

      if(configData[0].host.vars && configData[0].host.vars.parent_host !== undefined){
        let hostDisplayName = hostNameTypes.find(nameObj => nameObj.name === configData[0].host.vars.parent_host).display_name
        this.setValueInState('parent_host', hostDisplayName)
      } else {
        this.setValueInState('parent_host', "None")
      }

      //Set Check Interval for Host
      let checkIntervalObject = this.convertCheckIntervalToTime(configData[0]['host'].check_interval)
      this.setValueInState('check_units', checkIntervalObject.check_units)
      this.setValueInState('check_interval', checkIntervalObject.check_interval)

      //Set Check Interval for services
      let serviceObjectNames = configData[0].services.map(service => service.object_name)
      let servicesCheckIntervals = {}
      let servicesCheckUnits = {}
      for(let i=0; i<configData[0].services.length; i++){
        let checkIntervalObjectForCurrentService = this.convertCheckIntervalToTime(configData[0].services[i].check_interval || null)
        let units = checkIntervalObjectForCurrentService.check_units
        let intervals = checkIntervalObjectForCurrentService.check_interval
        servicesCheckIntervals[serviceObjectNames[i]] = units
        servicesCheckUnits[serviceObjectNames[i]] = intervals
      }
      this.setValueInState('service_object_names', serviceObjectNames)
      this.setValueInState('check_units_services', servicesCheckIntervals)
      this.setValueInState('check_interval_services', servicesCheckUnits)



      this.setValueInState("max_check_attempts", configData[0]['host'].max_check_attempts)

      let hostAndServiceObj = {}
      hostAndServiceObj['host'] = configData[0]['host']
      hostAndServiceObj['services'] = configData[0]['services']
      this.getUdfDataForTable(hostAndServiceObj)

      this.setTemplatesInState(configData[0].templates.objects)
      this.setGroupsInState(configData[0].hostgroups.objects)

      this.setChartDataInState(json)
      this.updateDimensions()

      this.setDeviceAndOrgNamesInState(treeItemInfo.name, treeItemInfo.organization)

      await this.setChartDataHasBeenUpdated(false)
      this.setChartDataHasBeenUpdated(true)
    }.bind(this))


    await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'vars',
        cluster: cluster,
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      this.setVarsInState(json)
      this.setUserVarsInState(json)
    })

    this.setState({
      fetchHasStarted: undefined,
    })

};



  convertCheckIntervalToTime(interval){
    if(!interval){
      return {check_units: "Days", check_interval: null}
    }
    //if units are in days
    if(interval % 86400 === 0){
      return {check_units: "Days", check_interval: interval/86400}
    //if units are in hours
  } else if(interval % 3600 === 0){
      return {check_units: "Hours", check_interval: interval/3600}
    //if units are in minutes
    } else {
      return {check_units: "Hours", check_interval: interval/60}
    }
  }






  //Update when the conditions that return true are met
  //Don't update when the conditions that return false are met
  //Note that the order in which these are evaluated has significance
  shouldComponentUpdate(nextProps, nextState){
    //if a new device is selected
    let prevQuery = queryString.parse(this.props.location.search)
    let nextQuery = queryString.parse(nextProps.location.search)
    if(prevQuery.device !== nextQuery.device || prevQuery.org !== nextQuery.org){
      this.triggerNewQueryFetch(nextQuery)
      return true
    }
    //if any of the following variables have changed
     if(
      this.state.startDate !== nextState.startDate ||
      this.state.endDate !== nextState.endDate ||
      this.state.objectName !== nextState.objectName ||
      this.state.displayName !== nextState.displayName ||
      this.state.templates !== nextState.templates ||
      this.state.template !== nextState.template ||
      this.state.groups !== nextState.groups ||
      this.state.group !== nextState.group ||
      this.state.oid !== nextState.oid ||
      this.state.priority !== nextState.priority ||
      this.state.hostip !== nextState.hostip ||
      this.state.services !== nextState.services ||
      this.state.deviceName !== nextState.deviceName ||
      this.state.vars !== nextState.vars ||
      this.state.hostVar !== nextState.hostVar ||
      this.state.hostVarValue !== nextState.hostVarValue ||
      this.state.serviceVars !== nextState.serviceVars ||
      this.state.selectedServiceVars !== nextState.selectedServiceVars ||
      this.state.serviceVarValues !== nextState.serviceVarValues ||
      this.state.ip !== nextState.ip ||
      this.state.sla !== nextState.sla ||
      this.state.check_interval !== nextState.check_interval ||
      this.state.check_units !== nextState.check_units ||
      this.state.max_check_attempts !== nextState.max_check_attempts ||
      this.state.parent_host !== nextState.parent_host ||
      this.state.check_units_services !== nextState.check_units_services ||
      this.state.check_interval_services !== nextState.check_interval_services ||
      this.state.service_object_names !== nextState.service_object_names ||
      this.state.showStatic !== nextState.showStatic
    ){
      return true
    }
    //new fetch from DefaultLayout
     else if(this.props.fetchnum !== nextProps.fetchnum){
      return true
    }
    //if the component is in the process of fetching new date, then render
    else if(this.state.fetchHasStarted || nextState.fetchHasStarted){
      return true
    }
    //if user switches tabs
    else if(this.state.activeTab !== nextState.activeTab){
      return true
    }
    //if there has been no time change and no change in date and no change in chart data mapping abd a new query is not in progress
    else if( !this.state.dateAndTimeHaveBeenChanged && ((!this.state.stringsHaveBeenRendered && !this.state.graphsHaveBeenRendered) || !this.state.emptyRender) ) {
      return false
    }
    //if new data has been mapped to form charts
    else if(
        (
          (nextState.stringsHaveBeenRendered && this.state.graphsHaveBeenRendered) ||
          (this.state.stringsHaveBeenRendered && nextState.graphsHaveBeenRendered) ||
          (nextState.stringsHaveBeenRendered && nextState.graphsHaveBeenRendered)
        ) ||
          this.state.emptyRender){
        this.setState({
          stringsHaveBeenRendered: false,
          graphsHaveBeenRendered: false,
          emptyRender: false,
          dateAndTimeHaveBeenChanged: false,
        })
        return false
    } else {
      // else i.e. the page has loaded and user has not clicked a device
      return true
    }
  }







  render(){

    return (

      <div >

        <div style={{
          display: 'flex',
          top: '65px',
          background: '#fff',
          height: '45px',
          width: '100%',
          zIndex: '100',
          marginLeft: '1px'
          // borderBottom: '.5px solid',
          // borderColor: 'lightgrey'
        }}>


            <div style={{margin: '5px'}}>
              <DateSelectorModal
                startdate={this.state.startDate}
                enddate={this.state.endDate}
                setdate={this.setDate}
                newdatefetch={this.newDateFetch}
              />
            </div>

        </div>

        <Container style={{backgroundColor: '#e4e7ea', maxHeight: `${window.innerHeight-300}px`, padding: '12px'}} fluid>

          <Row style={{display: 'flex', flexWrap: 'wrap'}}>

            { Object.keys(this.props.state.organizations).length === this.props.state.cluster_access_length &&

            <>

                <Col id='devices' style={{ height: 'auto', width: 'auto', maxWidth: '20%', minWidth: '350px' }}>
                  <Card style={{marginBottom: '18px'}} raised>
                    <CardHeader title='Device List' />
                      <IndividualDeviceBoardChild
                        updatedimensions={this.updateDimensions}
                        state={this.state}
                        data={this.props.data}
                        organizations={this.props.state.organizations}
                        clusteraccessjoined={this.props.state.clusterAccessJoined}
                        setvarsinstate={this.setVarsInState}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        tabpane={this.tabPane}
                        setchartdatahasbeenupdated={this.setChartDataHasBeenUpdated}
                        savetreeiteminfo={this.saveTreeItemInfo}
                        fetchdataforselectedtreeitem={this.fetchDataForSelectedTreeItem}
                        treeiteminfo={this.state.treeItemInfo}
                        fetchdata={this.props.fetchdata}
                      />
                  </Card>

                </Col>
                <Col>

                  <Card style={{ height: `auto`, minHeight: `${window.innerHeight-140}px`, paddingLeft: '8px', paddingRight: '8px', marginBottom: '11px'}} raised>
                    <CardHeader title='Device Details'
                    action={
                      <div style={{display: 'flex'}}>
                        <div style={{margin: '5px'}}>
                          <SilenceAlarm/>
                        </div>
                        <div style={{margin: '5px'}}>
                          <CheckNowButton
                            scheduleCheck={this.scheduleCheck}
                            devicename={this.state.deviceName}
                            orgname={this.state.orgName}
                          />
                        </div>
                      </div>
                    }/>
                      <Row style={{marginLeft: '7px', marginRight: '7px'}}>
                          <Col>
                            <DeviceBoardTabs

                              objectname={this.state.objectName}
                              setobjectnameinstate={this.setObjectNameInState}

                              displayname={this.state.displayName}
                              setdisplaynameinstate={this.setDisplayNameInState}

                              templates={this.state.templates}
                              settemplatesinstate={this.setTemplatesInState}

                              template={this.state.template}
                              settemplateinstate={this.setTemplateInState}

                              groups={this.state.groups}
                              setgroupsinstate={this.setGroupsInState}

                              group={this.state.group}
                              setgroupinstate={this.setGroupInState}

                              oid={this.state.oid}
                              setoidinstate={this.setOidInState}

                              priority={this.state.priority}
                              setpriorityinstate={this.setPriorityInState}

                              hostip={this.state.hostip}
                              sethostipinstate={this.setHostIpInState}

                              services={this.state.services}
                              updateservice={this.updateService}

                              devicename={this.state.deviceName}
                              orgname={this.state.orgName}

                              setVarsInState={this.setVarsInState}
                              vars={this.state.vars}

                              sethostvarinstate={this.setHostVarInState}
                              hostvar={this.state.hostVar}

                              sethostvarvalueinstate={this.setHostVarValueInState}
                              hostvarvalue={this.state.hostVarValue}

                              servicevars={this.state.serviceVars}
                              setservicevarsinstate={this.setServiceVarsInState}

                              selectedservicevars={this.state.selectedServiceVars}
                              setselectedservicevarsinstate={this.setSelectedServiceVarsInState}

                              servicevarvalues={this.state.serviceVarValues}
                              setservicevarvaluesinstate={this.setServiceVarValuesInState}

                              fetchdata={this.props.fetchdata}

                              fetchhasstarted={this.state.fetchHasStarted}
                              chartdatahasbeenupdated={this.state.chartDataHasBeenUpdated}
                              chartdata={this.state.chartData}
                              mapallcharts={this.mapAllCharts}

                              hostudfchartdata={this.state.hostUdfChartData}
                              servicesudfchartdata={this.state.servicesUdfChartData}

                              updateudfchartdata={this.updateUdfChartData}

                              uservars={this.state.userVars}

                              setvalueinstate={this.setValueInState}

                              ip={this.state.ip}

                              sla={this.state.sla}

                              check_interval={this.state.check_interval}
                              check_units={this.state.check_units}
                              max_check_attempts={this.state.max_check_attempts}
                              parent_host={this.state.parent_host}
                              host_name_types={this.state.host_name_types}

                              dasdevice={this.state.dasDevice}

                              check_units_services={this.state.check_units_services}
                              check_interval_services={this.state.check_interval_services}
                              service_object_names={this.state.service_object_names}

                              showstatic={this.state.showStatic}

                            />

                          </Col>
                      </Row>
                  </Card>

              </Col>

              </>

              }

          </Row>

        </Container>

      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    newAlert: (content, severity) => dispatch(allActions.appActions.newAlert(content, severity)),
  };
}


export default compose(
  withAuth,
  connect(
    null,
    mapDispatchToProps,
  ),
)(IndividualDeviceBoard);
