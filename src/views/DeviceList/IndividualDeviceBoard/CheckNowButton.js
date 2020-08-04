import React from 'react';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import {useDispatch} from 'react-redux'
import allActions from '../../../redux/actions'

export default function CheckNowButton(props) {

  const dispatch = useDispatch()

  function scheduleCheck(device, org){

    fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'check',
        name: device,
        organization: org
      }
    })
    .then((res) => {
      return res.json()})
    .then((json) => {
      dispatch(allActions.appActions.newAlert('Successfully rescheduled check!', 'success'))
    }
  )}

  return (
    <div>


      <Tooltip id="toolTip" TransitionComponent={Zoom} title="Check Now">
          <Button
            onClick={props.devicename ? () => scheduleCheck(props.devicename, props.orgname) : null}
            variant='outlined'
            color='primary'
            style={{
              // right: '19px',
              // position: 'absolute',
              zIndex: 100,
            }}
          >
            <RestoreIcon/>
          </Button>
      </Tooltip>
    </div>
  );
}
