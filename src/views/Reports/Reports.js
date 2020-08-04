import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25%'
  },
}));

export default function Reports(props) {

  const classes = useStyles();

  return (
      <div className={classes.root}>
        <h1>
          FEATURE COMING SOON
       </h1>
      </div>
  );
}
