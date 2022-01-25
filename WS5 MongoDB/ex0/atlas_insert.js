// Tuodaan moduuli ohjelmaan
const MongoClient = require("mongodb").MongoClient;

// Määritellään salasana ja yhteysosoite tietokantaan (tämän saa MongoDB Atlas-palvelusta)
const passwd = "demopass";
const uri =
  "mongodb+srv://dbuser:" +
  passwd +
  "@cluster0-6tein.mongodb.net/test?retryWrites=true&w=majority";

// Luodaan uusi yhteysolio käyttäen edellä määriteltyä URI:a sekä
// tarvittavia parametreja
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Määritellään tietokantaan tehtävä kyselu JSON-oliona. Tässä voi käyttää
// apuna esim. MondoDB Compass -työkalua
var query = {
  title: new RegExp("Mikan uusi")
};

// Uuden lisättävän tieoalkion kuvaus
var newMovie = {
  title: "Mikan uusi elokuva",
  year: "2020",
  imdbID: "12345678",
  type: "movie",
  poster:
    "https://m.media-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_SX300.jpg"
};

// Luodaan yhteys  tietokantaan nimeltä "sample_mflix" ja sieltä kokoelmaan "movies"
client.connect(err => {
  const collection = client.db("sample_mflix").collection("movies");
  if (err) throw err;

  // Suoritetaan lisäys collection-olion avulla
  collection.insertOne(newMovie, function(err, r) {
    // Tulostetaan konsoliin tieto montako alkiota on lisätty (1)
    console.log(r.insertedCount);
  });

  // Tehdään perään vielä tietokantahaku, jotta nähdään lisäyksen menneen perille
  // Huomaa, että tietokantahaun ehdoksi on vaihdettu uuden lisätyn leffan nimi
  collection
    .find(query) // query muuttuja sisältää kyselyn
    .limit(5) // rajoitetaan tulosjoukko 5:een
    .toArray(function(err, result) {
      // Palautetaan tulokset JS-taulukkona
      if (err) throw err;
      console.log(result); // Tulostetaan taulukko ruudulle
      client.close(); // Suljetaan yhteys
    });
});
