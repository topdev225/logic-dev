import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from '../../../Modules/material-table-copy';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%'
  }
}));

export default function UdfContainer(props) {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const chartColumns = [
    { title: 'UDF NAME', field: 'udfName', autocomplete: props.options },
    { title: 'UDF VALUE', field: 'udfValue', },
  ]


  return (
    <div className={classes.root}>
      <Divider/>
      <CardActions disableSpacing>
        <div className={classes.cardActions} >
          <Typography>
            User Defined Field Table
          </Typography>
        </div>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>

      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
          <MaterialTable
            title={""}
            columns={chartColumns}
            data={props.data}
            style={{width: '100%'}}
            options={{
              sorting: true,
              paging: true,
              search: true,
              showTitle: false,
              toolbar: true,
              pageSize: 5,
              exportButton: true,
              headerStyle: {
                backgroundColor: '#3667A6',
                color: '#FFF',
                fontWeight: "bold"
              }
            }}
            components={{
                 Container: props => <Paper {...props} elevation={0}/>
            }}
            editable={{
              onRowAdd: newData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      const data = [...props.data];
                      data.push(newData);
                      props.setdata( data, props.index, () => resolve() );
                    }
                    resolve()
                  }, 1000)
                }),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      const data = [...props.data];
                      const index = data.indexOf(oldData);
                      data[index] = newData;
                      props.setdata( data, props.index, () => resolve() );
                    }
                    resolve()
                  }, 1000)
                }),
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    {
                      let data = [...props.data];
                      const index = data.indexOf(oldData);
                      data.splice(index, 1);
                      props.setdata( data, props.index, () => resolve() );
                    }
                    resolve()
                  }, 1000)
                }),
            }}
          />
      </Collapse>
    </div>
  );
}
