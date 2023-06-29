import React from 'react';
import {
  TimeRangePicker,
} from '@grafana/ui'

interface GrafanaTimePickerProps {
  timerange: any, 
  onchange: (value: any) => {} 
}

class GrafanaTimePicker extends React.Component<GrafanaTimePickerProps> {
  state = {
    timerange: this.props.timerange
  }
  render() {
    const onchange = (value: any) => {
      this.setState({
        timerange: value
      })
      this.props.onchange(value)
    }
    return <TimeRangePicker 
              value={this.state.timerange} 
              onChange={onchange} 
              onChangeTimeZone={() => {}} 
              onMoveBackward={() => {}} 
              onMoveForward={() => {}} 
              onZoom={() => {}} 
            />
  }
}

export { GrafanaTimePicker }