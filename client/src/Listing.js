import React, { Component } from 'react';
import Client from './Client';
import './Listing.css';

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    }
    Client.getArticles((response) => {
      this.setState({
        articles: response.result
      });
    });
  }
  render() {
    const articles = this.state.articles;
    const articleRows = articles.map((article, idx) => (
      <tr key={idx}>
        <td className="rank">{idx+1}</td>
        <td>{article.title}
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
