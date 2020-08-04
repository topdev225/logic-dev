import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import RouterIcon from '@material-ui/icons/Router';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PaletteIcon from '@material-ui/icons/Palette';
import TuneIcon from '@material-ui/icons/Tune';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Step1 from './WizardSteps/Step1'
import Step2 from './WizardSteps/Step2'
import Step3 from './WizardSteps/Step3'
import Step4 from './WizardSteps/Step4'
import Step5 from './WizardSteps/Step5'
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../redux/actions'

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});



function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient(135deg, #0A223E, #7FB4D6)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient(135deg, #0A223E, #7FB4D6)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#e0e0e0',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient(135deg, #0A223E, #7FB4D6)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient(135deg, #0A223E, #7FB4D6)',
  },
});








export default function CustomizedSteppers(props) {

  const dispatch = useDispatch()

  const selectedDevices = useSelector(state => state.selectedDevices)
  const selectedServices = useSelector(state => state.selectedServices)
  const servicesHaveChanged = useSelector(state => state.servicesHaveChanged)
  const selectedSeries = useSelector(state => state.selectedSeries)
  const fetchedWizardData = useSelector(state => state.fetchedWizardData)
  const panelName = useSelector(state => state.panelName).name
  const fetchedDashboardData = useSelector(state => state.fetchedDashboardData)
  const seriesColors = useSelector(state => state.seriesColors)
  const graphOptions = useSelector(state => state.graphOptions).options
  const panelIsBeingEdited = useSelector(state => state.panelIsBeingEdited)

  //UseState hook for entering graphite fetch and displaying progress spinner
  const [stepThreeLoadingStatus, setStepThreeLoadingStatus] = React.useState(false);

  function SeriesConfig(){
    if(stepThreeLoadingStatus){
      return(
        <CircularProgress/>
      )
    } else {
      return(
        <TuneIcon/>
      )
    }
  }


  function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
      1: <DeveloperBoardIcon />,
      2: <RouterIcon />,
      3: <SeriesConfig/>,
      4: <PaletteIcon/>,
      5: <VisibilityIcon/>
    };

    return (
      <Fab
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </Fab>
    );
  }

  ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
    icon: PropTypes.node,
  };

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));

  function getSteps() {
    return ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'];
  }





  function getStepContent(step) {
    switch (step) {
      case 0:
        return <Step1
          organizationdisplaynames={props.organizationdisplaynames}
          clusteraccessjoined={props.clusteraccessjoined}
        />;
      case 1:
        return <Step2
          organizations={props.organizations}
          organizationdisplaynames={props.organizationdisplaynames}
        />;
      case 2:
        return <Step3
          seriesoptions={props.seriesoptions}
          selectedservicesinuse={props.selectedservicesinuse}
        />;
      case 3:
        return <Step4/>;
      case 4:
        return <Step5
          combinedselectedseries={props.combinedselectedseries}
          fetchedwizarddata={props.fetchedwizarddata}
        />;
      default:
        return 'Unknown step';
    }
  }

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  // const handleNext = () => {
  //   setActiveStep(prevActiveStep => prevActiveStep + 1);
  // };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  async function handleStep(step, selectedDevices, selectedServices){

    if(step === steps.length-3 && !!servicesHaveChanged.servicesHaveChanged){

      setStepThreeLoadingStatus(true)
      await props.handlegraphdatafetchusingselectedoptions(selectedDevices, selectedServices)
      setStepThreeLoadingStatus(false)
      setActiveStep(step)

    } else if (step === steps.length) {
      if(panelIsBeingEdited.value){
        await dispatch(allActions.dashboardActions.panelEditToggle(true))
        await props.updatedashboard(fetchedDashboardData, props.tabvalue, panelName, panelIsBeingEdited.index)
        dispatch(allActions.dashboardActions.panelEditToggle(false))
      } else {
        await props.updatedashboard(fetchedDashboardData, props.tabvalue, panelName, panelIsBeingEdited.index)
        await dispatch(allActions.dashboardActions.panelIsBeingAdded(true))
        props.addnewcharttogoldenlayout(panelName, fetchedWizardData, selectedSeries, fetchedDashboardData, props.tabvalue, props.currentlayout, seriesColors, graphOptions)
        await dispatch(allActions.dashboardActions.panelIsBeingAdded(false))
      }
      props.handleclose()
      resetOptionsInWizard()
    } else {
      setActiveStep(step);
    }
  };


  const handleReset = () => {
    setActiveStep(0);
  };


  function resetOptionsInWizard(){
    dispatch(allActions.dashboardActions.resetOrganizations())
    dispatch(allActions.dashboardActions.resetDevices())
    dispatch(allActions.dashboardActions.resetServices())
    dispatch(allActions.dashboardActions.refreshServices())
    dispatch(allActions.dashboardActions.resetSeries())
    dispatch(allActions.dashboardActions.namePanel(""))
    dispatch(allActions.dashboardActions.panelIsBeingEdited(false, null))
  }


  return (
    <div className={classes.root}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon} onClick={() => handleStep(index, selectedDevices, selectedServices, servicesHaveChanged)} >{label} </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <div className={classes.instructions}>
              {getStepContent(activeStep)}
            </div>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStep(activeStep+1, selectedDevices, selectedServices, servicesHaveChanged)}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
