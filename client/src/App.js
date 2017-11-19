import React, { Component } from 'react';
import 'bulma/css/bulma.css'
import './App.css';
import Listing from './Listing';
import Client from './Client';

const allCategories = ['popular', 'startups', 'mobile', 'gadgets', 'social', 'enterprise'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* LRU queue to keep a maximum number of columns active at a time so
         text doesn't get too squished */
      currCategory: 'popular',
      articles: [],
      lastModified: Date.now(),
      useSidebar: true,
      showMoreIndicator: false,
    }
    Client.getArticles((response) => {
      this.setState({
        articles: response.articles,
        lastModified: response.last_modified
      });
    });
  }
  componentWillMount() {
    this.updateBar();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateBar.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateBar.bind(this));
  }
  updateBar() {
    console.log('firing')
    var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    if (width < 625) {
      this.setState({
        showMoreIndicator: true
      })
    } else {
      this.setState({
        showMoreIndicator: false
      })
    }
    if (width < 890) {
      this.setState({
        useSidebar: false
      });
    } else {
      this.setState({
        useSidebar: true
      });
    }
  }
  toggleCategory(category) {
    this.setState({
      currCategory: category
    });
  }
  renderCategory(category, i) {
    return (
      <li key={i}><a className={category !== this.state.currCategory ? 'inactive': ''} onClick={() => this.toggleCategory(category)}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </a></li>
    );
  }
  renderCategories() {
    console.log(this.state.showMoreIndicator);
    return (
      <div id="flat-tabs" className="flat-tabs">
        <ul>
          {allCategories.map(this.renderCategory.bind(this))}
        </ul>
        {this.state.showMoreIndicator && <div className="more-indicator">
        </div> }
      </div>
    );
  }
  renderListings() {
      const articles = this.state.articles.filter((article) => {
        return article.category === this.state.currCategory;
      });
      return (
          <Listing category={this.state.currCategory} articles={articles} />
      );
  }
  render() {
    return (
      <div className="App">
        <section className={"section topbar-container " + (!this.state.useSidebar ? 'show': 'hidden')}>
          <div className="topbar">
            <h2>tc</h2>
            <h3>TechCrunch in a crunched UI</h3>
            {this.renderCategories()}
          </div>
        </section>
        <section className="section">
          <div className={"columns " + (this.state.useSidebar ? 'show': 'hidden')}>
            <div className="column is-2 sidebar-column">
              <div className="sidebar">
                <h2>tc</h2>
                <h3>TechCrunch in a crunched UI</h3>
                {this.renderCategories()}
              </div>
            </div>
            <div className="column">
              <div className="listings">
                <div className="box listings-box">
                  {this.renderListings()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
