import React, {Component} from 'react';
import SlaChart from './SlaChart'
import { SwapSpinner } from "react-spinners-kit";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {

    return (
      <>
        {!!this.props.sladata ?
          <SlaChart
            slaData={this.props.sladata}
          />

          :

        <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
          <SwapSpinner
            size={75}
            color="rgb(242,97,39)"
            loading={true}
          />
        </div>

        }
      </>
    )
  }

}
