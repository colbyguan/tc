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
      categories: {
        'popular': true,
        'startups': false,
        'mobile': false,
        'gadgets': false,
        'social': false,
        'enterprise': false
      },
      articles: []
    }
    Client.getArticles((response) => {
      this.setState({
        articles: response.result
      });
    });
  }
  toggleCategory(category) {
    const categories = this.state.categories;
    categories[category] = !categories[category];
    this.setState({
      categories
    });
  }
  renderCategories() {
    return allCategories.map((category, i) => {
      return (
        <p key={i} className="control">
          <a className={"button " + (this.state.categories[category] ? '': 'is-dark')}
             onClick={() => this.toggleCategory(category)}>
            <span className="category">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          </a>
        </p>
      );
    });
  }
  renderListings() {
    const columns = [];
    allCategories.forEach((category, i) => {
      const inactive = !this.state.categories[category];
      const articles = this.state.articles.filter((article) => {
        return article.category === category;
      });
      columns.push(
        <div key={category} className={"column category-column " + (inactive ? 'is-inactive': '')}>
          <Listing  category={category} articles={articles} />
        </div>
      );
    });
    return columns;
  }
  render() {
    return (
      <div className="App">
        <section className="hero is-success is-bold">
          <br />
          <div className="hero-foot">
            <div className="container">
              <label className="label categories-label">Click to toggle categories:</label>
              <div className="field has-addons">
                {this.renderCategories()}
              </div>
            </div>
          </div>
          <br />
        </section>
        <section className="section">
          <div className="container">
            <div className="columns">
              {this.renderListings()}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
