import React from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../redux/actions';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Paper from '@material-ui/core/Paper';
import ColorPickerTable from './ColorPicker/ColorPickerTable'



const theme = createMuiTheme({
  palette: {
    primary: {main: '#00b0ff'},
    secondary: {main: '#212121'},
  },
  status: {
    danger: 'orange',
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: "1.25em",
      }
    },
  }
});




export default function Step4() {


  const panelName = useSelector(state => state.panelName).name

  const selectedSeries = useSelector(state => state.selectedSeries)

  const seriesColors = useSelector(state => state.seriesColors)

  const graphOptions = useSelector(state => state.graphOptions)

  const dispatch = useDispatch()





  const handleGraphOptions = (event, newGraphOptions) => {
    dispatch(allActions.dashboardActions.setGraphOptions(newGraphOptions))
  };




  const useStyles = makeStyles(theme => ({
    root: {
      textAlign: 'center',
    },
    headers: {
      margin: '20px'
    },
    seriesText: {
      margin: '10px',
      color: '#000'
    },
    seriesButton: {
      margin: '10px',
      backgroundColor: "#FFF",
      "&:hover": {
        backgroundColor: "#FFF",
        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
      },
      "&:focus": {
        outline: "none"
      }
    },
    buttonContainer: {
      display: 'inline',
      justifyContent: 'center',
    },
    seriesContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      flexDirection: 'column'
    },
    tableItem: {
      display: 'inline-block',
      width: 'auto',
    },
    service: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column'
    },
    pickerContainer: {
      position: 'relative'
    },
    mainPaper: {
      padding: '15px',
      display: 'inline-block',
      width: 'auto',
      margin: '15px'
    }
  }));





  for(let i=0; i<Object.keys(selectedSeries).length; i++){
    if(!seriesColors[Object.keys(selectedSeries)[i]]){
      dispatch(allActions.dashboardActions.addServiceToSeriesColors(Object.keys(selectedSeries)[i]))
    }
  }




  const classes = useStyles();

  return (

    <MuiThemeProvider theme={theme}>

      <div className={classes.root}>

        <TextField
          label={'Panel Name'}
          variant="outlined"
          value={panelName}
          onChange={(e) => dispatch(allActions.dashboardActions.namePanel(e.target.value))}
        />

        <Typography className={classes.headers} variant="h5">
          Graph Options
        </Typography>

        <ToggleButtonGroup value={graphOptions.options} onChange={handleGraphOptions} aria-label="text formatting">
            <ToggleButton value="scroll" aria-label="scroll">
              <Tooltip id="toolTip" TransitionComponent={Zoom} title="Scroll Bar">
                <SettingsEthernetIcon />
              </Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>

        <Typography className={classes.headers} variant="h5">
          Series Options
        </Typography>

        <div className={classes.tableContainer}>
          {Object.keys(selectedSeries).map((service, i) => {
            return <Paper className={classes.mainPaper}>
              <Typography variant="h6">
                {service}
              </Typography>
              <div className={classes.tableItem}>
                <div className={classes.service}>
                  <ColorPickerTable
                    key={i}
                    service={service}
                    service_series={selectedSeries[service]}
                  />
                </div>
              </div>
            </Paper>
          })}
        </div>

      </div>

    </MuiThemeProvider>
  );
}
