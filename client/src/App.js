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
      lru: ['popular'],
      maxCategories: 4,
      categories: {
        'popular': true,
        'startups': false,
        'mobile': false,
        'gadgets': false,
        'social': false,
        'enterprise': false
      },
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
  componentWillMount() {
    this.updateMaxCategories();
  }
  componentDidMount() {
    window.addEventListener('resize', this.updateMaxCategories.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateMaxCategories.bind(this));
  }
  updateMaxCategories() {
    var w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0],
        width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    let maxCategories = 4;
    if (width < 769) {
      maxCategories = 1;
    } else if (width < 1200) {
      maxCategories = 3;
    }
    let lru = this.state.lru;
    let categories = this.state.categories
    while (lru.length > maxCategories) {
      categories[lru[0]] = false;
      lru = lru.slice(1);
    }
    this.setState({
      lru,
      maxCategories
    });
  }
  toggleCategory(category) {
    const categories = this.state.categories;
    categories[category] = !categories[category];
    let lru = this.state.lru;
    if (categories[category]) {
      // Pop off the least recently used if queue is full
      if (lru.length === this.state.maxCategories) {
        let popped = lru[0];
        categories[popped] = false;
        lru = lru.slice(1);
      }
      lru = [ ...lru, category];
    } else {
      // If we are turning a category off, also remove it from the queue
      let idx = lru.indexOf(category);
      lru = lru.slice(0, idx).concat(lru.slice(idx + 1));
    }
    this.setState({
      lru,
      categories
    });
  }
  renderCategory(category, i) {
    return (
      <li key={i}><a className={!this.state.categories[category] ? 'inactive': ''} onClick={() => this.toggleCategory(category)}>
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
    const columns = [];
    let hitFirst = false;
    allCategories.forEach((category, i) => {
      const inactive = !this.state.categories[category];
      const articles = this.state.articles.filter((article) => {
        return article.category === category;
      });
      columns.push(
        <div key={category} className={"column " +
          (this.state.maxCategories !== 1 ? 'category-column ' : '') +
          (hitFirst ? 'left-border ' : '') +
          (inactive ? 'is-inactive': '')}>
          <Listing category={category} articles={articles} />
        </div>
      );
      if (!inactive) {
        hitFirst = true;
      }
    });
    return columns;
  }
  render() {
    return (
      <div className="App">
        <section className="section top">
          <div className="container">
            <h2 className="subtitle">tc: Techcrunch in a crunched UI</h2>
          </div>
        </section>
        <section className="section categories">
          <div className="container">
            {this.renderCategories()}
          </div>
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
