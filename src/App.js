import React from "react";

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

const batchSize = 20;
const App = () => {
  const [data, setData] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const observer = React.useRef();
  const lastNumberRef = React.useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const arr = await getContent(offset, batchSize);
      setData((prev) => [...prev, ...arr]);
      setOffset((prev) => prev + batchSize);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to only run on mount

  React.useEffect(() => {
    const currentRef = lastNumberRef.current;
    if (currentRef) {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchData();
        }
      });
      observer.current.observe(currentRef);

      // Cleanup observer on unmount
      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }
  }, [loading]); // Re-run effect if loading state changes

  const loadingDOM = () => (loading ? <p>Loading...</p> : null);

  return (
    <div>
      <h2>Todos:</h2>
      <ol>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <div ref={lastNumberRef}>{loadingDOM()}</div>
    </div>
  );
};

export default App;
