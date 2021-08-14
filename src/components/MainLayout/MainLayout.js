import React, { useEffect, useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { database, storage } from "../../services/firebase";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(5, 0, 0),
  },
  heroContainer: {
    paddingBottom: theme.spacing(3),
  },
  input: {
    display: "none",
  },
  heroButtons: {
    marginTop: theme.spacing(2),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "90%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  breadcrumbs: {
    marginTop: theme.spacing(2),
  },
}));

export default function MainLayout() {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [cards, setCards] = useState([]);
  const inputRef = useRef(null);
  const gifsList = [];

  function handleUpload(e) {
    const file = e.target.files[0];
    if (file == null) return;
    if (file.name.split(".")[1] === "gif") {
      const uploadGif = storage
        .ref(`/${currentUser.uid}/${file.name}`)
        .put(file);
      uploadGif.on(
        "state_changed",
        (snapchot) => {},
        () => {},
        () => {
          uploadGif.snapshot.ref.getDownloadURL().then((url) => {
            database.gifs.add({
              url: url,
              name: file.name,
              userId: currentUser.uid,
              createdAt: database.getCurrentTimestamp(),
              category: "actions",
            });
          });
        }
      );
    }
  }

  useEffect(() => {
    return database.gifs.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        gifsList.push(doc.data());
      });
      setCards(gifsList);
    });
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm" className={classes.heroContainer}>
            <Typography
              component="h2"
              variant="h4"
              align="center"
              color="textPrimary"
            >
              Gifs collection
            </Typography>
          </Container>
          <Grid container justify="center">
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={handleUpload}
            />
            {currentUser && (
              <label htmlFor="icon-button-file">
                <Fab
                  color="primary"
                  aria-label="add"
                  align="center"
                  component="span"
                >
                  <AddIcon />
                </Fab>
              </label>
            )}
          </Grid>
          <Grid container justify="center">
            <Breadcrumbs
              aria-label="breadcrumb"
              className={classes.breadcrumbs}
            >
              <Link color="textPrimary" href="/">
                All gifs
              </Link>
              <Link color="inherit" href="/category/animals" category="animals">
                Animals
              </Link>
              <Link color="inherit" href="/category/actions">
                Actions
              </Link>
              <Link color="inherit" href="/category/cartoons">
                Cartoons
              </Link>
            </Breadcrumbs>
          </Grid>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.length > 0 &&
              cards.map((card) => (
                <Grid item key={card.name} xs={3} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={card.url}
                      title={card.name}
                    />
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={navigator.clipboard.writeText(card.url)}
                      >
                        Share
                      </Button>
                      <input type="hidden" ref={inputRef} value={card.url} />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
