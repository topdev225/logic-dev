import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PieChart from './PieChart'

const useStyles = makeStyles({
  root: {
  },
  flex: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

export default function PieChartContainer(props) {

  const classes = useStyles();

  return (
    <>
      { (props.closedby && props.issue_type && props.reporter && props.priority_count) &&
        <div className={classes.scroll}>
          <div className={classes.flex}>
            <div className={classes.flexItem}>
              <div>
                <PieChart
                  key='1'
                  divId={"chart1"}
                  dataObj={props.closedby}
                  title={"Closed By"}
                />
              </div>
              <div>
                <PieChart
                  key='2'
                  divId={"chart2"}
                  dataObj={props.issue_type}
                  title={"Issue Type"}
                />
              </div>
            </div>
            <div className={classes.flexItem}>
              <div>
                <PieChart
                  key='3'
                  divId={"chart3"}
                  dataObj={props.reporter}
                  title={"Reporters"}
                />
              </div>
              <div>
                <PieChart
                  key='4'
                  divId={"chart4"}
                  dataObj={props.priority_count}
                  title={"Priority"}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}
