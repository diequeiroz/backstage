import React from 'react';
import {
  ThemeContext,
} from '@grafana/ui'
import { createTheme, GrafanaTheme2 } from '@grafana/data';

import { Grid, GridSize } from '@material-ui/core';
import { GrafanaIframe, Message } from './GrafanaIframe';
import { GrafanaTimePicker } from './GrafanaTimePicker';

interface GrafanaDashboardProps {
  grafanaUrl: string,
  charts: GrafanaChart[]
  defaultTime: {
    from: Date,
    to: Date,
    raw: { 
      from: string, 
      to: string 
    }
  }
}

interface GrafanaDashboardState {
  message?: Message
}

interface GrafanaChart {
  dashboardId: string,
  orgId: string,
  panelId: string,
  size: GridSize,
  vars?: {
    [key: string]: string
  }
}

class GrafanaDashboard extends React.Component<GrafanaDashboardProps, GrafanaDashboardState> {

  theme: GrafanaTheme2;

  constructor(props: GrafanaDashboardProps) {
    super(props);
    this.theme = createTheme({ colors: { mode: 'light' } })
  }

  state = {
    message: undefined
  }

  render() {

    var charts: JSX.Element[] = []

    this.props.charts.forEach(chart => {
      var url = new URL(this.props.grafanaUrl + "/d-solo/" + chart.dashboardId + "/new-dashboard")
      url.searchParams.set("orgId", chart.orgId)
      if(chart.vars){
        Object.entries(chart.vars).forEach(([key, value]) => {
          url.searchParams.set("var-" + key, value)
        });
      }
      url.searchParams.set("panelId", chart.panelId)
      url.searchParams.set("theme", "light")
      url.searchParams.set("from", this.props.defaultTime.raw.from)
      url.searchParams.set("to", this.props.defaultTime.raw.to)

      var src = url.toString()

      charts.push(
        <Grid item xs={chart.size}>
          <GrafanaIframe src={src} message={this.state.message} />
        </Grid>
      )

    });

    onchange = (value: any) => {
      this.setState({
        message: {
          timerange: {
            from: value.from.toDate(),
            to: value.to.toDate(),
          }
        }
      })
    }

    return (
      <Grid container>
        <Grid container  direction="row" justifyContent="flex-end">
          <Grid item>
            <ThemeContext.Provider value={this.theme}>
              <GrafanaTimePicker onchange={onchange} timerange={this.props.defaultTime} />
            </ThemeContext.Provider>
          </Grid>
        </Grid>
        {charts}
      </Grid>
    )
  }
}

export { GrafanaDashboard };
export type { GrafanaChart };
