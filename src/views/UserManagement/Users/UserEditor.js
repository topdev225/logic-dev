import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button
} from '@material-ui/core';

export default function UserEditor(props){

  const [ unchanged, setUnchanged ] = React.useState(true);
  const [ changing, setChanging ] = React.useState(false);
  const [ error, setError] = React.useState({ given_name: false,
  family_name: false,
  cluster_access: false,
  email: false,
  password: false,
  repassword: false
});
  const [ validForm, setValidForm] = React.useState(true);
  const [ profile, setProfile ] = React.useState(props.row_data)
  const [ closed, setClosed] = React.useState(false);

  useEffect(() => {
    if(
         (profile.email === '' && props.new_profile !== true && props.row_data !== profile) ||
         (changing !== true && props.row_data.email !== profile.email) ||
         (changing !== true && props.new_profile === true) ||
         (closed === true)
      ){
          setProfile(props.row_data)
          setClosed(false)
          setError({ given_name: false,
          family_name: false,
          cluster_access: false,
          email: false,
          password: false,
          repassword: false
        })
      }
  }, [profile, closed, profile.email, props.row_data, props.new_profile, changing])

  function validate(profile){

    let errorTemp = {...error}

    // validate first name
    if(profile.given_name === '') {
      errorTemp['given_name'] = true
      setError(errorTemp);
    } else {
      errorTemp['given_name'] = false
      setError(errorTemp);
    }

    if(profile.family_name === '') {
      errorTemp['family_name'] = true
      setError(errorTemp);
    } else {
      errorTemp['family_name'] = false
      setError(errorTemp);

    }

    if(profile.cluster_access.length === 0) {
      errorTemp['cluster_access'] = true
      setError(errorTemp);
    } else {
      errorTemp['cluster_access'] = false
      setError(errorTemp);

    }

    const email_regex = new RegExp(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    if( profile.email === '' || email_regex.test(profile.email) === false) {
      errorTemp['email'] = true
      setError(errorTemp);
    } else {
      errorTemp['email'] = false
      setError(errorTemp);
    }

    const lower_check_regex = new RegExp(/^(?=.*[a-z]).+$/)
    const upper_check_regex = new RegExp(/^(?=.*[A-Z]).+$/)
    const number_check_regex = new RegExp(/^(?=.*[0-9_\W]).+$/)

    if((profile.password === '' ||
       profile.password !== profile.repassword) &&
       props.new_profile === true) {
        errorTemp['password'] = true
        errorTemp['repassword'] = true
        setError(errorTemp);
    } else {
      if(props.new_profile === true){
        const length_check = (profile.password.length >= 8 && profile.repassword.length >= 8)
        const lower_check = (lower_check_regex.test(profile.password) && lower_check_regex.test(profile.repassword))
        const upper_check = (upper_check_regex.test(profile.password) && upper_check_regex.test(profile.repassword))
        const number_check = (number_check_regex.test(profile.password) && number_check_regex.test(profile.repassword))
        // console.log("PASS1: " + length_check)
        // console.log("PASS2: " + lower_check)
        // console.log("PASS3: " + upper_check)
        // console.log("PASS4: " + number_check)

        if( length_check === true && lower_check === true && upper_check === true && number_check === true){
          errorTemp['password'] = false
          errorTemp['repassword'] = false
          setError(errorTemp);
        }

      } else {
      errorTemp['password'] = false
      errorTemp['repassword'] = false
      setError(errorTemp);
      }
    }



    for(let i=0; i<Object.keys(error).length; i++){
      let key = Object.keys(error)[i]
      if( errorTemp[key] === true ){
        setValidForm(true)
        break;
      } else {
        setValidForm(false)
      }
    }

  }
  // END Vaildation Function

  const newOktaValues = (event) => {
    setChanging(true)
    let profileTemp = {...profile}
    profileTemp[event.target.name] = event.target.value
    validate(profileTemp);
    setProfile(profileTemp);
    setUnchanged(false)
  }


  const resetForm = (event) => {
    setProfile(props.row_data)
    let profileTemp = {...profile}
    validate(profileTemp);
    setValidForm(true)
    setUnchanged(true)
  }

  const handleClose = (e) => {
    e.preventDefault()
    setClosed(true)
    setUnchanged(true)
    setValidForm(true)
    props.onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${process.env.REACT_APP_FETCH_URL}`,{
      headers: {
        function: 'okta_profile',
        data: JSON.stringify(profile),
        new_profile: props.new_profile,
        customer_group: props.customer_group
      }
    })
    .then((res) => {
      if(res.status === 200){
        setUnchanged(true)
        setValidForm(true)
        props.refresh_users(props.customer_group, true)
        props.onClose()
      }
    })

  }

  return (
    <Dialog
      open={props.open}
      aria-labelledby="responsive-dialog-title"
    >
    <DialogTitle>
      { props.new_profile ?
        <div><h2>Create User</h2></div>
        :
        <div><h2>Edit Profile</h2></div>
      }
      </DialogTitle>
      <DialogContent>
      <form
      autoComplete="true">
      <Grid container alignItems="flex-start" spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            required
            error={error.given_name}
            name="given_name"
            type="text"
            label="First Name"
            value={profile.given_name || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            error={error.family_name}
            name="family_name"
            type="text"
            label="Last Name"
            value={profile.family_name || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="email"
            fullWidth
            required
            error={error.email}
            type="email"
            label="Email"
            value={profile.email || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="organization"
            fullWidth
            type="organization"
            label="Organization"
            value={profile.organization || ''}
            onChange={newOktaValues}
          />
        </Grid>
        { props.new_profile &&
        <Grid item xs={6}>
          <TextField
            name="password"
            fullWidth
            required
            error={error.password}
            type="password"
            label="Password"
            value={profile.password || ''}
            onChange={newOktaValues}
          />
        </Grid>
      } {props.new_profile &&
        <Grid item xs={6}>
          <TextField
            name="repassword"
            fullWidth
            required
            error={error.repassword}
            type="password"
            label="Retype Password"
            value={profile.repassword || ''}
            onChange={newOktaValues}
          />
        </Grid>

        }


        <Grid item xs={6}>
          <TextField
            name="mobilePhone"
            fullWidth
            type="mobile-number"
            label="Mobile Phone Number"
            value={profile.mobilePhone || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="select-mobileCarrier-label">Carrier</InputLabel>
            <Select
              name="mobileCarrier"
              labelId="select-mobileCarrier-label"
              value={profile.mobileCarrier || ''}
              onChange={newOktaValues}
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
          </FormControl>
        </Grid>

        <Grid item xs={10}>
          <TextField
            name="streetAddress"
            fullWidth
            type="address"
            label="Street Address"
            value={profile.streetAddress || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel htmlFor="select-USstate-label">State</InputLabel>
          <Select
            name="state"
            labelId="select-USstate-label"
            value={profile.state || ''}
            onChange={newOktaValues}
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
            name="city"
            fullWidth
            type="city"
            label="City"
            value={profile.city || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            name="zipCode"
            fullWidth
            type="zipcode"
            label="Zip Code"
            value={profile.zipCode || ''}
            onChange={newOktaValues}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="select-cluster_access-label">Site Access</InputLabel>
            <Select
              multiple
              required
              name="cluster_access"
              labelId="select-cluster_access-label"
              error={error.cluster_access}
              value={profile.cluster_access}
              onChange={newOktaValues}
            >
              <MenuItem value="dev">Abis</MenuItem>
              <MenuItem value="manassasmall">Manassas Mall</MenuItem>
              <MenuItem value="newcombboyd">Newcomb Boyd</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item style={{ marginTop: 16 }}>
          <Button
            type="button"
            variant="contained"
            disabled={unchanged}
            onClick={resetForm}
          >
            Reset
          </Button>
        </Grid>
        <Grid item style={{ marginTop: 16 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={validForm}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          </Grid>
          <Grid item style={{ marginTop: 16 }}>
            <Button
              variant="contained"
              color="primary"
              type="reset"
              onClick={handleClose}
            >
              Close
            </Button>
            </Grid>
      </Grid>
      </form>
      </DialogContent>
    </Dialog>


  )
}
