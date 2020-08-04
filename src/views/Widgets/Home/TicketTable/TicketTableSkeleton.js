import React from 'react';
import PropTypes from 'prop-types';
import PieChartContainer from './PieChartContainer'
import MaterialTable from 'material-table';

import {
  Card,
  Dialog
} from '@material-ui/core'

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


export default function TicketTableSkeleton(props) {


  function createData( name, p1, p2, p3, p4 ) {
    return { name, p1, p2, p3, p4 };
  }

  const data = [
    createData("OPEN"),
    createData("CLOSED"),
    createData("TOTAL")
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
      showTitle: true,
      search: false,
      toolbar: true,
      headerStyle: {
        backgroundColor: '#3667A6',
        color: '#FFFF',
        fontWeight: "bold"
      }
    }}
    actions={[
      {
      icon: 'search',
      tooltip: 'Breakdown',
      isFreeAction: true,
      onClick: (event, rowData) =>{


        }
      }
    ]}
    />

    </Card>

    </div>
  );
}
