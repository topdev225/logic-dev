import React from 'react';
import PropTypes from 'prop-types';
import PieChartContainer from './PieChartContainer'
import MaterialTable from 'material-table';
import PieChartIcon from '@material-ui/icons/PieChart';
import { forwardRef } from 'react';

import {
  Card,
  Dialog,
  makeStyles
} from '@material-ui/core'

const useStyles = makeStyles({
  table: {
    width: '100%'
  },
  '@global': {
    '.MuiDialog-paperWidthSm': {
      minWidth: 'none',
      maxWidth: 'none'
    },
    '.MuiDialog-container': {
      width: 'auto',
      overflow: 'scroll'
    }
  },
  dialog: {
    width: '100%',
    overflow: 'scroll'
  }
});

function SimpleDialog(props) {

  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <PieChartContainer
        closedby={props.closedby}
        issue_type={props.issue_type}
        reporter={props.reporter}
        priority_count={props.priority_count}
      />
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};


export default function SimpleTable(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);


  const handleClose = value => {
    setOpen(false);
  };

  function createData( name, p1, p2, p3, p4 ) {
    return { name, p1, p2, p3, p4 };
  }

  const data = [
    createData("OPEN", props.p1.P1[0].open, props.p2.P2[0].open, props.p3.P3[0].open, props.p4.P4[0].open),
    createData("CLOSED", props.p1.P1[1].closed, props.p2.P2[1].closed, props.p3.P3[1].closed, props.p4.P4[1].closed),
    createData("TOTAL", props.p1.P1[2].total, props.p2.P2[2].total, props.p3.P3[2].total, props.p4.P4[2].total)
  ];

  return (

    <div>
    <Card style={{height: '100%', width: '100%' }}
    raised={true}>
    <MaterialTable
    title='TICKETS'
    subheader='Ticket status break down by priority'
    data={data}
    columns={[
      { title: '', field: 'name',
        cellStyle: {fontWeight: 'bold' }
      },
      { title: 'P1', field: 'p1',
        cellStyle: {align: 'center' }
      },
      { title: 'P2', field: 'p2',
        cellStyle: {align: 'center' }
      },
      { title: 'P3', field: 'p3',
        cellStyle: {align: 'center' }
      },
      { title: 'P4', field: 'p4',
        cellStyle: {align: 'center' }
      },

    ]}
    options={{
      sorting: false,
      paging: false,
      search: true,
      showTitle: true,
      toolbar: true,
      headerStyle: {
        backgroundColor: '#3667A6',
        color: '#FFFF',
        fontWeight: "bold"
      }
    }}
    actions={[
      {
      icon: forwardRef((props, ref) => <PieChartIcon {...props} ref={ref} />),
      tooltip: 'Breakdown',
      isFreeAction: true,
      onClick: (event, rowData) =>{

        setOpen(true)
        }
      }
    ]}
    />

    </Card>

    <SimpleDialog
      className={classes.dialog}
      open={open}
      onClose={handleClose}
      closedby={props.closedby}
      issue_type={props.issue_type}
      reporter={props.reporter}
      priority_count={props.priority_count}
    />

    </div>
  );
}
