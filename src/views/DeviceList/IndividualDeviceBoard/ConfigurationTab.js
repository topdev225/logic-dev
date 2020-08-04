import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PublishIcon from '@material-ui/icons/Publish';
import UdfContainer from './UdfContainer'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MonitoringPolicy from './MonitoringPolicy'
import RemoteAccess from './RemoteAccess'
import { ClassicSpinner } from "react-spinners-kit";
import {
  Card,
  CardContent,
  CardHeader
} from '@material-ui/core';
import {
  Col,
  Row,
} from 'reactstrap';
import allActions from '../../../redux/actions'
import { connect } from "react-redux";

class ConfigurationTab extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      addedHostVars: [],
      addedServiceVars: {},
      hostUdfChartData: this.props.hostudfchartdata,
      servicesUdfChartData: this.props.servicesudfchartdata
    };
    this.filter = createFilterOptions()
  }


  updateHostUdfChartData = (data, index) => {
    this.setState({
      hostUdfChartData: data
    })
  }


  updateServiceUdfChartData = (data, index) => {
    let servicesUdfChartData = [...this.state.servicesUdfChartData]
    servicesUdfChartData[index] = data
    this.setState({
      servicesUdfChartData: servicesUdfChartData
    })
    //
  }



  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }



  async post(){

    let hostUpdates = {
      "object_name": this.props.objectname,
      "display_name": this.props.displayname,
      "imports": [this.props.template],
      "groups": [this.props.group],
      "max_check_attempts": this.props.max_check_attempts,
      "vars.priority": this.props.priority,
      "vars.snmp_oid_index": this.props.oid,
      "vars.snmp_host_ip": this.props.hostip,
      "vars.sla": this.props.sla,
      "vars.parent_host": this.props.host_name_types.find(hostObj => hostObj.display_name === this.props.parent_host).name
    }
    if(this.props.dasdevice === true){
      hostUpdates['vars.snmp_host_ip'] = this.props.ip
    } else {
      hostUpdates['address'] = this.props.ip
    }

    hostUpdates['check_interval'] = this.getIntervalFromUnits(this.props.check_units, this.props.check_interval)

    for(let i=0; i<this.state.hostUdfChartData.length; i++){
      hostUpdates[`vars.user_${this.state.hostUdfChartData[i].udfName}`] = this.state.hostUdfChartData[i].udfValue
    }

    let stringifiedHostUpdates = JSON.stringify(hostUpdates)

    let serviceUpdates = [...this.props.services]

    //empy all user vars and then add all current user vars back in.
    //this will ensure any deleted vars are removed
    for(let si=0; si<serviceUpdates.length; si++){
      let userVars = Object.keys(serviceUpdates[si].vars).filter(name => name.slice(0,5) === "user_")
      for(let uvi=0; uvi<userVars.length; uvi++){
        delete serviceUpdates[si].vars[userVars[uvi]]
      }
      for(let index=0; index<this.state.servicesUdfChartData[si].length; index++){
        let varName = `user_${this.state.servicesUdfChartData[si][index].udfName}`
        let varValue = this.state.servicesUdfChartData[si][index].udfValue
        serviceUpdates[si]['vars'][varName] = varValue
      }
      serviceUpdates[si]['check_interval'] = this.getIntervalFromUnits(this.props.check_units_services[this.props.service_object_names[si]], this.props.check_interval_services[this.props.service_object_names[si]])
    }

    let changesHaveBeenMade = false

    await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'posthosts',
        organization: this.props.orgname,
        name: this.props.devicename,
        hostUpdates: stringifiedHostUpdates,
        groups: JSON.stringify(this.props.groups)
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      if(!!Object.keys(json).length){
        //write logic to update number in deploy badge with +1
        changesHaveBeenMade = true
      }
    })

    let stringifiedServiceUpdates = JSON.stringify(serviceUpdates)

    for(let serviceNum=0; serviceNum<this.props.services.length; serviceNum++){

      let serviceChanges = changesHaveBeenMade

      await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
        headers: {
          function: 'postservices',
          organization: this.props.orgname,
          name: this.props.devicename,
          serviceupdates: stringifiedServiceUpdates,
          servicenum: serviceNum,
        }
      })
      .then((res) => {
        return res.json()})
      .then((json) => {
        if(!!Object.keys(json).length && !json.error){
          // eslint-disable-next-line
          serviceChanges = true
        }
      })
      changesHaveBeenMade = serviceChanges
    }

    if(changesHaveBeenMade){
      this.props.newAlert(`Changes to ${this.props.displayname} have been saved`, 'success')
    } else {
      this.props.newAlert(`There are no changes to be saved`, 'warning')
    }

  }



  getIntervalFromUnits(units, interval){
    if(units === "Days"){
        return interval * 86400
    } else if(units === "Hours"){
        return interval * 3600
    } else if (units === "Minutes") {
        return interval * 60
    }
  }




  deleteHost(){
    let confirm = window.confirm(`Delete ${this.props.displayname}?`)
    if(confirm){
      let hostObj = {
        imports: [this.props.template],
        object_name: this.props.devicename,
        object_type: "object"
      }
      fetch(`${process.env.REACT_APP_FETCH_URL}`,{
        headers: {
          function: 'deletehost',
          organization: this.props.orgname,
          hostobj: JSON.stringify(hostObj),
          hostname: this.props.devicename
        }
      })
      .then((res) => {
        return res.json()})
      .then((json) => {
        if(!json.error){
          this.props.newAlert(`${this.props.displayname} has been deleted`, 'info')
        } else {
          this.props.newAlert(`Host has already been deleted. Changes have not been deployed`, 'error')
        }
      })
    } else {
      return
    }
  }



  addNewHostVar(name, value){
    this.setState({
      addedHostVars: [...this.state.addedHostVars, {[name]: value}]
    })
  }



  addNewServiceVar(name, value, index){
    let serviceVars = {...this.state.addedServiceVars}
    if (!serviceVars[index]){
      serviceVars[index] = []
    }
    serviceVars[index].push( {[name]: value} )
    this.setState({
      addedServiceVars: serviceVars
    })
  }





  deleteHostVar(index){
    let hostVars = [...this.state.addedHostVars]
    hostVars.splice(index, 1)
    this.setState({
      addedHostVars: hostVars
    })
  }



  deleteServiceVar(objIndex, arrIndex){
    let serviceVars = {...this.state.addedServiceVars}
    serviceVars[objIndex].splice(arrIndex, 1)
    this.setState({
      addedServiceVars: serviceVars
    })
  }





  deploy(){
    //TODO: Determine if there are updates to deploy and use conditional logic to determine if the deploy needs to run
    this.setState({
      deployHasStarted: true
    })
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'deploy',
        organization: this.props.orgname,
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      if(!!json.checksum){
        this.props.newAlert('Updates have been deployed.', 'success')
        this.props.fetchdata()
      }
    })
    this.setState({
      deployHasStarted: undefined
    })
  }




  render() {

    //Negative margins are bad practice.
    //They were necessary in the container div as a solution to override the padding in the tab panel
    //Hopefully a better solution can be determined someday
    return (
      <div className="animated fadeIn" style={{width: '100%', right: '0px', left: '0px'}}>

        <Row>

          <Col >
            <Card elevation={4}>
              <CardHeader
                title='Device Information'
                style={{display: 'flex', flexWrap: 'wrap'}}
                action={
                  <div style={{marginTop: '25px', marginRight: '50px', display: 'flex', flexWrap: 'wrap'}}>
                    <div>
                      <FormControlLabel
                        value="sla"
                        control={
                          <Switch
                            checked={this.props.sla}
                            onChange={() => this.props.setvalueinstate('sla', !this.props.sla)}
                            color="primary"
                            name="checkedB"
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                        }
                        label="SLA"
                        labelPlacement="start"
                      />
                    </div>
                    <div style={{marginLeft: '15px'}}>
                      <MonitoringPolicy/>
                    </div>
                    {this.props.dasdevice === false &&
                    <div style={{marginLeft: '15px'}}>
                      <RemoteAccess/>
                    </div>
                    }
                  </div>
                }
              />
              <CardContent style={{padding: '0px'}}>

                <div >

                  <Col style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>

                        <TextField
                          style={{width: "250px", margin: '15px'}}
                          defaultValue={""}
                          value={ this.props.objectname }
                          onChange={(e) => this.props.setobjectnameinstate(e.target.value)}
                          label={"DEVICE NAME"}
                          fullwidth
                        />

                        <TextField
                          style={{width: "250px", margin: '15px'}}
                          defaultValue={""}
                          value={ this.props.displayname }
                          onChange={(e) => this.props.setdisplaynameinstate(e.target.value)}
                          label={"DISPLAY NAME"}
                          fullwidth
                        />

                        <TextField
                          style={{width: "250px", margin: '15px'}}
                          defaultValue={""}
                          value={ this.props.ip }
                          onChange={(e) => this.props.setvalueinstate('ip', e.target.value)}
                          label={"IP"}
                          fullwidth
                        />

                        <Autocomplete
                          id="combo-box-demo"
                          options={this.props.templates ? this.props.templates.map(template => template.object_name) : []}
                          getOptionLabel={option => option}
                          style={{ width: 250, margin: '15px' }}
                          value={this.props.template ? this.props.template : null}
                          onChange={(e) => this.props.settemplateinstate(e.target.textContent)}
                          renderInput={params => (
                            <TextField {...params} style={{width: "250px"}} label={'DEVICE TYPE'} fullwidth />
                          )}
                        />

                        { !!this.props.chartdata &&
                          <Autocomplete
                            multiple
                            freeSolo
                            filterOptions={(options, params) => {
                              const filtered = this.filter(options, params);
                              if (params.inputValue !== '') {
                                filtered.push(`Add "${params.inputValue}"`);
                              }
                              return filtered;
                            }}
                            id="combo-box-demo"
                            options={this.props.groups ? this.props.groups.map(group => group.display_name) : []}
                            getOptionLabel={option => option}
                            style={{ width: 250, margin: '15px' }}
                            value={this.props.groups && this.props.group ? this.props.groups.filter(obj => this.props.group.includes(obj.object_name)).map(group => group.display_name) : null}
                            onChange={(e) => this.props.setgroupinstate([], e)  }
                            renderInput={params => (
                              <TextField {...params} style={{width: "250px"}} label={'GROUPS'} />
                            )}
                          />
                        }

                        <Autocomplete
                          id="combo-box-demo"
                          options={this.props.host_name_types ? this.props.host_name_types.map(nameObj => nameObj.display_name) : []}
                          getOptionLabel={option => option}
                          style={{ width: 250, margin: '15px' }}
                          value={this.props.parent_host}
                          onChange={(e) => this.props.setvalueinstate('parent_host', e.target.textContent)}
                          renderInput={params => (
                            <TextField {...params} style={{width: "250px"}} label={'PARENT HOST'} fullwidth />
                          )}
                        />

                        <div style={{display: 'flex', margin: '15px'}}>
                          <div>
                            <TextField
                              style={{width: "120px"}}
                              value={ this.props.check_interval < 1 ? 1 : this.props.check_interval }
                              onChange={(e) => this.props.setvalueinstate('check_interval', e.target.value)}
                              label={"CHECK EVERY"}
                              type={'number'}
                            />
                          </div>
                          <div>
                            <FormControl>
                              <InputLabel></InputLabel>
                              <Select
                                style={{width: "120px", marginLeft: '10px'}}
                                value={this.props.check_units}
                                onChange={(e) => this.props.setvalueinstate('check_units', e.target.value)}
                              >
                                <MenuItem value={"Minutes"}>Minutes</MenuItem>
                                <MenuItem value={"Hours"}>Hours</MenuItem>
                                <MenuItem value={"Days"}>Days</MenuItem>
                              </Select>
                            </FormControl>
                          </div>
                        </div>
                        <TextField
                          style={{width: "250px", margin: '15px'}}
                          value={ this.props.max_check_attempts < 1 ? 1 : this.props.max_check_attempts }
                          onChange={(e) => this.props.setvalueinstate('max_check_attempts', e.target.value)}
                          label={"DOWN AFTER"}
                          type={'number'}
                        />

                        <TextField
                          style={{width: "250px", margin: '15px'}}
                          defaultValue={""}
                          value={ this.props.priority }
                          onChange={(e) => this.props.setpriorityinstate(e.target.value)}
                          label={"TICKET PRIORITY"}
                        />

                        {
                          this.props.oid &&
                            <TextField
                              style={{width: "250px", margin: '15px'}}
                              defaultValue={" "}
                              value={ this.props.oid }
                              onChange={(e) => this.props.setoidinstate(e.target.value)}
                              label={"OID Index"}
                            />
                        }

                  </Col>

                </div>

                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {this.state.addedHostVars.map((varObj, i) =>
                    <div style={{margin: '10px'}}>
                      <Badge color="secondary" badgeContent={"x"} onClick={() => this.deleteHostVar(i)}>
                        <TextField
                          style={{width: "250px"}}
                          value={ varObj[Object.keys(varObj)[0]] }
                          label={ Object.keys(varObj)[0] }
                          fullwidth
                          disabled
                        />
                      </Badge>
                    </div>
                  )}
                </div>

                <br/>

                <UdfContainer
                  options={this.props.uservars ? this.props.uservars.hosts : []}
                  data={this.state.hostUdfChartData}
                  setdata={this.updateHostUdfChartData}
                  index={null}
                />

              </CardContent>
            </Card>
          </Col>
        </Row>

    <br/>

    <div style={{marginLeft: '-15px', marginRight: '-17px'}}>
      {this.props.services && this.props.services.map((service, i) =>
        <Col >
          <Card style={{marginBottom: '20px'}} elevation={4}>
            <CardHeader title='Service' />

              <CardContent style={{padding: '0px'}}>

                <Col >

                <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>

                    <TextField
                      style={{width: "250px", margin: '15px'}}
                      key={i}
                      id={i}
                      onChange={(e) => this.props.updateservice(e.target, i)}
                      name={"Service Name"}
                      label={"SERVICE NAME"}
                      value={this.props.services[i].object_name}
                      fullwidth
                    />

                    <div style={{display: 'flex', margin: '15px'}}>
                      <div>
                        <TextField
                          style={{width: "120px"}}
                          defaultValue={null}
                          value={ this.props.check_interval_services[this.props.service_object_names[i]] < 1 ? 1 : this.props.check_interval_services[this.props.service_object_names[i]] }
                          onChange={(e) => this.props.setvalueinstate('check_interval_services', {...this.props.check_interval_services, [this.props.service_object_names[i]]: parseInt(e.target.value)})}
                          name={"Check Every"}
                          label={"CHECK EVERY"}
                          type={'number'}
                        />
                      </div>
                      <div>
                        <FormControl>
                          <InputLabel></InputLabel>
                          <Select
                            style={{width: "120px", marginLeft: '10px'}}
                            value={this.props.check_units_services[this.props.service_object_names[i]]}
                            onChange={(e) => this.props.setvalueinstate('check_units_services', {...this.props.check_units_services, [this.props.service_object_names[i]]: e.target.value})}
                          >
                            <MenuItem value={"Minutes"}>Minutes</MenuItem>
                            <MenuItem value={"Hours"}>Hours</MenuItem>
                            <MenuItem value={"Days"}>Days</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>


                    <div style={{margin: '15px'}}>
                      <FormControl>
                        <InputLabel>THRESHOLD TYPE</InputLabel>
                        <Select
                          style={{width: "250px"}}
                          value={this.props.services[i].vars && this.props.services[i].vars.snmp_threshold_direction}
                          onChange={(e) => this.props.updateservice(e.target, i)}
                          name={"Threshold Type"}
                          key={i}
                        >
                          <MenuItem value={null}>&nbsp;</MenuItem>
                          <MenuItem value={"range"}>Range</MenuItem>
                          <MenuItem value={"greater-than"}>Greater Than</MenuItem>
                          <MenuItem value={"less-than"}>Less Than</MenuItem>
                          <MenuItem value={"equal"}>Equal</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <TextField
                      style={{width: "250px", margin: '15px', display: !this.props.services[i].vars.snmp_threshold_direction && 'none'}}
                      key={i}
                      id={i}
                      onChange={(e) => this.props.updateservice(e.target, i)}
                      name={"Label"}
                      label={"LABEL"}
                      value={this.props.services[i].vars.snmp_label || null}
                      fullwidth
                    />

                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>

                      <Paper style={{display: 'flex', flexDirection: 'column', margin: '15px', backgroundColor: '#ECECEC', padding: '10px'}}>
                        <Typography>PRECURSOR SETTINGS</Typography>
                        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                          <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '10px'}}>
                            <TextField
                              style={{width: this.props.services[i].vars.snmp_threshold_direction === "range" ? "120px" : "250px"}}
                              value={ (this.props.services[i].vars && this.props.services[i].vars.snmp_warning) && (this.props.services[i].vars.snmp_warning.includes(':') ? this.props.services[i].vars.snmp_warning.slice(0,this.props.services[i].vars.snmp_warning.indexOf(':')) : this.props.services[i].vars.snmp_warning )}
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              label={" "}
                              name={"Precursor Level One"}
                              type={'number'}
                            />
                            <TextField
                              style={{width: "120px", marginLeft: '10px', display: this.props.services[i].vars.snmp_threshold_direction !== "range" && 'none'}}
                              value={ (this.props.services[i].vars && this.props.services[i].vars.snmp_warning) && this.props.services[i].vars.snmp_warning.slice(this.props.services[i].vars.snmp_warning.indexOf(':')+1) }
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              label={" "}
                              name={"Precursor Level Two"}
                              type={'number'}
                            />
                          </div>
                          <div>
                            <TextField
                              style={{width: "250px", margin: '10px'}}
                              key={i}
                              id={i}
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              name={"Precursor Ticket Priority"}
                              label={"TICKET PRIORITY"}
                              value={this.props.services[i].vars.warning_priority || null}
                              fullwidth
                            />
                          </div>
                        </div>
                      </Paper>


                      <Paper style={{display: 'flex', flexDirection: 'column', margin: '15px', backgroundColor: '#ECECEC', padding: '10px'}}>
                        <Typography>INCIDENT SETTINGS</Typography>
                        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
                          <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', margin: '10px'}}>
                            <TextField
                              style={{width: this.props.services[i].vars.snmp_threshold_direction === "range" ? "120px" : "250px"}}
                              value={ (this.props.services[i].vars && this.props.services[i].vars.snmp_critical) && (this.props.services[i].vars.snmp_critical.includes(':') ? this.props.services[i].vars.snmp_critical.slice(0,this.props.services[i].vars.snmp_critical.indexOf(':')) : this.props.services[i].vars.snmp_critical )}
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              label={" "}
                              name={"Incident Level One"}
                              type={'number'}
                            />
                            <TextField
                              style={{width: "120px", marginLeft: '10px', display: this.props.services[i].vars.snmp_threshold_direction !== "range" && 'none'}}
                              value={ (this.props.services[i].vars && this.props.services[i].vars.snmp_critical) && this.props.services[i].vars.snmp_critical.slice(this.props.services[i].vars.snmp_critical.indexOf(':')+1) }
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              label={" "}
                              name={"Incident Level Two"}
                              type={'number'}
                            />
                          </div>
                          <div>
                            <TextField
                              style={{width: "250px", margin: '10px'}}
                              key={i}
                              id={i}
                              onChange={(e) => this.props.updateservice(e.target, i)}
                              name={"Incident Level"}
                              label={"TICKET PRIORITY"}
                              value={this.props.services[i].vars.critical_priority || null}
                              fullwidth
                            />
                          </div>
                        </div>
                      </Paper>

                    </div>

                  <br/>

                  <UdfContainer
                    options={this.props.uservars ? this.props.uservars.services : []}
                    data={this.state.servicesUdfChartData[i]}
                    setdata={this.updateServiceUdfChartData}
                    index={i}
                  />

                </Col>

            </CardContent>
          </Card>
        </Col>
      )}
    </div>

      <br/>

    <AppBar position="absolute" color="default" style={{width: '100%', bottom: -5, top: 'auto', zIndex: '800'}}>
      <Toolbar style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{left: '10px', bottom: '16px', position: 'absolute'}}>
          <Tooltip id="toolTip" TransitionComponent={Zoom} title="Save">
            <Button onClick={() => this.post()} variant="contained" style={{color: '#fff', backgroundColor: '#43a047'}}>
                <SaveIcon/>
            </Button>
          </Tooltip>
        </div>
        <div style={{bottom: '16px', position: 'absolute'}}>
          <Tooltip id="toolTip" TransitionComponent={Zoom} placement="bottom" title="Deploy">
            <Button onClick={() => this.deploy()} variant="contained" color='primary' >
              {
                this.props.deployHasStarted ?
                  <ClassicSpinner
                    size={24}
                    color="#3f51b5"
                    loading={true}
                  />
                  :
                  <PublishIcon/>
              }
            </Button>
          </Tooltip>
        </div>
        <div style={{right: '10px', bottom: '16px', position: 'absolute'}}>
          <Tooltip id="toolTip" TransitionComponent={Zoom} title="Delete">
            <Button onClick={() => this.deleteHost()} variant="contained" style={{color: '#fff', backgroundColor: '#e53935'}}>
              <DeleteForeverIcon/>
            </Button>
          </Tooltip>
        </div>
      </Toolbar>
    </AppBar>

    </div>

    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    newAlert: (content, severity) => dispatch(allActions.appActions.newAlert(content, severity)),
  };
}


export default connect(
  null,
  mapDispatchToProps
)(ConfigurationTab);
