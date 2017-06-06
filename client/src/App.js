import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import Listing from './Listing';

class App extends Component {
  render() {
    return (
      <div className="App">
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                tc
              </h1>
              <h2 className="subtitle">
                What's popular on Techcrunch, crunched
              </h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <Listing category="popular" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
