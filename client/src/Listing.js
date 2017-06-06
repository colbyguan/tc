import React, { Component } from 'react';

import './Listing.css';

class Listing extends Component {
  render() {
    const articles = this.props.articles;
    const articleRows = articles.map((article, idx) => (
      <tr key={idx}>
        <td className="rank">{idx+1}</td>
        <td><a className="article-link" href={article.href}>{article.title}</a>
          {article.excerpt && <p className="excerpt">{article.excerpt.substring(0, 100)}...</p>}
        </td>
      </tr>
    ))
    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {this.props.category}
          </p>
        </header>
        <div className="card-content">
          <table className="table is-striped">
            <tbody>
              {articleRows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Listing;
