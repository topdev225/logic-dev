import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ConfigurationTab from './ConfigurationTab'
import Grid from '@material-ui/core/Grid';
import { PushSpinner } from "react-spinners-kit";
import { makeStyles } from '@material-ui/core/styles';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    //Find way to get around this padding issue
    //some way other than using negative margins
    marginLeft: '-35px',
    marginRight: '-35px'
  },
  tabPanels: {
    overflowY: 'scroll',
    height: `${window.innerHeight-260}px`,
    marginTop: '50px',
  },
  appBar: {
    zIndex: 1000
  },
  tabs: {
  }
}));

export default function DeviceBoardTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <div className={classes.root}>
        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Tabs className={classes.tabs} value={value} onChange={handleChange} aria-label="simple tabs example" indicatorColor="primary" textColor="primary">
            <Tab label="Data" {...a11yProps(0)} />
            <Tab label="Configuration" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} className={classes.tabPanels}>
          {
            props.fetchhasstarted ?
            <div >
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}>
                <PushSpinner
                  size={300}
                  color="#e65100"
                  loading={true}
                />
              </div>
            </div>
          :
          <>
            { props.chartdatahasbeenupdated &&
              <div >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: '30px'}}>
                    {
                      <Grid container spacing={3} justify="center" alignItems="stretch">
                        {(props.chartdata && !!props.showstatic) && props.mapallcharts(props.chartdata, 'strings')}
                      </Grid>
                    }
                  </div>
                  <div>
                    {
                      props.chartdata && props.mapallcharts(props.chartdata, 'graphs')
                    }
                  </div>
              </div>
            }
          </>
          }
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabPanels}>
        {
          props.fetchhasstarted ?
          <div >
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}>
              <PushSpinner
                size={300}
                color="#e65100"
                loading={true}
              />
            </div>
          </div>
        :
        <>
          <ConfigurationTab

            objectname={props.objectname}
            setobjectnameinstate={props.setobjectnameinstate}

            displayname={props.displayname}
            setdisplaynameinstate={props.setdisplaynameinstate}

            templates={props.templates}
            settemplatesinstate={props.settemplatesinstate}

            template={props.template}
            settemplateinstate={props.settemplateinstate}

            groups={props.groups}
            setgroupsinstate={props.setgroupsinstate}

            group={props.group}
            setgroupinstate={props.setgroupinstate}

            oid={props.oid}
            setoidinstate={props.setoidinstate}

            priority={props.priority}
            setpriorityinstate={props.setpriorityinstate}

            hostip={props.hostip}
            sethostipinstate={props.sethostipinstate}

            services={props.services}
            updateservice={props.updateservice}

            devicename={props.devicename}
            orgname={props.orgname}

            setVarsInState={props.setVarsInState}
            vars={props.vars}

            sethostvarinstate={props.sethostvarinstate}
            hostvar={props.hostvar}

            sethostvarvalueinstate={props.sethostvarvalueinstate}
            hostvarvalue={props.hostvarvalue}

            servicevars={props.servicevars}
            setservicevarsinstate={props.setservicevarsinstate}

            selectedservicevars={props.selectedservicevars}
            setselectedservicevarsinstate={props.setselectedservicevarsinstate}

            servicevarvalues={props.servicevarvalues}
            setservicevarvaluesinstate={props.setservicevarvaluesinstate}

            fetchdata={props.fetchdata}

            hostudfchartdata={props.hostudfchartdata}
            servicesudfchartdata={props.servicesudfchartdata}

            updateudfchartdata={props.updateudfchartdata}

            uservars={props.uservars}

            setvalueinstate={props.setvalueinstate}

            ip={props.ip}

            sla={props.sla}

            check_interval={props.check_interval}
            check_units={props.check_units}
            max_check_attempts={props.max_check_attempts}
            parent_host={props.parent_host}
            host_name_types={props.host_name_types}

            dasdevice={props.dasdevice}

            check_units_services={props.check_units_services}
            check_interval_services={props.check_interval_services}
            service_object_names={props.service_object_names}

            chartdata={props.chartdata}

          />
        </>
        }
        </TabPanel>
      </div>
  );
}
