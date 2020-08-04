import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TreeView from '../../../Modules/TreeView';
import TreeItem from '../../../Modules/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';
import Warning from '@material-ui/icons/Warning';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import Button from '@material-ui/core/Button'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import SaveIcon from '@material-ui/icons/Save';
import {useDispatch} from 'react-redux'
import allActions from '../../../redux/actions'

import {
  Col,
  Row
} from 'reactstrap';




function MinusSquareUp(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
    <CheckCircle fontSize='small' style={{color: '#43a047', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function PlusSquareUp(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
    <CheckCircle fontSize='small' style={{color: '#43a047', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function CloseSquareUp(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} className="close" fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
    <CheckCircle fontSize='small' style={{color: '#43a047', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}









function MinusSquareDown(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
    <Error fontSize='small' style={{color: '#f44336', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function PlusSquareDown(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
    <Error fontSize='small' style={{color: '#f44336', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function CloseSquareDown(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} className="close" fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
    <Error fontSize='small' style={{color: '#f44336', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}







function MinusSquareWarning(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
    <Warning fontSize='small' style={{color: '#ffab00', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function PlusSquareWarning(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
    <Warning fontSize='small' style={{color: '#ffab00', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}
function CloseSquareWarning(props) {
  return (
    <div style={{display: 'flex'}}>
    <SvgIcon style={{color: '#000', marginTop: "4px"}} className="close" fontSize="inherit" {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
    <Warning fontSize='small' style={{color: '#ffab00', paddingLeft: '3px', paddingRight: '3px'}}/>
</div>
  );
}






function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });
  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
      color: '#000'
    },
  },
  group: {
    marginLeft: 12,
    paddingLeft: 12,
    borderLeft: `1px dashed #000`,
    color: '#000'
  },
}))(props => <TreeItem {...props} TransitionComponent={TransitionComponent} />);

StyledTreeItem.propTypes = {
  labelIcon: PropTypes.elementType.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function IndividualDeviceBoardChild(props) {

  const dispatch = useDispatch()

  const formatted_json = []

  const data = props.organizations

  let nodeIds = Object.keys(data).map((el, i) => i)
  let defaultExpanded = Object.keys(data).map((el, i) => i)

  // const [expanded, setExpanded] = React.useState(defaultExpanded);

  for(let i=0; i<Object.keys(data).length; i++){

    formatted_json.push([])

      data[Object.keys(data)[i]].host_data.map((result) => {
        if(result.attrs.vars !== null && result.attrs.vars.parent_host !== undefined){
          return formatted_json[i].push(
            {
              'hostname': result.attrs.name,
              'parent_host': result.attrs.vars.parent_host,
              'display_name': result.attrs.display_name,
              'state': result.attrs.state
            }
          )
        }
        else {
          return formatted_json[i].push(
            {
              'hostname': result.attrs.name,
              'display_name': result.attrs.display_name,
              'state': result.attrs.state
            }
          )
        }
      })
  }


  // Create root for top-level node(s)
  const root = formatted_json.map(element => []);
  // Cache found parent index
  const map = {};

  for(let i=0; i<formatted_json.length; i++){
    formatted_json[i].forEach(node => {
      // No parentId means top level
      if (!node.parent_host) return root[i].push(node);
      // Insert node as child of parent in flat array
      let parentIndex = map[node.parent_host];
      if (typeof parentIndex !== "number") {
        parentIndex = formatted_json[i].findIndex(el => el.hostname === node.parent_host);
        map[node.parent_host] = parentIndex;
      }
      if (!formatted_json[i][parentIndex].children) {
        return formatted_json[i][parentIndex].children = [node];
      }
      formatted_json[i][parentIndex].children.push(node);
    });
  }

  function mapAllTreeItems(arr, index){

    let organization = props.clusteraccessjoined[index]

    return arr.map((obj, i) => {

      let collapseIcon
      let expandIcon
      let endIcon

      if(obj.state === 0){
        collapseIcon = <MinusSquareUp/>
        expandIcon = <PlusSquareUp/>
        endIcon = <CloseSquareUp/>
      } else {
        collapseIcon = <MinusSquareDown/>
        expandIcon = <PlusSquareDown/>
        endIcon = <CloseSquareDown/>
      }

      let identifier = `${obj.display_name}_${i}`
      nodeIds.push(identifier)
      let treeProps = {
        savetreeiteminfo: props.savetreeiteminfo,
        fetchdataforselectedtreeitem: props.fetchdataforselectedtreeitem,
        label: obj.display_name,
        name: obj.hostname,
        state: obj.state,
        nodeId: identifier,
        key: identifier,
        organization: organization,
        startDate: props.startDate,
        endDate: props.endDate,
        collapseIcon: collapseIcon,
        expandIcon: expandIcon,
        endIcon: endIcon,
        updatedimensions: props.updatedimensions,
        treeiteminfo: props.treeiteminfo
      }
      if(obj.children !== undefined){
          return React.createElement(StyledTreeItem, treeProps, mapAllTreeItems(obj.children, index))
      } else {
          return React.createElement(StyledTreeItem, treeProps)
      }
    })
  }

  const { updatedimensions } = props;

  useEffect(() => {
    updatedimensions()
  }, [updatedimensions])




  // Dialog controls for "Add a Host" link

  const [open, setOpen] = React.useState(false);
  const [currentCluster, setCurrentCluster] = React.useState(null);

  const [hostName, setHostName] = React.useState(null);
  const [displayName, setDisplayName] = React.useState(null);
  const [ip, setIP] = React.useState(null);
  const [template, setTemplate] = React.useState(null);
  const [index, setIndex] = React.useState(null);

  const [templateOptions, setTemplateOptions] = React.useState(null);

  const handleClickOpen = (cluster, index) => {
    getTemplates(index)
    setCurrentCluster(cluster)
    setIndex(index)
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setHostName(null)
    setDisplayName(null)
    setTemplate(null)
    setIP(null)
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Fetch Templates

  function getTemplates(i){
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'templates',
        organization: props.clusteraccessjoined[i],
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      setTemplateOptions(json)
    })
  }

  function addHost(index){
    let hostObj = {
      object_name: hostName,
      display_name: displayName,
      imports: template,
      address: ip,
      object_type: "object"
    }
    let organization = props.clusteraccessjoined[index]
    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'addhost',
        organization: organization,
        hostobj: JSON.stringify(hostObj)
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      if(!json.error){
        setHostName("")
        setDisplayName("")
        setIP("")
        setTemplate(null)
        dispatch(allActions.appActions.newAlert("Host was saved successfully", 'success'))
      } else if (json.error.slice(0,18) === "Trying to recreate") {
        dispatch(allActions.appActions.newAlert(json.error, 'error'))
      } else {
        dispatch(allActions.appActions.newAlert("All fields must be complete for Host to be saved", 'error'))
      }
    })
  }



  const classes = useStyles();

  return(
    <div className="animated fadeIn">

      {/*<Button
        variant="outlined"
        color="primary"
        onClick={() => setExpanded(nodeIds)}
      >
        <VerticalAlignCenterIcon/>
      </Button>*/}
      {props.clusteraccessjoined ?
      <div style={{padding: '7px', maxHeight: `${window.innerHeight-207}px`, overflowY: 'scroll', overflowX: 'hidden'}}>
        <Row>
          <Col>
            <TreeView
              className={classes.root}
              defaultExpanded={defaultExpanded}
            >
            {root.map((element, i) => {
              return <StyledTreeItem
                label={Object.keys(data)[i]}
                nodeId={Object.keys(data).indexOf(Object.keys(data)[i])}
                key={Object.keys(data)[i]}
                collapseIcon={formatted_json[i].filter(el => el.state !== 0).length === 0 ? <MinusSquareUp/> : <MinusSquareWarning/>}
                expandIcon={formatted_json[i].filter(el => el.state !== 0).length === 0 ? <PlusSquareUp/> : <PlusSquareWarning/>}
                endIcon={formatted_json[i].filter(el => el.state !== 0).length === 0 ? <CloseSquareUp/> : <CloseSquareWarning/>}
              >
              {mapAllTreeItems(element, i)}
              <StyledTreeItem label={"Add a Host"}
                openaddhostdialog={handleClickOpen}
                cluster={Object.keys(data)[i]}
                key={i}
                index={i}
              />
              </StyledTreeItem>
            })}
            </TreeView>
          </Col>
        </Row>
      </div>
    : null}

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a Host to {currentCluster} Cluster</DialogTitle>
        <DialogContent style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Host Name"
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            fullwidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            fullwidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="IP"
            type="email"
            value={ip}
            onChange={(e) => setIP(e.target.value)}
            fullwidth
          />
          <Autocomplete
            id="combo-box-demo"
            options={templateOptions}
            getOptionLabel={option => option}
            style={{ width: 250 }}
            value={template}
            onChange={(e) => setTemplate(e.target.textContent)}
            renderInput={params => (
              <TextField {...params} style={{width: "250px"}} label={'Template'} variant="outlined" fullwidth />
            )}
            fullwidth
          />
        </DialogContent>
        <DialogActions>
          <Tooltip id="toolTip" TransitionComponent={Zoom} placement="top" title="Cancel">
            <Button onClick={handleCancel} variant="contained" style={{color: '#fff', backgroundColor: '#e53935'}}>
              <CancelPresentationIcon/>
            </Button>
          </Tooltip>
          <Tooltip id="toolTip" TransitionComponent={Zoom} placement="top" title="Save">
            <Button onClick={() => addHost(index)} variant="contained" style={{color: '#fff', backgroundColor: '#43a047'}}>
                <SaveIcon/>
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>

    </div>
  );

}
