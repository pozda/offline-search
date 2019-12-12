// @flow
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles, theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import placeholderImage from "../../Res/logo192.png";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 250,
    height: 280,
    margin: "20px auto",
    border: "1px solid #efefef",
    "& a": {
      color: "gray",
      textDecoration: "none",
      "&>div": {
        height: 140
      }
    },
    [theme.breakpoints.up("xs")]: {
      minWidth: 225,
      maxWidth: 280
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: 215,
      maxWidth: 250,
      width: "33%"
    },
    [theme.breakpoints.up("lg")]: {
      minWidth: 250,
      maxWidth: 350,
      width: "16%"
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
  }
}));

type Product = {
  SKU: string,
  name: string,
  keywords: string,
  description: string,
  image: string
};

type Props = {
  product: Product
};

const MediaCard = (props: Props) => {
  const { product } = props;
  const classes = useStyles();
  const title = product.name.substr(0, 50);

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <Link to={`/product/SKU-${product.SKU}`}>
          <CardMedia
            className={classes.media}
            image={
              product.image
                ? `${process.env.REACT_APP_IMAGES_BASE_URL}${product.image}`
                : placeholderImage
            }
            title={product.name.substr(0, 50)}
          />
          <CardContent>
            <Typography className={classes.title}>{title}</Typography>
            <Typography className={classes.subtitle}>{product.SKU}</Typography>
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
};

export default MediaCard;
