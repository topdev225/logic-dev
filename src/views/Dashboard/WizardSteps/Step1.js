import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TableChartIcon from '@material-ui/icons/TableChart';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {useSelector, useDispatch} from 'react-redux'
import allActions from '../../../redux/actions'

const useStyles = makeStyles(theme => ({
  labels: {
    textAlign: 'center',
    marginBottom: '10px',
    marginTop: '20px'
  },
  optionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  paperContainer: {
    textAlign: 'center'
  },
  displayTypes: {
    height: '100px',
    width: '100px',
    margin: '15px',
    color: '#fff',
    backgroundColor: '#e0e0e0',
  },
  selectedDisplayType: {
    backgroundImage: 'linear-gradient(135deg, #0A223E, #7FB4D6)',
  },
  icons: {
    fontSize: '6rem'
  },
}));

export default function Step1(props) {

  const dataDisplayType = useSelector(state => state.dataDisplayType)
  const selectedOrganizations = useSelector(state => state.selectedOrganizations)

  const dispatch = useDispatch()

  const options = props.organizationdisplaynames.map((name, i) => {
    return {
      name: name,
      id: i
    }
  })

  const getOrgName = (displayName) => {
    return props.clusteraccessjoined[props.organizationdisplaynames.indexOf(displayName)]
  }

  const classes = useStyles();

  return (

    <div >

      <Typography className={classes.labels} variant="h5">
        Customer Select
      </Typography>

      <div>
        <Autocomplete
          multiple
          id="wizard-org-selector"
          options={options.length ? options.map(organization => organization.name) : []}
          getOptionLabel={option => option}
          value={selectedOrganizations.organizations.map(obj => obj.displayName) ? selectedOrganizations.organizations.map(obj => obj.displayName) : []}
          onChange={ (e) => {
              e.currentTarget.nodeName === "svg" ?
              dispatch(allActions.dashboardActions.removeOrganization(e.target.parentElement.parentElement.innerText)) :
              dispatch(allActions.dashboardActions.addOrganization(e.target.textContent, getOrgName(e.target.textContent)))
            }
          }
          renderInput={params => (
            <TextField {...params}
              label={'Organizations'}
              variant="outlined"
              fullWidth
            />
          )}
        />
      </div>

      <Typography className={classes.labels} variant="h5">
        Display Type
      </Typography>

      <div className={classes.optionsContainer}>

        <div className={classes.paperContainer}>
            <Button
              variant="contained"
              className={dataDisplayType.num === 1 ? `${classes.displayTypes} ${classes.selectedDisplayType}` : classes.displayTypes}
              elevation={2}
              onClick={() => dispatch(allActions.dashboardActions.setDataDisplayType(1))}
            >
              <EqualizerIcon className={classes.icons} />
            </Button>
          <Typography>
            Graph
          </Typography>
        </div>

        <div className={classes.paperContainer}>
            <Button
              variant="contained"
              className={dataDisplayType.num === 2 ? `${classes.displayTypes} ${classes.selectedDisplayType}` : classes.displayTypes}
              elevation={12}
              onClick={() => dispatch(allActions.dashboardActions.setDataDisplayType(2))}
            >
              <TableChartIcon className={classes.icons} />
            </Button>
          <Typography>
            Table
          </Typography>
        </div>

      </div>

    </div>

  );
}
