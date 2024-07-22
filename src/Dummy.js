// src/InfiniteScrollComponent.js
import React, { useState, useEffect, useRef, useCallback } from "react";
function getContent(offset, batchSize = 20) {
  let arr = [];
  for (var i = offset; i < offset + batchSize; i++) {
    arr.push(i);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr);
    }, Math.random() * 2000);
  });
}

const InfiniteScrollComponent = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const fetchMoreData = async () => {
    if (hasMore) {
      // Replace this URL with your actual API endpoint
      const response = await fetch(`https://api.example.com/data?page=${page}`);
      const data = await response.json();
      setItems((prevItems) => [...prevItems, ...data]);
      setPage((prevPage) => prevPage + 1);
      if (data.length === 0) {
        setHasMore(false);
      }
    }
  };

  const lastItemRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    fetchMoreData();
  }, []);

  return (
    <div>
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return (
            <div ref={lastItemRef} key={item.id}>
              {item.name}
            </div>
          );
        } else {
          return <div key={item.id}>{item.name}</div>;
        }
      })}
      {hasMore && <div>Loading...</div>}
    </div>
  );
};

export default InfiniteScrollComponent;
