import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import * as moment from 'moment';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'inline',
    textAlign: 'center',
    width: '325px',
    height: '505px'
  },
  picker: {
    margin: '20px'
  },
  buttonContainer: {
    display: 'inline',
    textAlign: 'center',
  },
  buttons: {
    margin: '5px',
    marginTop: '210px'
  },
  quickRange: {
    display: 'inline',
    textAlign: 'center',
  },
  select: {
    width: '260px',
    marginTop: '30px'
  }

}));

export default function DatePickerContainer(props) {

  const [range, setRange] = React.useState('');


  const handleChange = (event, quickRanges, actions) => {
    setRange(event.target.value);
    props.setdate('startDate', quickRanges[event.target.value].startDate)
    props.setdate('endDate', quickRanges[event.target.value].endDate)
  };


  function handleCancel(){
    props.close()
  }

  function handleFetch(){
    props.newdatefetch()
    props.close()
  }


  const quickRanges = {
    0: {
      startDate: moment().startOf('year')._d,
      endDate: new Date()
    },
    1: {
      startDate: moment().startOf('month')._d,
      endDate: new Date()
    },
    2: {
      startDate: moment().startOf('quarter')._d,
      endDate: new Date()
    },
    3: {
      startDate: moment().startOf('week')._d,
      endDate: new Date()
    },
    4: {
      startDate: moment().startOf('day')._d,
      endDate: new Date()
    },
    5: {
      startDate: moment().startOf('hour')._d,
      endDate: new Date()
    },
    6: {
      startDate: moment().startOf('minute')._d,
      endDate: new Date()
    },
  }


  const classes = useStyles();


  return (
    <div className={classes.container}>

      <MuiPickersUtilsProvider utils={DateFnsUtils} className={classes.container}>

        <div>

          <KeyboardDateTimePicker
            key='start'
            className={classes.picker}
            label="From:"
            format='yyyy-MM-dd hh:mm:ss'
            value={props.startdate}
            maxDate={props.enddate}
            onChange={(date) => props.setdate('startDate', date)}
          />

          <KeyboardDateTimePicker
            key='end'
            className={classes.picker}
            label="To:"
            format='yyyy-MM-dd hh:mm:ss'
            value={props.enddate}
            minDate={props.startdate}
            onChange={(date) => props.setdate('endDate', date)}
          />

          <Select
            className={classes.select}
            value={range}
            onChange={(e) => handleChange(e, quickRanges)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              Quick Ranges
            </MenuItem>
            <MenuItem value={0}>This Year</MenuItem>
            <MenuItem value={1}>This Month</MenuItem>
            <MenuItem value={2}>This Quarter</MenuItem>
            <MenuItem value={3}>This Week</MenuItem>
            <MenuItem value={4}>Today</MenuItem>
            <MenuItem value={5}>Last Hour</MenuItem>
            <MenuItem value={6}>Last Minute</MenuItem>
          </Select>

        </div>


        <div className={classes.buttonContainer}>
          <Button
            variant='contained'
            className={classes.buttons}
            onClick={() => handleCancel()}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            className={classes.buttons}
            onClick={() => handleFetch()}
          >
            Update
          </Button>
        </div>


      </MuiPickersUtilsProvider>

    </div>
  );
}
