import React from "react";
import IncidentsChart from './IncidentsChart.js';
import { SwapSpinner } from "react-spinners-kit";

const LoadChart = (props) => {

  // const override = {
  //   display: 'block',
  //   margin: '0 auto',
  //   paddingTop: '150px',
  //   height: '300px'
  // }

    return (

      <>

      {

      !props.incident_data ?

      <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px', height: '300px'}}>
        <SwapSpinner
          size={75}
          color="rgb(242,97,39)"
          loading={true}
        />
      </div>

      :

      <IncidentsChart
        data={props.incident_data}
      />

      }

    </>

   )
 }

export default LoadChart
