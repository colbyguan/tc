import React, { Component } from 'react';

import './Listing.css';

class Listing extends Component {
  render() {
    const articles = this.props.articles;
    const articleRows = articles.map((article, idx) => (
      <tr className="article-row" key={idx}>
        <td className="rank">{idx+1}</td>
        <td className="article-block">
          <p className="article-info">
            {article.tag && <span className="article-tag">{article.tag}</span>} &mdash; <span className="article-time">{article.time}</span>
          </p>
          <div className="article-link">
            <a href={article.href}>{article.title}</a>
          </div>
          <p className="article-excerpt">
            {article.excerpt.substring(0, 300) + '..'}
          </p>
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
