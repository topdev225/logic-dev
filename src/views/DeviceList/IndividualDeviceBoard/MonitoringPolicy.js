import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
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
      Monitoring Policy Component
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function MonitoringPolicy(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = value => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip id="toolTip" TransitionComponent={Zoom} title="Monitoring Policy">
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          <TrackChangesIcon/>
        </Button>
      </Tooltip>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
