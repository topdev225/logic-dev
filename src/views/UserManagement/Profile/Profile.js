import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
} from '@material-ui/core';
import {
  Row
} from 'reactstrap';


export default withAuth( class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = { userInfo: {},
                   unchanged: true
      };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(){
    const userInfo = await this.props.auth.getUser();
    this.setState({
      userInfo: userInfo
    })
}

newOktaValues = (value) => {
  var userInfoTemp = {...this.state.userInfo}
  userInfoTemp[value.target.name] = value.target.value
  this.setState({
    userInfo: userInfoTemp,
    unchanged: false
  })
}

resetForm = async () => {
  const userInfo = await this.props.auth.getUser();
  this.setState({
    userInfo: userInfo,
    unchanged: true
  })
}

okta_values = () => {}



async handleSubmit(e) {
  e.preventDefault();
  await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
    headers: {
      function: 'okta_profile',
      data: JSON.stringify(this.state.userInfo)
    }
  })
  .then((res) => {
    console.log(res)
    if(res.status === 200){
      this.setState({
        unchanged: true
      })
    }
  })

}



  render() {
    return (
      <div className="animated fadeIn">
      <Row style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <Card style={{height: '100%', width: window.innerWidth < 930 ? '100%' : '70%' }}
        raised={true}>
          <CardContent>
            <form
            autoComplete="true">
            <Grid container alignItems="flex-start" spacing={2}>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <TextField
                  fullWidth
                  required
                  name="given_name"
                  type="text"
                  label="FIRST NAME"
                  value={this.state.userInfo.given_name || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <TextField
                  fullWidth
                  required
                  name="family_name"
                  type="text"
                  label="LAST NAME"
                  value={this.state.userInfo.family_name || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <TextField
                  name="email"
                  fullWidth
                  required
                  type="email"
                  label="EMAIL"
                  value={this.state.userInfo.email || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <TextField
                  name="organization"
                  fullWidth
                  required
                  type="organization"
                  label="ORGANIZATION"
                  value={this.state.userInfo.organization || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <TextField
                  name="mobilePhone"
                  fullWidth
                  required
                  type="mobile-number"
                  label="MOBILE PHONE NUMBER"
                  value={this.state.userInfo.mobilePhone || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-mobileCarrier-label">CARRIER</InputLabel>
                  <Select
                    name="mobileCarrier"
                    labelId="select-mobileCarrier-label"
                    value={this.state.userInfo.mobileCarrier || ''}
                    onChange={this.newOktaValues}
                  >
                    <MenuItem value="Alltel">Alltel</MenuItem>
                    <MenuItem value="ATT">AT&T</MenuItem>
                    <MenuItem value="Boost Mobile">Boost Mobile</MenuItem>
                    <MenuItem value="Cricket Wireless">Cricket Wireless</MenuItem>
                    <MenuItem value="FirstNet">FirstNet</MenuItem>
                    <MenuItem value="MetroPCS">MetroPCS</MenuItem>
                    <MenuItem value="Republic Wireless">Republic Wireless</MenuItem>
                    <MenuItem value="Sprint">Sprint</MenuItem>
                    <MenuItem value="T-Mobile">T-Mobile</MenuItem>
                    <MenuItem value="U.S. Cellular">U.S. Cellular</MenuItem>
                    <MenuItem value="Verizon Wireless">Verizon Wireless</MenuItem>
                    <MenuItem value="Virgin Mobile">Virgin Mobile</MenuItem>
                  </Select>
                  <FormHelperText>Mobile phone carrier for reciving text notifications</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="streetAddress"
                  fullWidth
                  type="address"
                  label="STREET ADDRESS"
                  value={this.state.userInfo.streetAddress || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="city"
                  fullWidth
                  type="city"
                  label="CITY"
                  value={this.state.userInfo.city || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="select-USstate-label">STATE</InputLabel>
                <Select
                  name="state"
                  labelId="select-USstate-label"
                  value={this.state.userInfo.state || ''}
                  onChange={this.newOktaValues}
                >
                  <MenuItem value="Alabama">Alabama</MenuItem>
                  <MenuItem value="Alaska">Alaska</MenuItem>
                  <MenuItem value="Arizona">Arizona</MenuItem>
                  <MenuItem value="Arkansas">Arkansas</MenuItem>
                  <MenuItem value="California">California</MenuItem>
                  <MenuItem value="Colorado">Colorado</MenuItem>
                  <MenuItem value="Connecticut">Connecticut</MenuItem>
                  <MenuItem value="Delaware">Delaware</MenuItem>
                  <MenuItem value="District Of Columbia">District Of Columbia</MenuItem>
                  <MenuItem value="Florida">Florida</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Hawaii">Hawaii</MenuItem>
                  <MenuItem value="Idaho">Idaho</MenuItem>
                  <MenuItem value="Illinois">Illinois</MenuItem>
                  <MenuItem value="Indiana">Indiana</MenuItem>
                  <MenuItem value="Iowa">Iowa</MenuItem>
                  <MenuItem value="Kansas">Kansas</MenuItem>
                  <MenuItem value="Kentucky">Kentucky</MenuItem>
                  <MenuItem value="Louisiana">Louisiana</MenuItem>
                  <MenuItem value="Maine">Maine</MenuItem>
                  <MenuItem value="Maryland">Maryland</MenuItem>
                  <MenuItem value="Massachusetts">Massachusetts</MenuItem>
                  <MenuItem value="Michigan">Michigan</MenuItem>
                  <MenuItem value="Minnesota">Minnesota</MenuItem>
                  <MenuItem value="Mississippi">Mississippi</MenuItem>
                  <MenuItem value="Missouri">Missouri</MenuItem>
                  <MenuItem value="Montana">Montana</MenuItem>
                  <MenuItem value="Nebraska">Nebraska</MenuItem>
                  <MenuItem value="Nevada">Nevada</MenuItem>
                  <MenuItem value="New Hampshire">New Hampshire</MenuItem>
                  <MenuItem value="New Jersey">New Jersey</MenuItem>
                  <MenuItem value="New Mexico">New Mexico</MenuItem>
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="North Carolina">North Carolina</MenuItem>
                  <MenuItem value="North Dakota">North Dakota</MenuItem>
                  <MenuItem value="Ohio">Ohio</MenuItem>
                  <MenuItem value="Oklahoma">Oklahoma</MenuItem>
                  <MenuItem value="Oregon">Oregon</MenuItem>
                  <MenuItem value="Pennsylvania">Pennsylvania</MenuItem>
                  <MenuItem value="Rhode Island">Rhode Island</MenuItem>
                  <MenuItem value="South Carolina">South Carolina</MenuItem>
                  <MenuItem value="South Dakota">South Dakota</MenuItem>
                  <MenuItem value="Tennessee">Tennessee</MenuItem>
                  <MenuItem value="Texas">Texas</MenuItem>
                  <MenuItem value="Utah">Utah</MenuItem>
                  <MenuItem value="Vermont">Vermont</MenuItem>
                  <MenuItem value="Virginia">Virginia</MenuItem>
                  <MenuItem value="Washington">Washington</MenuItem>
                  <MenuItem value="West Virginia">West Virginia</MenuItem>
                  <MenuItem value="Wisconsin">Wisconsin</MenuItem>
                  <MenuItem value="Wyoming">Wyoming</MenuItem>
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="zipcode"
                  fullWidth
                  type="zipcode"
                  label="ZIP CODE"
                  value={this.state.userInfo.zipcode || ''}
                  onChange={this.newOktaValues}
                />
              </Grid>

              <Grid item style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={this.resetForm}
                  disabled={this.state.unchanged}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item style={{ marginTop: 16 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={(e) => this.handleSubmit(e)}
                  disabled={this.state.unchanged}
                >
                  Submit
                </Button>
                </Grid>
            </Grid>
            </form>
          </CardContent>
        </Card>
        </Row>
        </div>
    );
  }
})
