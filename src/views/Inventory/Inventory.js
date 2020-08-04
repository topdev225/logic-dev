import React, { Component } from 'react';
import InventoryTable from './InventoryTable';
import { RotateSpinner } from "react-spinners-kit";
import { withAuth } from '@okta/okta-react';

export default withAuth(
class DefaultLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      directorOrgs: [],
    };
    this.fetchDirector()
  }

  async fetchDirector(){
    let userInfo = await this.props.auth.getUser()

    let clusterAccessJoined = userInfo.cluster_access.map(org =>
      org.split(' ').join('').toLowerCase()
    )

      for (let i=0; i<clusterAccessJoined.length; i++){
        await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'directordata',
            organization: clusterAccessJoined[i],
          }
        })
        .then((res) => res.json())
        .then((json) => {

          let directorOrgs = [...this.state.directorOrgs]
          directorOrgs.push({[json.organization]: json.data})

          this.setState({
            directorOrgs: directorOrgs
          })

        })
      }
      this.setState({
        directorOrgsLength: this.state.directorOrgs.length
      })

  }





  updateHost = (state) => {

    let updatedData = []

    for(let i=0; i<this.state.clusterAccessJoined.length; i++){
        updatedData.push({[this.state.clusterAccessJoined[i]]: []})
    }

    let orgs = {}

    for(let x=0; x<updatedData.length; x++){
      orgs[this.state.clusterAccessJoined[x]] = Object.keys(this.props.organizations[x])[0]
    }

    for(let y=0; y<updatedData.length; y++){
        for(let index=0; index<state.data.length; index++){
            if(state.data[index].cluster === Object.keys(this.props.organizations[y])[0]){
              updatedData[y][this.state.clusterAccessJoined[y]].push(state.data[index])
            }
        }
    }

    this.setState({
      directorOrgs: updatedData
    })
  }




  async postHosts(){

    for(let i=0; i<this.state.directorOrgs.length; i++){

      for(let index=0; index<this.state.directorOrgs[i][this.state.clusterAccessJoined[i]].length; index++){

        let hostUpdates = {
          "object_name": this.state.directorOrgs[i][this.state.clusterAccessJoined[i]][index].hostName,
          "display_name": this.state.directorOrgs[i][this.state.clusterAccessJoined[i]][index].displayName,
          "vars.jira_priority": this.state.directorOrgs[i][this.state.clusterAccessJoined[i]][index].priority
        }

        let stringifiedHostUpdates = JSON.stringify(hostUpdates)

        await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
          headers: {
            function: 'posthosts',
            organization: this.state.clusterAccessJoined[i],
            name: this.state.directorOrgs[i][this.state.clusterAccessJoined[i]][index].hostName,
            hostUpdates: stringifiedHostUpdates,
          }
        })
        .then((res) => {
          return res.json()})
        .then((json) => {

        })
      }
    }
  }




  deployHosts(){
    for(let i=0; i<this.state.directorOrgs.length; i++){
      fetch(`${process.env.REACT_APP_FETCH_URL}`,{
        headers: {
          function: 'deploy',
          organization: this.state.clusterAccessJoined[i],
        }
      })
      .then((res) => {
        return res.json()})
      .then((json) => {
        return
      })
    }
  }




  render() {
    return (
      <>
        {this.state.directorOrgsLength ?
          <InventoryTable
            directorOrgs={this.state.directorOrgs}
            directorOrgsLength={this.state.directorOrgsLength}
            organizations={this.props.organizations}
            posthosts={this.postHosts}
            deployhosts={this.deployHosts}
            updatehost={this.updateHosts}
          />
          :
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '15%'}}>
            <RotateSpinner
              size={350}
              color="rgb(242,97,39)"
              loading={true}
            />
          </div>
        }
      </>
    );
  }
}
)
