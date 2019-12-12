// @flow
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import db from "../../Database/Database";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import parse from "html-react-parser";
import placeholderImage from "../../Res/logo192.png";
import type { Product } from "../../App";

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: "1620px",
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    margin: "auto",
    padding: "20px 0",
    justifyContent: "space-between",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-around"
    }
  },
  title: {
    fontSize: 18,
    lineHeight: 1.25,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 1.25
  },
  description: {
    fontSize: 14,
    lineHeight: 1.25
  },
  textContainer: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "50%"
    }
  }
}));

const SingleProduct = () => {
  let { sku } = useParams();
  const classes = useStyles();
  const [product, setProduct] = useState([]);

  const loadProductData = (sku: string) => {
    db.products
      .where("SKU")
      .equals(sku)
      .toArray((response: Product[]) => {
        setProduct(response[0]);
      });
  };

  useEffect(() => {
    loadProductData(sku);
  }, []);

  return (
    <div className={classes.container}>
      <div>
        <img
          src={
            product.image
              ? `${process.env.REACT_APP_IMAGES_BASE_URL}${product.image}`
              : placeholderImage
          }
          alt={product.title}
        />
      </div>

      <div className={classes.textContainer}>
        <Typography className={classes.title}>{product.name}</Typography>
        <Typography className={classes.subtitle}>{product.SKU}</Typography>
        <Typography className={classes.title}>{product.keywords}</Typography>
        <Typography className={classes.description}>
          {product?.description ? parse(product.description) : ""}
        </Typography>
      </div>
    </div>
  );
};

export default SingleProduct;
