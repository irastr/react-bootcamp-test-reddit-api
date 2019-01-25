import React from "react";

const Card = ({ index, item }) => {
  return (
    <React.Fragment>
      <img className="img" src={`${item.data.thumbnail}`} alt="" />
      <div className="descr-wrap">
        <p className="card-title">{item.data.title}</p>
        <p>Number of comments: {item.data.num_comments}</p>
        <a href={`${item.data.permalink}`}> Link </a>
      </div>
    </React.Fragment>
  );
};

export default Card;
