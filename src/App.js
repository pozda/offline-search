// @flow
import React, { useState, useMemo } from "react";
// import { } from "react-router-dom";
import db from "./Database/Database";
import Header from "./Components/Header/Header";
import CardItem from "./Components/CardItem/Carditem";
import Paper from "@material-ui/core/Paper";

type ProductOriginal = {
  data: string,
  value: string,
  info: {
    MetaKeywords: string,
    Text: string,
    Image1Src: string
  }
};

type Product = {
  SKU: string,
  name: string,
  keywords: string,
  description: string,
  image: string
};

const App = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const results = useMemo(
    () =>
      searchResults.map((product: Product) => (
        <CardItem key={product.SKU} product={product} />
      )),
    [searchResults]
  );

  const normalizeProducts = (products: ProductOriginal[]) =>
    products.map((product: ProductOriginal) => ({
      SKU: product.data,
      name: product.value,
      keywords: product.info.MetaKeywords,
      description: product.info.Text,
      image: product.info.Image1Src
    }));

  const products = normalizeProducts(window.all_products);
  // I tried with fetch api, but run into CORS, finally I
  // referenced searchResultslink to the product list in index.html
  // which attached the content from file to the window object
  // also trimmed array of unneccessary properties

  const populateDatabase = (products: Product[]) => {
    db.transaction("rw", db.products, function() {
      for (let i = 0, len = products.length; i < len; ++i) {
        db.products.add(products[i]);
      }
    })
      .then(() => {
        db.lastDataSync.add({ date: Date.now() });
      })
      .catch(function(e) {
        console.log(e.stack || e);
      });
  };

  const searchTheDatabase = (query: string) => {
    setIsLoading(true);
    setResultsLoaded(false);
    let allResults = [];
    const fillResults = (result: Product[]) => {
      allResults.push(...result);
    };

    const search = (field: string) =>
      db.products
        .where(field)
        .startsWithIgnoreCase(query)
        .toArray(fillResults)
        .catch(console.log);

    Promise.all([
      search("SKU"),
      search("name"),
      search("description"),
      search("keywords")
    ])
      .then(() => {
        const removedDupes = new Set(allResults);
        const resultArray = [...removedDupes];
        return resultArray;
      })
      .then(resultArray => {
        console.log(resultArray);
        setSearchResults(resultArray);
        setResultsLoaded(true);
        setIsLoading(false);
      });
  };

  const handleQuery = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <Header handleQuery={handleQuery} />
      <Paper>{resultsLoaded && results}</Paper>

      <button onClick={() => populateDatabase(products)}>
        populateDatabase
      </button>

      <button onClick={() => console.log(searchResults)}>inspect SR</button>
      <button onClick={() => console.log(results)}>inspect vR</button>
      <button onClick={() => searchTheDatabase(query)}>inspect query</button>
    </div>
  );
};

export default App;
