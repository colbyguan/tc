import React, { Component } from 'react';

import './Listing.css';

class Listing extends Component {
  render() {
    const articles = this.props.articles;
    const articleRows = articles.map((article, idx) => (
      <tr className="article-row" key={idx}>
        <td className="rank">{idx+1}</td>
        <td><a className="article-link" href={article.href}>{article.title}</a>
        <p className="article-info">
          {article.tag && <span className="article-tag">{article.tag}</span>} posted <span className="article-time">{article.time}</span></p>
        </td>
      </tr>
    ))
    return (
      <div className="flat-card">
          <p className="flat-card-title">
            {this.props.category}
          </p>
          <table className="table">
            <tbody>
              {articleRows}
            </tbody>
          </table>
        </div>
    )
  }
}

export default Listing;
