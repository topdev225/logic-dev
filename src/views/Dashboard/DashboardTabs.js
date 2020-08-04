import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import GoldenLayoutRoot from './GoldenLayout/GoldenLayoutRoot'
import { RotateSpinner } from "react-spinners-kit";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../redux/actions'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'theme.palette.background.paper',
    marginTop: '45px'
  },
  appBar: {
    display: 'flex'
  },
  addCircleButton: {
    marginTop: '12px',
    marginRight: '16px'
  },
  popoverContent: {
    padding: '10px',
    display: 'flex'
  },
  addTab: {
    color: 'rgb(10,34,62)'
  },
  tabPanel: {
    position: 'relative',
    width: '100%',
    height: `${window.innerHeight-200}px`,
    padding: '0px'
  },
  addCircle: {
    color: 'rgb(10,34,62)'
  },
  tabBar: {
    backgroundColor: '#fafafa',
  },
  tabs: {
    paddingLeft: '0px',
    paddingRight: '0px'
  }
}));

export default function ScrollableTabsButtonAuto(props) {


  const fetchedDashboardData = useSelector(state => state.fetchedDashboardData)
  const dispatch = useDispatch()
  const classes = useStyles();

  const handleChange = async (event, newValue) => {
    dispatch(allActions.dashboardActions.panelIsBeingDeleted(true))
    await props.currentlayout.destroy()
    await props.setdashboardcanrender(false)
    // props.currentlayout.config.content[0].content = []
    props.settabvalue(newValue);
    await props.handlesetfetcheddashboards(fetchedDashboardData.modifiableDashboardData, newValue)
  };

  //determines if popover is open or closed
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleAddButtonClick = event => {
    setAnchorEl(event.currentTarget);
  };
  //close popoverz
  const handleClose = () => {
    setAnchorEl(null);
    setNewTabTextFieldContent(null)
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [newTabTextFieldContent, setNewTabTextFieldContent] = React.useState(null)

  const {useremail} = props




  //Post new dashboard with name entered in text field
  const handleAddDashboard = (textFieldContent) => {
    //Initialize layout configuration with zero panels
    let layoutConfig = `{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":true,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","content":[]}],"isClosable":true,"reorderEnabled":true,"title":"${textFieldContent}","openPopouts":[],"maximisedItemId":null}`
    //parse layout config because it will need to be parsed anyway when used to restore the layout
    let parsedConfig = JSON.parse(layoutConfig)
    //Initialize dashbaordJson (dashboard_json in mysql) with layout Config and empty array for chart_data
    let dashboardjson = {
      config: parsedConfig,
      chart_data: []
    }
    //stringify the dashbaord JSON the same way as it will appear in mysql
    let stringifiedDashboardJSON = JSON.stringify(dashboardjson)
    //create dashboard object to store in redux to mimic a dashboard object fetched from mysql
    let newDashboardObject = {
      user_name: useremail,
      dashboard_name: textFieldContent,
      dashboard_json: stringifiedDashboardJSON
    }

    let modifiableDashboardData

    if(!fetchedDashboardData.modifiableDashboardData){
      modifiableDashboardData = [newDashboardObject]
    } else {
      modifiableDashboardData = [...fetchedDashboardData.modifiableDashboardData]
      modifiableDashboardData.push(newDashboardObject)
    }
    //Update redux with new array
    dispatch(allActions.dashboardActions.modifiableDashboardData(modifiableDashboardData))
    //close popover
    handleClose()
  }






  return (
    <div className={classes.root}>

    { !props.allchartdata ?

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%', backgroundColor: '#e4e7ea'}}>
          <RotateSpinner
            size={350}
            color="rgb(242,97,39)"
            loading={true}
          />
        </div>

      :

      <>

        <AppBar position="static" className={classes.tabBar}>
          <div className={classes.appBar}>
            <Tabs
              className={classes.tabs}
              value={props.tabvalue}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
              aria-label="scrollable auto tabs example"
            >
              {
                (useremail && fetchedDashboardData.modifiableDashboardData) &&
                  fetchedDashboardData.modifiableDashboardData.map((dashboard, i) =>
                    <Tab
                      label={dashboard.dashboard_name}
                      key={`${dashboard.dashboard_name}_tab`}
                      {...a11yProps(i)}
                    />
                  )
              }
            </Tabs>
            <div className={classes.addCircleButton}>
              <Tooltip id="toolTip" TransitionComponent={Zoom} title="Add Dashboard Tab">
               <AddCircleOutlineIcon className={classes.addCircle} onClick={handleAddButtonClick}/>
              </Tooltip>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.popoverContent}>
                  <TextField
                    style={{width: "250px"}}
                    label={"Dashboard Name"}
                    variant="outlined"
                    value={newTabTextFieldContent}
                    onChange={(e) => setNewTabTextFieldContent(e.target.value)}
                    fullWidth
                  />
                  <Tooltip id="toolTip" TransitionComponent={Zoom} title="Save Dashboard Tab">
                    <Button variant="outlined" color='primary' className={classes.addTab} onClick={() => handleAddDashboard(newTabTextFieldContent)}>
                      <DoneOutlineIcon color='primary'/>
                    </Button>
                  </Tooltip>
                </div>
              </Popover>
            </div>
          </div>
        </AppBar>
        {(useremail && fetchedDashboardData.modifiableDashboardData && props.dashboardcanrender) &&
          fetchedDashboardData.modifiableDashboardData.map((dashboard, i) => {
            return <TabPanel value={props.tabvalue} index={i} className={classes.tabPanel} key={`${dashboard.dashboard_name}_tabPanel`} >
              { props.tabvalue === i &&
                <GoldenLayoutRoot
                  key={`${dashboard.dashboard_name}_layout`}
                  childkey={`${dashboard.dashboard_name}_layout`}
                  config={JSON.parse(dashboard.dashboard_json).config}
                  setcurrentlayoutinstance={props.setcurrentlayoutinstance}
                  setlayoutref={props.setlayoutref}
                  currentref={props.currentref}
                  containerref={props.containerref}
                  currentlayout={props.currentlayout}
                  allchartdata={props.allchartdata}
                  tabvalue={props.tabvalue}
                  setoptionsinwizardonclickofeditbutton={props.setoptionsinwizardonclickofeditbutton}
                  currentlyselecteddashboardname={props.currentlyselecteddashboardname}
                />
              }
            </TabPanel>
          }
        )}
      </>

      }


    </div>
  );
}
