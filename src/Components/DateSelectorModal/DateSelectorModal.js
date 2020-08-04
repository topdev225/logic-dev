import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DatePickerContainer from './DatePickerContainer'
import DateRangeIcon from '@material-ui/icons/DateRange';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

function SimpleDialog(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DatePickerContainer
        close={handleClose}
        startdate={props.startdate}
        enddate={props.enddate}
        setdate={props.setdate}
        newdatefetch={props.newdatefetch}
      />
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Tooltip id="toolTip" TransitionComponent={Zoom} title="Date Selector">
        <Button variant="outlined" color="primary" onClick={handleClickOpen} style={{marginLeft: '5px'}}>
          <DateRangeIcon style={{marginRight: '10px'}}/>
          {props.startdate.toDateString()} to {props.enddate.toDateString()}
        </Button>
      </Tooltip>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        startdate={props.startdate}
        enddate={props.enddate}
        setdate={props.setdate}
        newdatefetch={props.newdatefetch}
      />
    </div>
  );
}
