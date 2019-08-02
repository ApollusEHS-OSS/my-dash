import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Seafile from "./components/Seafile.js";
import Plex from "./components/Plex.js";
import Unifi from "./components/Unifi.js";
import Netdata from "./components/Netdata.js";
import UptimeRobot from "./components/UptimeRobot.js";

class App extends React.Component {
  state = {
    seafile: null,
    plex: null,
    unifi: null,
    netdataDo: null,
    netdataHome: null,
    uptimeRobot: null
  };

  fetch() {
    const endpoints = [
      "//localhost:4000/seafile",
      "//localhost:4000/plex",
      "//localhost:4000/unifi",
      "//localhost:4000/netdata-do",
      "//localhost:4000/netdata-home",
      "//localhost:4000/uptime-robot"
    ];

    axios.all(endpoints.map(endpoint => axios.get(endpoint))).then(
      axios.spread(
        (seafile, plex, unifi, netdataDo, netdataHome, uptimeRobot) => {
          this.setState({
            seafile: seafile.data,
            plex: plex.data,
            unifi: unifi.data,
            netdataDo: netdataDo.data,
            netdataHome: netdataHome.data,
            uptimeRobot: uptimeRobot.data
          });
        }
      )
    );
  }

  componentDidMount() {
    this.fetch();

    if (process.env.NODE_ENV !== "development") {
      setInterval(() => {
        this.fetch();
      }, 5000);
    }
  }

  render() {
    const {
      seafile,
      plex,
      unifi,
      netdataDo,
      netdataHome,
      uptimeRobot
    } = this.state;
    return (
      <div className="container text-gray-800 flex flex-col lg:flex-row max-w-7xl mx-auto text-sm xl:text-base pt-8">
        <UptimeRobot uptimeRobot={uptimeRobot} />
        <Unifi unifi={unifi} />
        <Netdata netdataDo={netdataDo} netdataHome={netdataHome} />
        <Seafile seafile={seafile} />
        <Plex plex={plex} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
