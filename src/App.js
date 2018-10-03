import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import './App.css';

const axios = Axios.create({
  //baseURL: 'http://localhost:8000/',
  baseURL: 'http://oehu.local:8000/',
});

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      networks: [],
      password: "",
      selectedNetwork: "",
      selectedSSID: "",
    }

    this.getNetworks();

  }

  render() {

    const networkItems = this.state.networks.map((item) =>
        <MenuItem key={item.bssid} value={item.ssid}>{item.ssid}</MenuItem>
    );

    return (
      <div className="App">
          <Grid container className="main-grid" spacing={24} justify="center" alignItems="center">
            <Grid item xs={6}>
              <Paper className="settings-wrapper">
                  <Typography variant="headline">Setup Wifi</Typography>

                  <FormControl className="form-control">
                      <InputLabel htmlFor="age-helper">Wifi networks</InputLabel>
                    <Select
                      value={this.state.selectedNetwork}
                      onChange={this.handleChange("selectedNetwork")}
                      inputProps={{
                        name: 'age',
                        id: 'age-simple',
                      }}
                    >
                        {networkItems}
                    </Select>
                  </FormControl>

                  <TextField
                    id="standard-password-input"
                    label="Password"
                    className="form-control"
                    type="password"
                    autoComplete="current-password"
                    margin="normal"
                    value={this.state.password}
                    onChange={this.handleChange("password")}
                  />

                  <Button onClick={this.handleConnect} variant="contained" color="primary" className="form-control">
                    Connect
                  </Button>

                  <Typography className="explainer-text" variant="">
                      You have to enter this correctly on the first try. If it fails please reboot the device by disconnecting the power supply. On success go to https://oehu.org/setup to setup your device.
                  </Typography>

              </Paper>
            </Grid>
          </Grid>
      </div>
    );
  }

  getNetworks = async () => {
      let networks;

      try {
        networks = await axios.get('/wifi/scan');
        networks = networks.data.result;
      } catch (e) {
        networks = [{ssid: "No networks found"}];
      }
      this.setState({networks: networks});
      return networks;
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleConnect = async () => {

    let result = await axios.get('/wifi/connect/' + this.state.selectedNetwork + '/' + this.state.password);

    console.log(result);
  }
}

export default App;
