import React from 'react';

interface IProps {
  timeTraveling: boolean;
  goBack: () => void;
  goForward: () => void;
  resume: () => void;
}

export default class TimeTravelComponent extends React.Component<IProps> {

  private static forwardButton(timeTraveling: boolean, goForward: () => void) {
    if (!timeTraveling) { return; }
    return (
      <button
        onClick={goForward}
      >
        Forward
      </button>
    );
  }

  private static playButton(timeTraveling: boolean, resume: () => void) {
    if (!timeTraveling) { return; }
    return (
      <button
        onClick={resume}
      >
        Play
      </button>
    );
  }

  public render() {
    return (
      <div>
        <button
          onClick={this.props.goBack}
        >
          Back
        </button>
        {TimeTravelComponent.playButton(this.props.timeTraveling, this.props.resume)}
        {TimeTravelComponent.forwardButton(this.props.timeTraveling, this.props.goForward)}
      </div>
    );
  }
}
