import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../redux/actions';

const useStyles = makeStyles({
  root: {
    margin: '10px',
    textAlign: 'center',
  },
  cardActions: {
    justifyContent: 'center',
    overflowX: 'scroll',
    overflowY: 'hidden'
  },
  media: {
    height: 140,
  },
  labels: {
    textAlign: 'center',
    marginBottom: '10px',
    marginTop: '20px'
  },
});

export default function Step3(props) {

  const selectedSeries = useSelector(state => state.selectedSeries)
  const selectedServices = useSelector(state => state.selectedServices)
  const servicesHaveChanged = useSelector(state => state.servicesHaveChanged)
  const fetchedWizardData = useSelector(state => state.fetchedWizardData)

  const dispatch = useDispatch()

  //Send selectedServices to redux store as keys for series object
  let selectedservicesinuse = props.selectedservicesinuse(selectedServices, fetchedWizardData)
  React.useEffect(() => {
    if(!!servicesHaveChanged.servicesHaveChanged){
      for(let serviceOptionsIndex = 0; serviceOptionsIndex < selectedservicesinuse.length; serviceOptionsIndex++){
        let serviceName = selectedservicesinuse[serviceOptionsIndex].info.displayName
        if(!selectedSeries[serviceName]){
          dispatch(allActions.dashboardActions.addServicesToSelectedSeries(serviceName))
          dispatch(allActions.dashboardActions.toggleServices(false))
        }
      }
    }
  }, [dispatch, selectedservicesinuse, servicesHaveChanged.servicesHaveChanged, selectedSeries]);


  function handleSeriesInputChange(service, e){
    let payload
    if(e.currentTarget.nodeName === "svg"){
      payload = {service: service, series: e.target.parentElement.parentElement.innerText}
      dispatch(allActions.dashboardActions.removeSeries(payload))
    } else {
      payload = {service: service, series: e.target.textContent}
      dispatch(allActions.dashboardActions.addSeries(payload))
    }
  }


  const classes = useStyles();


  return (
    <div>
      { Object.keys(props.seriesoptions(selectedServices, fetchedWizardData)).length && Object.keys(props.seriesoptions(selectedServices, fetchedWizardData)).map((obj, i) => {
        return <div key={i}>
          <Typography className={classes.labels} variant="h5">
            {obj}
          </Typography>
          <Autocomplete
            multiple
            id="wizard-service-selector"
            options={props.seriesoptions(selectedServices, fetchedWizardData)[obj].length ? props.seriesoptions(selectedServices, fetchedWizardData)[obj] : []}
            // getOptionLabel={option => option}
            value={selectedSeries[obj] ? selectedSeries[obj] : []}
            onChange={ (e) => handleSeriesInputChange(obj, e)}
            renderInput={params => (
              <TextField {...params} label={'Series'} variant="outlined" fullWidth />
            )}
          />
        </div>
        }
      )}
    </div>
  );
}
