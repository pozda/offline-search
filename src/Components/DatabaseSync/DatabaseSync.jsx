// @flow
import React, { useState, useEffect } from "react";
import Dexie from "dexie";
import db from "../../Database/Database";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: "1620px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    margin: "auto",
    padding: "20px 0",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-around"
    }
  },
  title: {
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: "bold",
    marginBottom: 32
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 1.25
  },
  description: {
    fontSize: 14,
    lineHeight: 1.25,
    "& ul": {
      margin: 0,
      padding: 0,
      listStyleType: "none"
    }
  }
}));

const SingleProduct = () => {
  const classes = useStyles();

  const normalizeProducts = (products: ProductOriginal[]) =>
    products.map((product: ProductOriginal) => ({
      SKU: product.data,
      name: product.value,
      keywords: product.info.MetaKeywords,
      description: product.info.Text,
      image: product.info.Image1Src
    }));

  const products = normalizeProducts(window.all_products);

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

  const clearTables = () => {
    db.products.clear();
    db.lastDataSync.clear();
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.title}>
        Here you can manually populate database!
      </Typography>
      <Button color={"primary"} onClick={() => populateDatabase(products)}>
        Populate database
      </Button>
      <Button color={"secondary"} onClick={() => clearTables()}>
        Clear the tables
      </Button>
    </div>
  );
};

export default SingleProduct;
