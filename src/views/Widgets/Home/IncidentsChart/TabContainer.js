import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import LoadChart from './LoadChart.js'
import { makeStyles } from '@material-ui/core/styles';

export default function TabContainer(props) {

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

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    '@global': {
      '.PrivateTabIndicator-colorPrimary-161': {
        backgroundColor: 'transparent'
      },
      '.PrivateTabIndicator-colorSecondary-162': {
        backgroundColor: 'transparent'
      }
    }
  }));

  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.settabindex(newValue)
    props.getIncidentTabData(newValue)
  };


  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          { Object.keys(props.organizations).map((org, i) => {
            return <Tab label={Object.keys(props.organizations)[i]} {...a11yProps(i)} key={`tab_${i}`} />
          })}
        </Tabs>
        </Tabs>
      </AppBar>
      { Object.keys(props.organizations).map((org, i) => {
        return (
          <TabPanel value={props.tabindex} index={i} key={`tabpanel_${i}`}>
            <LoadChart
              org={org}
              index={i}
              startDate={props.startDate}
              endDate={props.endDate}
              cluster_list={props.cluster_list}
              incident_data={props.incident_data}
              />
          </TabPanel>
          )
        }
      )}
    </Paper>

  )

}
