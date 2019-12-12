// @flow
import React, { useState, useMemo, useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import db from "./Database/Database";
import Header from "./Components/Header/Header";
import CardItem from "./Components/CardItem/Carditem";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/Button";
import SingleProduct from "./Components/SingleProduct/SingleProduct";
import DatabaseSync from "./Components/DatabaseSync/DatabaseSync";

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: "1620px",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    margin: "auto",
    padding: "20px 0",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-around"
    }
  }
}));

type ProductOriginal = {
  data: string,
  value: string,
  info: {
    MetaKeywords: string,
    Text: string,
    Image1Src: string
  }
};

export type Product = {
  SKU: string,
  name: string,
  keywords: string,
  image: string
};

const App = () => {
  const history = useHistory();
  const classes = useStyles();
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

  useEffect(() => {
    searchTheDatabase(query);
  }, []);

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
    history.push("/");
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
        setSearchResults(resultArray);
        setResultsLoaded(true);
        setIsLoading(false);
      });
  };

  const handleQuery = (e: SyntheticInputEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleEnterKey = (e: SyntheticInputEvent<HTMLInputElement>) => {
    if (e?.key === "Enter" && query.length > 0) {
      searchTheDatabase(query);
    }
  };

  return (
    <div>
      <Header handleQuery={handleQuery} handleEnterKey={handleEnterKey} />
      <div className={classes.container}>
        <Switch>
          <Route exact path={"/"}>
            {isLoading ? <CircularProgress /> : resultsLoaded && results}
          </Route>
          <Route exact path={"/database-sync"} component={DatabaseSync} />
          <Route path={"/product/sku-:sku"} component={SingleProduct} />
          <Redirect to={"/"} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
