import React from "react";
import DashboardLineChart from "./DashboardLineChart"
import {useSelector} from 'react-redux'

export default function MyGoldenPanel(props) {

  const layoutchangehasfinished = useSelector(state => state.layoutChangeHasFinished)

    return (
      <>
        {
          layoutchangehasfinished.value &&
            <DashboardLineChart
              dataobjects={props.dataobjects}
              idnum={props.idnum}
              tabvalue={props.tabvalue}
            />
        }
      </>
    );
}
