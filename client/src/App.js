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
      lastModified: Date.now()
    }
    Client.getArticles((response) => {
      this.setState({
        articles: response.articles,
        lastModified: response.last_modified
      });
    });
  }
  toggleCategory(category) {
    this.setState({
      currCategory: category
    });
  }
  renderCategory(category, i) {
    return (
      <li key={i}><a className={category != this.state.currCategory ? 'inactive': ''} onClick={() => this.toggleCategory(category)}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </a></li>
    );
  }
  renderCategories() {
    return (
      <div className="flat-tabs">
        <ul>
          {allCategories.map(this.renderCategory.bind(this))}
        </ul>
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
        <section className="section">
          <div className="columns">
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
