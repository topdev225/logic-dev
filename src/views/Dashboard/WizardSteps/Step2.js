import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../redux/actions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  labels: {
    textAlign: 'center',
    marginBottom: '10px',
    marginTop: '20px'
  },
  buttonParent: {
    textAlign: 'center',
    display: 'block',
    marginBottom: '5px'
  }
}))


export default function Step2(props) {

  const selectedOrganizations = useSelector(state => state.selectedOrganizations.organizations)
  const selectedDevices = useSelector(state => state.selectedDevices)
  const selectedServices = useSelector(state => state.selectedServices)
  const populatedServices = useSelector(state => state.populatedServices)


  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch()

  let allDevices = []

  let orgDisplayNames = selectedOrganizations.map(orgObj => orgObj.displayName)



  //Get all devices for selected organizations anr push into allDevices array
  for (let i=0; i<selectedOrganizations.length; i++){
    let orgDevices = props.organizations[orgDisplayNames[i]].host_data
    let orgDisplayName = orgDisplayNames[i]
    let orgName = selectedOrganizations.find(orgObj => orgObj.displayName === orgDisplayName).orgName
    for(let index=0; index<orgDevices.length; index++){
      orgDevices[index]['org'] = orgName
      allDevices.push(orgDevices[index])
    }
  }



  const getDeviceName = (displayName) => {
    let deviceObject = allDevices.filter(deviceObj => deviceObj.attrs.display_name === displayName)[0].name
    return deviceObject
  }

  const getOrgName = (displayName) => {
    let orgObject = allDevices.filter(deviceObj => deviceObj.attrs.display_name === displayName)[0].org
    return orgObject
  }


  //Add or remove auto-complete device selection
  const handleDeviceChange = (e) => {
    if(e.currentTarget.nodeName === "svg"){
      dispatch(allActions.dashboardActions.removeDevice(e.target.parentElement.parentElement.innerText))
    } else {
        dispatch(allActions.dashboardActions.addDevice(e.target.textContent, getDeviceName(e.target.textContent), getOrgName(e.target.textContent)))
      }
    dispatch(allActions.dashboardActions.toggleServices(true))
  }


  //Add or remove auto-complete service selection
  const handleServiceChange = (e) => {
    if(e.currentTarget.nodeName === "svg"){
      dispatch(allActions.dashboardActions.removeService(e.target.parentElement.parentElement.innerText))
    } else {
        dispatch(allActions.dashboardActions.addService(e.target.textContent))
      }
    dispatch(allActions.dashboardActions.toggleServices(true))
  }



  //Fetch services from selected devices on click of "load services" button
  async function fetchServices(deviceObjects){

    setLoading(true)

    dispatch(allActions.dashboardActions.refreshServices())

    let fetchedServices = []

    for(let i=0; i<deviceObjects.devices.length; i++){
      await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
        headers: {
          function: 'wizarddevices',
          organization: deviceObjects.devices[i].orgName,
          devicename: deviceObjects.devices[i].deviceName
        }
      })
      .then((res) => {
        return res.json()})
      .then((json) => {
        for(let index=0; index<json.length; index++){
          fetchedServices.push(json[index].object_name)
        }
      })
    }
    let filterOutNullValues = fetchedServices.filter(service => service)
    let filterOutDuplicateValues = new Set(filterOutNullValues)
    let arrayFromFilteredSet = [...filterOutDuplicateValues]
    dispatch(allActions.dashboardActions.populateService(arrayFromFilteredSet))
    setLoading(false)
  }

  const classes = useStyles();

  return (

    <div >

      <div >
        <Typography className={classes.labels} variant="h5">
          Devices
        </Typography>
      </div>

      <div>
        <Autocomplete
          multiple
          id="wizard-device-selector"
          options={allDevices.length ? allDevices.map(device => device.attrs.display_name) : []}
          getOptionLabel={option => option}
          value={selectedDevices.devices ? selectedDevices.devices.map(deviceObj => deviceObj.displayName) : []}
          onChange={ (e) => handleDeviceChange(e)}
          renderInput={params => (
            <TextField {...params} label={'Devices'} variant="outlined" fullWidth />
          )}
        />
      </div>

      <div >
        <Typography className={classes.labels} variant="h5">
          Services
        </Typography>
      </div>

      <div className={classes.buttonParent}>
        <Button
          variant="contained"
          disabled={selectedDevices === [] || loading ? true : false}
          onClick={() => fetchServices(selectedDevices)}
        >
          Load Services
        </Button>
      </div>

      <div>
        <LinearProgress
          style={{display: loading ? null :'none'}}
        />
      </div>

      <div>
        <Autocomplete
          multiple
          id="wizard-service-selector"
          options={populatedServices.services.length ? populatedServices.services : []}
          getOptionLabel={option => option}
          value={selectedServices.services ? selectedServices.services : []}
          onChange={ (e) => handleServiceChange(e)}
          renderInput={params => (
            <TextField {...params} label={'Services'} variant="outlined" fullWidth />
          )}
        />
      </div>

    </div>
  );
}
