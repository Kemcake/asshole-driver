var React = require('react');
var _ = require('lodash');
var moment = require('moment');

var Home = React.createClass({
  
  getInitialState: function() {
    return {
      asshole:false,
      directions: undefined,//{legs:[{distance:{text:"124 km"}, duration:{text:"1 hour 14 mins", value:5096}}]},
      searching: false
    }
  },
  
  componentDidMount: function() {
    var toInput = this.refs.toInput.getDOMNode();
    var toAutocomplete = new google.maps.places.Autocomplete(toInput, {});  
    var fromInput = this.refs.fromInput.getDOMNode();
    var fromAutocomplete = new google.maps.places.Autocomplete(fromInput, {});  

  },
  
  onSearch: function() {
    var to = this.refs.toInput.getDOMNode().value;
    var from = this.refs.fromInput.getDOMNode().value;
    
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin:from,
      destination:to,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK && result.routes.length > 0) {
        console.log(result);
        var speed = this.refs.speedInput.getDOMNode().value;
        console.log("speed "+speed);
        this.setState({asshole:speed >= 135, directions:result.routes[0]})
      }
    }.bind(this));
    //search maps directions  
  },
  
  secondsToString: function(sec) {
      var sec_num = parseInt(sec, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var time = "";
      if (hours   >= 1) { time += hours+' hours and ';}
      time += minutes+' minutes' 
      return time;
  },
  
  /* 🚗🐰🐇😎👏 */
  render: function() {    
    return (
      <div className="home">
        <h1 className={this.state.asshole? "title asshole":"title"}>{this.state.asshole? "Asshole!":"Has Lose"}</h1>
        <h3 className="emojis">🚗🐇😎</h3>
        <p className="subtitle">
          Find your directions and see how much time you can win if you <strong>drive faster</strong>! <br/>
        </p>
        {this.getSearchNode()}
        {this.getResultNode()}
      </div>
    );
  },
  
  getSearchNode: function() {
    return (
        <div className="search">
          <label className="from">From</label>
          <input className="from" ref="fromInput" type="text" placeholder="1 Hacker Way, Menlo Park, CA" /> 
          <label className="to">To</label>
          <input className="to" ref="toInput" type="text" placeholder="Destination" />
          <br/>
          <label className="speed">{"Max Speed (km/h)"}</label>
          <input className="speed" ref="speedInput" type="number" defaultValue={200} step="1" />
          
          <button className="launch" onClick={this.onSearch}>Calculate</button>
        </div>
    );
  },
  
  getResultNode: function() {
    if (this.state.directions === undefined || this.state.directions.legs.length < 0) { return null }
    var leg = this.state.directions.legs[0];
    var time = this.secondsToString(leg.duration.value*(this.state.asshole? 10:1));
    var distance = leg.distance.text;
    var to = leg.end_address;
    var from = leg.start_address;
    var overlay;
    
    if (this.state.asshole) {
      overlay = <div className="overlay">Go f**k yourself. <br/> Please.</div>;
    }
    return (
        <div className="directions">
          <img className="down" src="images/arrow_down.png"/>
          <div className="result">
            <span className="time">
              {time}
            </span>
            <span className="distance">
              {"for "+distance}
            </span>
            {overlay}
            {this.getDescriptionNode(time, from, to)}
          </div>
          <a className="open" href={"#"} target="_blank"><img src="images/arrow.png" /></a>
        </div>
    );
  },
  
  getDescriptionNode: function(time, from, to) {
    
    if (this.state.asshole) {
      return (
        <div className="description">
          {"It takes approximately"} <strong>{time}</strong> to go from <strong>{from}</strong> to <strong>{to}</strong>{" if you drive really fast."}
          <br/> 
          {"Yes. Because you'll crash in a f**cking tree 🚑🚨. You will not die, but do not expect to walk again ♿️. You will have a penis-shaped scar on your head and children will laugh at you.  Asshole. 🔫"}
          <br/>
          <span className="emoji">✌️</span>
        </div>
      );
    }
    return (
      <div className="description">
        {"It takes approximately"} <strong>{time}</strong> to go from <strong>{from}</strong> to <strong>{to}</strong>{" if you don't drive too fast. You're awesome!"}
        <br/>
        <span className="emoji">👍</span>
      </div>
    );
  }
});

module.exports = Home;
