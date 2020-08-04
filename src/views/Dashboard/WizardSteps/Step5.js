import React from 'react';
import DashboardLineChart from '../GoldenLayout/DashboardLineChart'
import {useSelector} from 'react-redux'

export default function Step5(props) {

  const selectedSeries = useSelector(state => state.selectedSeries)
  const fetchedWizardData = useSelector(state => state.fetchedWizardData)
  const seriesColors = useSelector(state => state.seriesColors)
  const graphOptions = useSelector(state => state.graphOptions).options

  return (
    <div>
      <DashboardLineChart
        //Pass data objects with all non-selected preferences filtered out to DashboardLineChart as prop
        dataobjects={props.fetchedwizarddata(selectedSeries, fetchedWizardData, seriesColors, graphOptions)}
        idnum={100}
      />
    </div>
  );
}
