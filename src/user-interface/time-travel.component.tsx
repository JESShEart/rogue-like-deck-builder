import React from 'react';
import IHistory from '../engine/battle/IHistory';

interface IProps {
  history: IHistory;
  timeTravel: () => void;
  goBack: () => void;
  goForward: () => void;
  resume: () => void;
}

export default class TimeTravelComponent extends React.Component<IProps> {

  private static timeTravelButton({timeTraveling}: IHistory, timeTravel: () => void) {
    if (timeTraveling) { return; }
    return (
      <button
        onClick={timeTravel}
      >
        Time Travel
      </button>
    );
  }

  private static backButton({timeTraveling, index}: IHistory, goBack: () => void) {
    if (!timeTraveling) { return; }
    return (
      <button
        onClick={goBack}
        disabled={index === 0}
      >
        Back
      </button>
    );
  }

  private static forwardButton({index, timeline, timeTraveling}: IHistory, goForward: () => void) {
    if (!timeTraveling) { return; }
    return (
      <button
        onClick={goForward}
        disabled={index === timeline.length - 1}
      >
        Forward
      </button>
    );
  }

  private static playButton({timeTraveling}: IHistory, resume: () => void) {
    if (!timeTraveling) { return; }
    return (
      <button
        onClick={resume}
      >
        Resume
      </button>
    );
  }

  private static status({index, timeline, timeTraveling}: IHistory) {
    if (!timeTraveling) { return; }
    return (
      <span>
        &nbsp;Timeline {index + 1} / {timeline.length}
      </span>
    );
  }

  public render() {
    return (
      <div>
        {TimeTravelComponent.timeTravelButton(this.props.history, this.props.timeTravel)}
        {TimeTravelComponent.backButton(this.props.history, this.props.goBack)}
        {TimeTravelComponent.playButton(this.props.history, this.props.resume)}
        {TimeTravelComponent.forwardButton(this.props.history, this.props.goForward)}
        {TimeTravelComponent.status(this.props.history)}
      </div>
    );
  }
}
