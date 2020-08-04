import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import QueueIcon from '@material-ui/icons/Queue';
import ProgressBar from './ProgressBar'
import MyGoldenPanel from "./GoldenLayout/MyGoldenPanel";
import DateSelectorModal from '../../Components/DateSelectorModal/DateSelectorModal';
import SaveIcon from '@material-ui/icons/Save';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../redux/actions'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    top: '67px',
    backgroundColor: '#fafafa',
    height: '47px',
    position: 'fixed',
    width: '100%',
    padding: '5px',
    zIndex: '100',
    borderBottom: '1px',
    borderColor: '#304ffe'
  },
  saveButton: {
    marginLeft: '5px',
  },
  addButton: {
    right: '5px',
    position: 'fixed',
  },
  dialog: {
    position: 'absolute',
    height: 'auto',
    overflow: 'auto'
  },
  '@global': {
    '.MuiDialogContent-root': {
      height: '600px',
      width: '800px'
    },
  }
}));

export default function ResponsiveDialog(props) {


  const classes = useStyles();

  const dispatch = useDispatch()

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const selectedDevices = useSelector(state => state.selectedDevices)
  const selectedServices = useSelector(state => state.selectedServices)
  const selectedSeries = useSelector(state => state.selectedSeries)
  const selectedOrganizations = useSelector(state => state.selectedOrganizations)
  const seriesColors = useSelector(state => state.seriesColors)
  const graphOptions = useSelector(state => state.graphOptions).options







  async function updateDashboard(fetchedDashboardData, dashboardIndex, panelName, panelIndex){

    let modifiableDashboardData = [...fetchedDashboardData.modifiableDashboardData]
    // let nameOfSelectedDashboard = modifiableDashboardData[dashboardIndex].dashboard_name
    //parse dashboard_json of dashboard respective to dashboardIndex
    let selectedDashboard = JSON.parse(modifiableDashboardData[dashboardIndex].dashboard_json)
    //assign variable to chart_data array
    let selectedDashboardChartData = selectedDashboard.chart_data
    //declare new object for chart_data array based on currently-selected options
    let selectedOptionsObject = {
      devices: selectedDevices,
      series: selectedSeries,
      services: selectedServices,
      organizations: selectedOrganizations,
      name: panelName,
      colors: seriesColors,
      graphOptions: graphOptions
    }
    //declare variable for layout json
    let layoutConfigObject = props.currentlayout.toConfig()

    //if a panel is being edited, it will have an index, otherwise index will be null
    if(panelIndex !== null){
      //replace names in dashbaord_json
      let prevName = selectedDashboardChartData[panelIndex].name
      let json = JSON.stringify(layoutConfigObject)
      let titleReplace = json.replace(`"title":"${prevName}"`, `"title":"${panelName}"`)
      let componentReplace = titleReplace.replace(`"component":"${prevName}"`, `"component":"${panelName}"`)
      let nameReplace = componentReplace.replace(`"name":"${prevName}"`, `"name":"${panelName}"`)
      layoutConfigObject = JSON.parse(nameReplace)
      //replace panel with updated json
      selectedDashboardChartData[panelIndex] = selectedOptionsObject
      await props.getchartdata(selectedDashboardChartData)
      // layoutConfigObject = JSON.parse(modifiableDashboardData[0]['dashboard_json']).config
    } else {
      //push newly declared object into chart_data array
      selectedDashboardChartData.push(selectedOptionsObject)
      // layoutConfigObject = props.currentlayout.toConfig()
    }
    //use variables to declare updated dashboard-json for mysql db

    let dashboardJSON = {
      config: layoutConfigObject,
      chart_data: selectedDashboardChartData
    }

    let stringifiedDashboardJSON = JSON.stringify(dashboardJSON)

    modifiableDashboardData[dashboardIndex].dashboard_json = stringifiedDashboardJSON

    dispatch(allActions.dashboardActions.modifiableDashboardData(modifiableDashboardData))

    dispatch(allActions.dashboardActions.setIfChangeHasBeenMadeToLayout(true))

  }




  async function addNewChartToGoldenLayout(itemName, fetchedData, selectedSeries, fetchedDashboardData, dashboardIndex, currentLayout, colorJSON, graphOptions){

    let modifiableDashboardData = [...fetchedDashboardData.modifiableDashboardData]
    //length of chart_data array to be used to distinguish DOM element ids
    let idnum = JSON.parse(modifiableDashboardData[dashboardIndex].dashboard_json).chart_data.length

    var newItemConfig = {
          title: itemName,
          type: 'react-component',
          component: itemName,
      };

    currentLayout.registerComponent(itemName, () =>
      <div id={`layout_panel_${idnum}`}>
        { document.getElementById(`layout_panel_${idnum}`) &&
          <MyGoldenPanel
            dataobjects={props.fetchedwizarddata(selectedSeries, fetchedData, colorJSON, graphOptions)}
            idnum={idnum}
            updatedashboard={updateDashboard}
            tabvalue={props.tabvalue}
          />
        }
      </div>
    );
    currentLayout.root.contentItems[ 0 ].addChild( newItemConfig, 0 )
    await dispatch(allActions.dashboardActions.setCompletedLayoutChange(false))
    dispatch(allActions.dashboardActions.setCompletedLayoutChange(true))
  }





  function saveCurrentlySelectedDashboard(tabIndex, dashboardData, currentLayout){

    let dashboardObjectToSave = dashboardData.modifiableDashboardData[tabIndex]

    let email = dashboardObjectToSave.user_name
    let dashboardName = dashboardObjectToSave.dashboard_name
    let dashboardJSON = dashboardObjectToSave.dashboard_json
    //apply current layout configuration to dashboardJSON
    let currentLayoutConfiguration = currentLayout.toConfig()
    let parsedDashboardJSON = JSON.parse(dashboardJSON)
    parsedDashboardJSON.config = currentLayoutConfiguration

    dashboardJSON = JSON.stringify(parsedDashboardJSON)

    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'fetchsingledashboard',
        email: email,
        dashboardname: dashboardName,
        dashboardjson: dashboardJSON
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {

      if(json.length === 2){

        let email = json[1].email
        let dashboardName = json[1].dashboardname
        let dashbaordJSON = json[1].dashboardjson

        fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'updatedashboard',
            email: email,
            dashboardname: dashboardName,
            dashboardjson: dashbaordJSON
          }
        })
        .then((res) => {
          return res.json()})
        .then((json) => {

        })
      } else if (json.length === 1) {

        let email = json[0].email
        let dashboardName = json[0].dashboardname
        let dashbaordJSON = json[0].dashboardjson

        fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'postdashboard',
            email: email,
            dashboardname: dashboardName,
            dashboardjson: dashbaordJSON
          }
        })
        .then((res) => {
          return res.json()})
        .then((json) => {

        })
      }
    })
  }



  return (


    <div className={classes.root} >

        <div className={classes.saveButton}>
          <Tooltip id="toolTip" TransitionComponent={Zoom} title="Save">
            <Button
              onClick={() => saveCurrentlySelectedDashboard(props.tabvalue, props.fetcheddashboarddata, props.currentlayout)}
              variant="outlined"
              color="primary"
              style={{color: '#00b0ff'}}
              disabled={!props.achangehasbeenmade.value && true}
            >
              <SaveIcon color='primary'/>
            </Button>
          </Tooltip>
        </div>

        <div style={{display: 'flex'}}>
          <DateSelectorModal
            startdate={props.startdate}
            enddate={props.enddate}
            setdate={props.setdate}
          />
        </div>

        <div className={classes.addButton}>
          <div>
            <div >
              <Tooltip id="toolTip" TransitionComponent={Zoom} title="Add Panel">
                <Button variant="outlined" color="primary" onClick={props.handleopen} style={{color: '#00b0ff'}}>
                  <QueueIcon color='primary'/>
                </Button>
              </Tooltip>
            </div>
            <Dialog
              maxWidth={'xl'}
              className={classes.dialog}
              fullScreen={fullScreen}
              open={props.open}
              onClose={props.handleclose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">{"Setup Wizard"}</DialogTitle>
              <DialogContent>
                <ProgressBar
                  organizationdisplaynames={props.organizationdisplaynames}
                  organizations={props.organizations}
                  clusteraccessjoined={props.clusteraccessjoined}
                  handlegraphdatafetchusingselectedoptions={props.handlegraphdatafetchusingselectedoptions}
                  wizarddatafetchiscomplete={props.wizarddatafetchiscomplete}
                  selectedservicesinuse={props.selectedservicesinuse}
                  seriesoptions={props.seriesoptions}
                  combinedselectedseries={props.combinedselectedseries}
                  fetchedwizarddata={props.fetchedwizarddata}
                  setthereisdata={props.setthereisdata}
                  thereisdata={props.thereisdata}
                  handleclose={props.handleclose}
                  updatedashboard={updateDashboard}
                  selecteddashboard={props.selecteddashboard}
                  tabvalue={props.tabvalue}
                  addnewcharttogoldenlayout={addNewChartToGoldenLayout}
                  layoutchangehasfinished={props.layoutchangehasfinished}
                  currentlayout={props.currentlayout}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </div>

  );
}
