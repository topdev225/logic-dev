import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PublishIcon from '@material-ui/icons/Publish';
import { Container } from 'reactstrap';
import MaterialTable from 'material-table';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import DocumentLibrary from './DocumentLibrary.js'
import {
  Row,
  Col
} from 'reactstrap';

export default function Inventory(props) {

  const useStyles = makeStyles({
    buttons: {
      marginBottom: '10px'
    }
  });

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

  let dataMap

  const [state, setState] = React.useState({
    columns: [
      { title: 'Host Name', field: 'hostName' },
      { title: 'Display Name', field: 'displayName' },
      { title: 'Cluster', field: 'cluster'},
      { title: 'Ticket Priority', field: 'priority', lookup: { 1: 'Highest', 2: 'High', 3: 'Medium', 4: 'Low', 5: 'Lowest' } }
    ],
    data: dataMap,
  });

  const populatedTable = React.useRef(false);

    dataMap = []

    if(props.directorOrgsLength && (props.directorOrgs.length === props.directorOrgsLength) && (Object.keys(props.organizations).length === props.directorOrgsLength) && populatedTable.current === false) {

        for(let i=0; i<props.directorOrgs.length; i++){

          props.directorOrgs[i][Object.keys(props.directorOrgs[i])[0]].objects.forEach((result, index) => {

            dataMap.push({

              hostName: result.object_name,
              displayName: result.display_name,
              cluster: Object.keys(props.organizations)[i][0],
              priority: result.vars && result.vars.jira_priority ? result.vars.jira_priority : null,

            })
          })
        }

        if(!state.data){

        setState({
          columns: [
            { title: 'Host Name', field: 'hostName' },
            { title: 'Display Name', field: 'displayName' },
            { title: 'Site', field: 'cluster'},
            { title: 'Ticket Priority', field: 'priority'}
          ],
          data: dataMap,
        })
        populatedTable.current = true
      }
    }



  return (
    <Container style={{ padding: '0px', width: '100%', maxHeight: '550px' }} fluid>

      <Row style={{padding: '5px', paddingLeft: '2%', paddingRight: '2%', maxHeight: '100%', overflowY: 'scroll'}}>

        <MaterialTable
          title="Inventory"
          style={{ width: '100%'}}
          columns={state.columns}
          data={state.data}
          options={{
            sorting: true,
            paging: true,
            search: true,
            showTitle: true,
            toolbar: true,
            pageSize: 10,
            exportButton: true,
            headerStyle: {
              backgroundColor: '#3667A6',
              color: '#FFF',
              fontWeight: "bold"
            }
          }}
          actions={[
            {
            icon: 'search',
            tooltip: 'Documents',
            onClick: (event, rowData) =>{
              setOpen(true)
              }
            }
          ]}
          editable={{
            onRowAdd: newData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                setTimeout(() => {
                  let newState
                  resolve();
                  if (oldData) {
                    setState(prevState => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      newState = { ...prevState, data }
                      return newState;
                    });
                  }
                  props.updatehost(newState)
                }, 600);
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              }),
          }}
        />
        </Row>
        <DocumentLibrary
          maxWidth={'xl'}
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"/>

          <Col style={{ paddingLeft: '20px', paddingTop: '5px'}}>
            <div className={classes.buttons}>
              <Tooltip id="toolTip" TransitionComponent={Zoom} title="Save">
                <Button onClick={() => props.posthosts()} variant="contained" style={{color: '#fff', backgroundColor: '#43a047'}}>
                    <SaveIcon/>
                </Button>
              </Tooltip>
            {"   "}
              <Tooltip id="toolTip" TransitionComponent={Zoom} title="Deploy">
                <Button onClick={() => props.deployhosts()} variant="contained" color='primary'>
                  <PublishIcon/>
                </Button>
              </Tooltip>
            </div>

          </Col>

      </Container>

  );
}
