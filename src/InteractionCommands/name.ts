/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class NameInteraction extends InteractionCommand {
  name = "name";
  description = "Generiere deinen eigenen Charakternamen.";
  options: ApplicationCommandOptionData[] = [
    {
      required: true,
      name: "sprache",
      type: "STRING",
      choices: [
        { name: "Deutsch", value: "de" },
        { name: "Englisch", value: "en" },
        { name: "Winterwald", value: "ww" },
      ],
      description: "Welche Sprache soll dein Name erhalten?",
    },
    {
      required: true,
      name: "geschlecht",
      type: "STRING",
      choices: [
        { name: "Männlich", value: "m" },
        { name: "Weiblich", value: "w" },
      ],
      description: "Welches Geschlecht soll dein Name erhalten?",
    },
  ];

  execute(interaction: CommandInteraction, options: CommandInteractionOption[]) {
    const Sprache = findOption(options, "Sprache")?.value?.toString();
    const Geschlecht = findOption(options, "Geschlecht")?.value?.toString();

    if (!Sprache || !Geschlecht) return this.error(interaction, InteractionCommandErrors.INTERNAL_ERROR);

    if (!/de|en|ww/.test(Sprache) || !/m|w/.test(Geschlecht)) return this.error(interaction, InteractionCommandErrors.INVALID_OPTIONS);

    const vornamen = Geschlecht === "w" ? (namen as any)[Sprache].weiblich : (namen as any)[Sprache].männlich;
    const beinamen: string = (namen as any)[Sprache].beinamen;

    interaction.reply(
      `Dein zufällig generierter Name lautet: **${vornamen[Math.floor(Math.random() * vornamen.length)]} ${
        beinamen[Math.floor(Math.random() * beinamen.length)]
      }**`,
    );
  }
}

const namen: {} = {
  de: {
    männlich: [
      "Achim",
      "Adam",
      "Albert",
      "Albrecht",
      "Alexander",
      "Alfons",
      "Alfred",
      "Ali",
      "Alois",
      "Alwin",
      "Andre",
      "Andreas",
      "Anton",
      "Antonio",
      "Armin",
      "Arno",
      "Arnold",
      "Arthur",
      "Artur",
      "August",
      "Axel",
      "Benjamin",
      "Benno",
      "Bernd",
      "Bernhard",
      "Berthold",
      "Björn",
      "Bodo",
      "Boris",
      "Bruno",
      "Burkhard",
      "Carsten",
      "Christian",
      "Christof",
      "Christoph",
      "Claus",
      "Clemens",
      "Daniel",
      "David",
      "Dennis",
      "Detlef",
      "Detlev",
      "Dieter",
      "Dietmar",
      "Dietrich",
      "Dirk",
      "Dominik",
      "Eberhard",
      "Eckhard",
      "Edgar",
      "Edmund",
      "Eduard",
      "Edwin",
      "Egon",
      "Elmar",
      "Emil",
      "Engelbert",
      "Enrico",
      "Erhard",
      "Erich",
      "Erik",
      "Ernst",
      "Erwin",
      "Eugen",
      "Ewald",
      "Felix",
      "Ferdinand",
      "Florian",
      "Frank",
      "Franz",
      "Franz-Josef",
      "Fred",
      "Friedhelm",
      "Friedrich",
      "Fritz",
      "Georg",
      "Gerald",
      "Gerd",
      "Gerhard",
      "Gernot",
      "Gerold",
      "Gert",
      "Gottfried",
      "Gregor",
      "Guido",
      "Gunter",
      "Günter",
      "Günther",
      "Gustav",
      "Hans",
      "Hans-Dieter",
      "Hans-Georg",
      "Hans-Günter",
      "Hans-Joachim",
      "Hans-Jörg",
      "Hans-Josef",
      "Hans-Jürgen",
      "Hans-Peter",
      "Hans-Ulrich",
      "Hans-Werner",
      "Harald",
      "Harry",
      "Hartmut",
      "Hartwig",
      "Heiko",
      "Heiner",
      "Heino",
      "Heinrich",
      "Heinz",
      "Heinz-Jürgen",
      "Helge",
      "Helmut",
      "Helmuth",
      "Hendrik",
      "Henning",
      "Henry",
      "Herbert",
      "Heribert",
      "Hermann",
      "Hilmar",
      "Holger",
      "Horst",
      "Hubert",
      "Hugo",
      "Ingo",
      "Ivan",
      "Jakob",
      "Jan",
      "Jens",
      "Joachim",
      "Jochen",
      "Johann",
      "Johannes",
      "Jörg",
      "Jörn",
      "Josef",
      "Julius",
      "Jürgen",
      "Karl",
      "Karlheinz",
      "Karl-Heinz",
      "Karsten",
      "Klaus",
      "Klaus-Dieter",
      "Klaus-Peter",
      "Klemens",
      "Knut",
      "Konrad",
      "Kurt",
      "Lars",
      "Leo",
      "Leonhard",
      "Lorenz",
      "Lothar",
      "Ludger",
      "Ludwig",
      "Lutz",
      "Maik",
      "Manfred",
      "Manuel",
      "Marcel",
      "Marco",
      "Marco",
      "Marcus",
      "Mario",
      "Marko",
      "Markus",
      "Markus",
      "Martin",
      "Mathias",
      "Matthias",
      "Max",
      "Maximilian",
      "Mehmet",
      "Michael",
      "Mike",
      "Mirko",
      "Mustafa",
      "Nikolaus",
      "Nils",
      "Norbert",
      "Olaf",
      "Oliver",
      "Oskar",
      "Oswald",
      "Otmar",
      "Otto",
      "Patrick",
      "Paul",
      "Peter",
      "Philipp",
      "Raimund",
      "Rainer",
      "Ralf",
      "Ralph",
      "Reiner",
      "Reinhard",
      "Reinhold",
      "Rene",
      "Richard",
      "Robert",
      "Roger",
      "Roland",
      "Rolf",
      "Roman",
      "Ronald",
      "Ronny",
      "Rudi",
      "Rüdiger",
      "Rudolf",
      "Sebastian",
      "Sergej",
      "Siegbert",
      "Siegfried",
      "Siegmund",
      "Simon",
      "Stefan",
      "Steffen",
      "Stephan",
      "Sven",
      "Theo",
      "Theodor",
      "Thomas",
      "Thorsten",
      "Timo",
      "Timo",
      "Tobias",
      "Toni",
      "Torsten",
      "Udo",
      "Ulf",
      "Ulrich",
      "Uwe",
      "Viktor",
      "Vladimir",
      "Volker",
      "Volkmar",
      "Waldemar",
      "Walter",
      "Werner",
      "Wilfried",
      "Wilhelm",
      "Willi",
      "Willibald",
      "Willy",
      "Winfried",
      "Wladimir",
      "Wolfgang",
      "Wolfram",
      "Xaver",
    ],
    weiblich: [
      "Adelheid",
      "Agnes",
      "Alexandra",
      "Alice",
      "Andrea",
      "Anette",
      "Angela",
      "Angelika",
      "Anita",
      "Anja",
      "Anke",
      "Anna",
      "Anne",
      "Annegret",
      "Anneliese",
      "Annemarie",
      "Annett",
      "Annette",
      "Anni",
      "Antje",
      "Astrid",
      "Barbara",
      "Bärbel",
      "Beate",
      "Beatrix",
      "Berta",
      "Bettina",
      "Bianca",
      "Birgit",
      "Brigitta",
      "Brigitte",
      "Britta",
      "Brunhilde",
      "Carmen",
      "Carola",
      "Charlotte",
      "Christa",
      "Christel",
      "Christiane",
      "Christina",
      "Christine",
      "Claudia",
      "Corinna",
      "Cornelia",
      "Dagmar",
      "Daniela",
      "Diana",
      "Dora",
      "Doreen",
      "Doris",
      "Dorothea",
      "Dorothee",
      "Edelgard",
      "Edeltraud",
      "Edith",
      "Elena",
      "Eleonore",
      "Elfriede",
      "Elisabeth",
      "Elke",
      "Ella",
      "Ellen",
      "Elli",
      "Elsa",
      "Elsbeth",
      "Else",
      "Elvira",
      "Emilie",
      "Emma",
      "Emmi",
      "Erika",
      "Erna",
      "Esther",
      "Eva",
      "Eva-Maria",
      "Eveline",
      "Evelyn",
      "Franziska",
      "Frauke",
      "Frieda",
      "Friederike",
      "Gabi",
      "Gabriela",
      "Gabriele",
      "Gaby",
      "Gerda",
      "Gerlinde",
      "Gertraud",
      "Gertrud",
      "Gisela",
      "Grete",
      "Gudrun",
      "Hanna",
      "Hannelore",
      "Hedwig",
      "Heidemarie",
      "Heidemarie",
      "Heidi",
      "Heidrun",
      "Heike",
      "Helena",
      "Helene",
      "Helga",
      "Hella",
      "Helma",
      "Hermine",
      "Herta",
      "Hildegard",
      "Hildegard",
      "Ida",
      "Ilka",
      "Ilona",
      "Ilse",
      "Ina",
      "Ines",
      "Inge",
      "Ingeborg",
      "Ingeburg",
      "Ingrid",
      "Irene",
      "Irina",
      "Iris",
      "Irma",
      "Irmgard",
      "Isolde",
      "Jana",
      "Jasmin",
      "Jennifer",
      "Jessica",
      "Johanna",
      "Josefine",
      "Judith",
      "Julia",
      "Juliane",
      "Jutta",
      "Karin",
      "Karla",
      "Karola",
      "Katharina",
      "Käthe",
      "Kathrin",
      "Katja",
      "Katrin",
      "Kerstin",
      "Kirsten",
      "Klara",
      "Kornelia",
      "Kristina",
      "Liane",
      "Lieselotte",
      "Lina",
      "Linda",
      "Lisa",
      "Liselotte",
      "Lore",
      "Lotte",
      "Luise",
      "Lydia",
      "Magdalena",
      "Magdalene",
      "Mandy",
      "Manuela",
      "Maren",
      "Marga",
      "Margarete",
      "Margarethe",
      "Margit",
      "Margitta",
      "Margot",
      "Margret",
      "Margrit",
      "Maria",
      "Marianne",
      "Marie",
      "Marie-Luise",
      "Marina",
      "Marion",
      "Marita",
      "Marlene",
      "Marlies",
      "Marlis",
      "Marta",
      "Martha",
      "Martina",
      "Mathilde",
      "Mechthild",
      "Meike",
      "Melanie",
      "Michaela",
      "Miriam",
      "Monika",
      "Nadine",
      "Nadja",
      "Natalie",
      "Nicole",
      "Nina",
      "Olga",
      "Patricia",
      "Paula",
      "Petra",
      "Pia",
      "Ramona",
      "Regina",
      "Regine",
      "Renate",
      "Rita",
      "Rosa",
      "Rosemarie",
      "Roswitha",
      "Ruth",
      "Sabine",
      "Sabrina",
      "Sandra",
      "Sarah",
      "Sibylle",
      "Sieglinde",
      "Sigrid",
      "Silke",
      "Silvia",
      "Simone",
      "Sonja",
      "Sophie",
      "Stefanie",
      "Steffi",
      "Stephanie",
      "Susanne",
      "Sybille",
      "Sylvia",
      "Tanja",
      "Tatjana",
      "Thea",
      "Therese",
      "Theresia",
      "Tina",
      "Ulla",
      "Ulrike",
      "Ursel",
      "Ursula",
      "Uta",
      "Ute",
      "Valentina",
      "Vera",
      "Verena",
      "Veronika",
      "Viola",
      "Walburga",
      "Waltraud",
      "Waltraut",
      "Wilma",
      "Yvonne",
    ],
    beinamen: [
      "Ackermann",
      "Adam",
      "Albrecht",
      "Arndt",
      "Arnold",
      "Bach",
      "Bachmann",
      "Barth",
      "Bartsch",
      "Bauer",
      "Baumann",
      "Bayer",
      "Becker",
      "Becker",
      "Beckmann",
      "Behrens",
      "Bender",
      "Berger",
      "Berger",
      "Bermann",
      "Beyer",
      "Binder",
      "Bischoff",
      "Blum",
      "Bock",
      "Böhm",
      "Böhme",
      "Böttcher",
      "Brandt",
      "Brandt",
      "Braun",
      "Breuer",
      "Brinkmann",
      "Brunner",
      "Bruns",
      "Buchholz",
      "Busch",
      "Büttner",
      "Dietrich",
      "Dietz",
      "Döring",
      "Ebert",
      "Eckert",
      "Engel",
      "Engelhardt",
      "Fiedler",
      "Fink",
      "Fischer",
      "Förster",
      "Frank",
      "Franke",
      "Franz",
      "Frey",
      "Friedrich",
      "Fritz",
      "Fröhlich",
      "Fuchs",
      "Gärtner",
      "Geiger",
      "Gerlach",
      "Göbel",
      "Götz",
      "Graf",
      "Grimm",
      "Groß",
      "Gruber",
      "Günther",
      "Haas",
      "Haase",
      "Hahn",
      "Hansen",
      "Hartmann",
      "Heinrich",
      "Heinrich",
      "Heinz",
      "Heller",
      "Hermann",
      "Hermann",
      "Herzog",
      "Hesse",
      "Hildebrandt",
      "Hinz",
      "Hirsch",
      "Hoffmann",
      "Hofmann",
      "Hoppe",
      "Horn",
      "Huber",
      "Hübner",
      "Jäger",
      "Jahn",
      "Jakob",
      "Jansen",
      "Janssen",
      "John",
      "Jung",
      "Kaiser",
      "Kaufmann",
      "Kaya",
      "Keller",
      "Kern",
      "Kirchner",
      "Klein",
      "Koch",
      "Köhler",
      "König",
      "Kopp",
      "Körner",
      "Kowalski",
      "Kraft",
      "Krähmer",
      "Kramer",
      "Krause",
      "Krause",
      "Krebs",
      "Krebs",
      "Krüger",
      "Kruse",
      "Kuhn",
      "Kühn",
      "Kunz",
      "Kunze",
      "Lange",
      "Lange",
      "Langer",
      "Lehmann",
      "Lenz",
      "Lindner",
      "Löffler",
      "Lorenz",
      "Ludwig",
      "Lutz",
      "Maier",
      "Marquardt",
      "Martin",
      "Marx",
      "Maurer",
      "Maus",
      "Mayer",
      "Mayer",
      "Meier",
      "Meißner",
      "Menzel",
      "Meyer",
      "Michel",
      "Mohr",
      "Möller",
      "Moser",
      "Möser",
      "Müller",
      "Nagel",
      "Naumann",
      "Neumann",
      "Nguyen",
      "Nowak",
      "Otto",
      "Otto",
      "Paul",
      "Peters",
      "Peters",
      "Petersen",
      "Pfeifer",
      "Pfeiffer",
      "Pietsch",
      "Pohl",
      "Reichert",
      "Reimann",
      "Reinhardt",
      "Reuter",
      "Richter",
      "Riedel",
      "Rieger",
      "Ritter",
      "Rose",
      "Roth",
      "Rudolph",
      "Sander",
      "Sauer",
      "Schäfer",
      "Schenk",
      "Scherer",
      "Schiller",
      "Schilling",
      "Schindler",
      "Schlüter",
      "Schmidt",
      "Schmidt",
      "Schmitt",
      "Schmitz",
      "Schneider",
      "Scholz",
      "Schramm",
      "Schreiber",
      "Schröder",
      "Schröter",
      "Schubert",
      "Schuhmann",
      "Schulte",
      "Schultz",
      "Schulz",
      "Schulze",
      "Schumacher",
      "Schuster",
      "Schütz",
      "Schwab",
      "Schwarz",
      "Seidel",
      "Seifert",
      "Seitz",
      "Siebert",
      "Simon",
      "Sommer",
      "Stahl",
      "Stark",
      "Stein",
      "Steiner",
      "Stephan",
      "Sturm",
      "Thiel",
      "Thiele",
      "Thomas",
      "Ulrich",
      "Unger",
      "Urban",
      "Vogel",
      "Vogt",
      "Voigt",
      "Voß",
      "Wagner",
      "Walter",
      "Walther",
      "Weber",
      "Wegner",
      "Weiß",
      "Wendt",
      "Wenzel",
      "Werner",
      "Wilhelm",
      "Wilke",
      "Winkler",
      "Winter",
      "Wirth",
      "Witt",
      "Wolf",
      "Wolff",
      "Wolter",
      "Yilmaz",
      "Ziegler",
      "Zimmermann",
      "Zimmermann",
    ],
  },
  en: {
    männlich: [
      "Aaron",
      "Abel",
      "Abraham",
      "Adam",
      "Adrian",
      "Adriel",
      "Aidan",
      "Aiden",
      "Alan",
      "Alejandro",
      "Alexander",
      "Alexander",
      "Amir",
      "Andres",
      "Andrew",
      "Angel",
      "Anthony",
      "Antonio",
      "Asher",
      "Ashton",
      "August",
      "Austin",
      "Avery",
      "Axel",
      "Ayden",
      "Beau",
      "Beckett",
      "Benjamin",
      "Bennett",
      "Bentley",
      "Blake",
      "Bradley",
      "Brady",
      "Brandon",
      "Brantley",
      "Braxton",
      "Brayden",
      "Brian",
      "Brody",
      "Brooks",
      "Bryan",
      "Bryce",
      "Bryson",
      "Caden",
      "Caleb",
      "Calvin",
      "Camden",
      "Cameron",
      "Carlos",
      "Carson",
      "Carter",
      "Cayden",
      "Charles",
      "Charlie",
      "Chase",
      "Christian",
      "Christopher",
      "Cole",
      "Colin",
      "Colton",
      "Connor",
      "Cooper",
      "Corbin",
      "Damian",
      "Daniel",
      "David",
      "Dawson",
      "Dean",
      "Declan",
      "Derek",
      "Diego",
      "Dominic",
      "Dylan",
      "Easton",
      "Edward",
      "Elias",
      "Elijah",
      "Elijah",
      "Elliot",
      "Elliott",
      "Emiliano",
      "Emmanuel",
      "Emmett",
      "Eric",
      "Erick",
      "Ethan",
      "Evan",
      "Everett",
      "Ezekiel",
      "Ezra",
      "Felix",
      "Finn",
      "Gabriel",
      "Gael",
      "Gavin",
      "George",
      "Giovanni",
      "Graham",
      "Grant",
      "Grayson",
      "Greyson",
      "Griffin",
      "Gunner",
      "Harrison",
      "Hayden",
      "Henry",
      "Hudson",
      "Hunter",
      "Ian",
      "Iker",
      "Isaac",
      "Isaiah",
      "Isreal",
      "Ivan",
      "Jace",
      "Jackson",
      "Jackson",
      "Jacob",
      "Jaden",
      "Jake",
      "James",
      "Jameson",
      "Jase",
      "Jason",
      "Jasper",
      "Javier",
      "Jax",
      "Jaxon",
      "Jaxson",
      "Jayce",
      "Jayceon",
      "Jayden",
      "Jeremiah",
      "Jeremy",
      "Jesse",
      "Jesus",
      "Joel",
      "John",
      "Jonah",
      "Jonathan",
      "Jordan",
      "Jorge",
      "Joseph",
      "Joseph",
      "Joshua",
      "Josiah",
      "Juan",
      "Judah",
      "Jude",
      "Julian",
      "Justin",
      "Kaden",
      "Kaiden",
      "Kaiden",
      "Kaleb",
      "Karter",
      "Kayden",
      "Kenneth",
      "Kevin",
      "Kingston",
      "Kingston",
      "Knox",
      "Kyle",
      "Landon",
      "Leo",
      "Leonardo",
      "Levi",
      "Liam",
      "Lincoln",
      "Logan",
      "Lorenzo",
      "Lucas",
      "Lucas",
      "Luis",
      "Lukas",
      "Luke",
      "Maddox",
      "Malachi",
      "Marcus",
      "Mark",
      "Mason",
      "Mateo",
      "Matteo",
      "Matthew",
      "Maverick",
      "Maximus",
      "Maxwell",
      "Maxwell",
      "Messiah",
      "Micah",
      "Michael",
      "Miguel",
      "Miles",
      "Milo",
      "Myles",
      "Nathan",
      "Nathaniel",
      "Nicholas",
      "Nicolas",
      "Noah",
      "Nolan",
      "Oliver",
      "Omar",
      "Oscar",
      "Owen",
      "Parker",
      "Patrick",
      "Paul",
      "Paxton",
      "Peter",
      "Preston",
      "Rhett",
      "Richard",
      "Riley",
      "River",
      "Robert",
      "Roman",
      "Rowan",
      "Ryan",
      "Ryder",
      "Ryker",
      "Samuel",
      "Santiago",
      "Sawyer",
      "Sean",
      "Sebastian",
      "Silas",
      "Simon",
      "Steven",
      "Tanner",
      "Theodore",
      "Thomas",
      "Timothy",
      "Tobias",
      "Tristan",
      "Tucker",
      "Tyler",
      "Victor",
      "Vincent",
      "Waylon",
      "Wesley",
      "Weston",
      "William",
      "Wyatt",
      "Xander",
      "Xavier",
      "Zachary",
      "Zane",
      "Zayden",
      "Zion",
    ],
    weiblich: [
      "Aaliyah",
      "Abigail",
      "Adaline",
      "Adalyn",
      "Adalynn",
      "Addison",
      "Adeline",
      "Adelyn",
      "Adriana",
      "Alaina",
      "Alana",
      "Alayna",
      "Alexa",
      "Alexandra",
      "Alexandria",
      "Alexis",
      "Alice",
      "Alina",
      "Alivia",
      "Aliyah",
      "Allison",
      "Alyssa",
      "Amaya",
      "Amelia",
      "Amy",
      "Ana",
      "Anastasia",
      "Andrea",
      "Angela",
      "Angelina",
      "Anna",
      "Annabelle",
      "Arabella",
      "Aria",
      "Ariana",
      "Arianna",
      "Ariel",
      "Arya",
      "Ashley",
      "Athena",
      "Aubree",
      "Aubrey",
      "Audrey",
      "Aurora",
      "Autumn",
      "Ava",
      "Avery",
      "Bailey",
      "Bella",
      "Brianna",
      "Brielle",
      "Brooke",
      "Brooklyn",
      "Brooklynn",
      "Brynlee",
      "Callie",
      "Camila",
      "Camille",
      "Caroline",
      "Catherine",
      "Cecilia",
      "Charlie",
      "Charlotte",
      "Chloe",
      "Claire",
      "Clara",
      "Cora",
      "Daisy",
      "Dakota",
      "Daleyza",
      "Daniela",
      "Delilah",
      "Destiny",
      "Eden",
      "Eleanor",
      "Elena",
      "Eliana",
      "Elise",
      "Eliza",
      "Elizabeth",
      "Ella",
      "Elliana",
      "Ellie",
      "Eloise",
      "Emerson",
      "Emery",
      "Emilia",
      "Emily",
      "Emma",
      "Ether",
      "Eva",
      "Evangeline",
      "Evelyn",
      "Everly",
      "Faith",
      "Finley",
      "Fiona",
      "Gabriella",
      "Gabrielle",
      "Gemma",
      "Genesis",
      "Genevieve",
      "Georgia",
      "Gianna",
      "Giselle",
      "Grace",
      "Gracie",
      "Hadley",
      "Hailey",
      "Hannah",
      "Harley",
      "Harmony",
      "Harper",
      "Hayden",
      "Hazel",
      "Hope",
      "Iris",
      "Isabel",
      "Isabella",
      "Isabelle",
      "Isla",
      "Ivy",
      "Jade",
      "Jasmine",
      "Jayla",
      "Jessica",
      "Joanna",
      "Jocelyn",
      "Jordyn",
      "Josephine",
      "Josie",
      "Julia",
      "Juliana",
      "Julianna",
      "Juliette",
      "Juliette",
      "Kate",
      "Katherine",
      "Kayla",
      "Kaylee",
      "Kendall",
      "Kennedy",
      "Khloe",
      "Kimberly",
      "Kinsley",
      "Kylie",
      "Laila",
      "Lauren",
      "Layla",
      "Leah",
      "Leilani",
      "Leilani",
      "Lila",
      "Liliana",
      "Lillian",
      "Lilly",
      "Lily",
      "Lola",
      "London",
      "Londyn",
      "Lucia",
      "Lucy",
      "Luna",
      "Lydia",
      "Lyla",
      "Mackenzie",
      "Madeline",
      "Madelyn",
      "Madison",
      "Maggie",
      "Makayla",
      "Makenzie",
      "Margaret",
      "Maria",
      "Mariah",
      "Marley",
      "Mary",
      "Maya",
      "Mckenzie",
      "Melanie",
      "Melody",
      "Mia",
      "Michelle",
      "Mila",
      "Molly",
      "Morgan",
      "Mya",
      "Naomi",
      "Natalia",
      "Natalie",
      "Nevaeh",
      "Nicole",
      "Noelle",
      "Nora",
      "Norah",
      "Nova",
      "Olivia",
      "Paige",
      "Paisley",
      "Parker",
      "Payton",
      "Penelope",
      "Peyton",
      "Piper",
      "Presley",
      "Quinn",
      "Rachel",
      "Raelynn",
      "Reagan",
      "Rebecca",
      "Reese",
      "Riley",
      "Rose",
      "Rowan",
      "Ruby",
      "Rylee",
      "Ryleigh",
      "Sadie",
      "Samantha",
      "Sarah",
      "Sarah",
      "Savannah",
      "Sawyer",
      "Scarlett",
      "Serenity",
      "Sienna",
      "Skylar",
      "Sofia",
      "Sophia",
      "Sophie",
      "Stella",
      "Stephanie",
      "Summer",
      "Sydney",
      "Taylor",
      "Teagan",
      "Tessa",
      "Trinity",
      "Valentina",
      "Valeria",
      "Valerie",
      "Vanessa",
      "Victoria",
      "Violet",
      "Vivian",
      "Vivienne",
      "Willow",
      "Ximena",
      "Zoey",
      "Zoey",
    ],
    beinamen: [
      "Adams",
      "Alexander",
      "Allen",
      "Alvarez",
      "Anderson",
      "Andrews",
      "Armstrong",
      "Arnold",
      "Austin",
      "Bailey",
      "Baker",
      "Banks",
      "Barnes",
      "Bell",
      "Bennett",
      "Berry",
      "Bishop",
      "Black",
      "Bowman",
      "Boyd",
      "Bradley",
      "Brewer",
      "Brooks",
      "Brown",
      "Bryant",
      "Burke",
      "Burns",
      "Burton",
      "Butler",
      "Campbell",
      "Carlson",
      "Carpenter",
      "Carroll",
      "Carroll",
      "Carter",
      "Castillo",
      "Chapman",
      "Chavez",
      "Clark",
      "Coleman",
      "Coleman",
      "Collins",
      "Cook",
      "Cooper",
      "Cox",
      "Crawford",
      "Cruz",
      "Cunningham",
      "Daniels",
      "Davis",
      "Day",
      "Dean",
      "Diaz",
      "Dixon",
      "Duncan",
      "Dunn",
      "Edwards",
      "Elliott",
      "Ellis",
      "Evans",
      "Ferguson",
      "Fernandez",
      "Fields",
      "Fisher",
      "Flores",
      "Ford",
      "Foster",
      "Fowler",
      "Fox",
      "Franklin",
      "Frazier",
      "Freeman",
      "Fuller",
      "Garcia",
      "Gardner",
      "Garza",
      "George",
      "Gibson",
      "Gilbert",
      "Gomez",
      "Gonzales",
      "Gonzalez",
      "Gordon",
      "Graham",
      "Grant",
      "Gray",
      "Green",
      "Greene",
      "Griffin",
      "Gutierrez",
      "Hall",
      "Hamilton",
      "Hansen",
      "Hanson",
      "Harper",
      "Harris",
      "Harrison",
      "Hart",
      "Harvey",
      "Hawkins",
      "Hayes",
      "Henderson",
      "Henry",
      "Hernandez",
      "Hicks",
      "Hill",
      "Hoffman",
      "Holmes",
      "Howard",
      "Howell",
      "Hudson",
      "Hughes",
      "Hunter",
      "Hunter",
      "Jackson",
      "Jacobs",
      "James",
      "Jenkins",
      "Johnson",
      "Johnston",
      "Jones",
      "Jordan",
      "Kelley",
      "Kelly",
      "Kennedy",
      "Kim",
      "King",
      "Lane",
      "Larson",
      "Lawrence",
      "Lawson",
      "Lee",
      "Lewis",
      "Little",
      "Lknight",
      "Long",
      "Lopez",
      "Lynch",
      "Marshall",
      "Martin",
      "Martinez",
      "Mason",
      "Matthews",
      "Mccoy",
      "Mcdonald",
      "Medina",
      "Mendoza",
      "Meyer",
      "Miller",
      "Mills",
      "Mitchell",
      "Montgomery",
      "Moore",
      "Morales",
      "Moreno",
      "Morgan",
      "Morris",
      "Morrison",
      "Murphy",
      "Murray",
      "Myers",
      "Nelson",
      "Nguyen",
      "Nichols",
      "Oliver",
      "Olson",
      "Ortiz",
      "Owens",
      "Palmer",
      "Parker",
      "Patterson",
      "Payne",
      "Perez",
      "Perkins",
      "Perry",
      "Peterson",
      "Peterson",
      "Phillips",
      "Pierce",
      "Porter",
      "Powell",
      "Price",
      "Ramirez",
      "Ramos",
      "Reed",
      "Reid",
      "Reyes",
      "Reynolds",
      "Rice",
      "Richardson",
      "Richardson",
      "Riley",
      "Rivera",
      "Roberts",
      "Robertson",
      "Robinson",
      "Rodriguez",
      "Rogers",
      "Romero",
      "Rose",
      "Ross",
      "Ruiz",
      "Russel",
      "Ryan",
      "Sanchez",
      "Sanders",
      "Schmidt",
      "Scott",
      "Shaw",
      "Simmons",
      "Simpson",
      "Sims",
      "Smith",
      "Snyder",
      "Spencer",
      "Stanley",
      "Stephens",
      "Stevens",
      "Stewart",
      "Stone",
      "Sullivan",
      "Taylor",
      "Thomas",
      "Thompson",
      "Torres",
      "Tucker",
      "Turner",
      "Vasquez",
      "Wagner",
      "Walker",
      "Wallace",
      "Ward",
      "Warren",
      "Washington",
      "Watson",
      "Weaver",
      "Webb",
      "Welch",
      "Wells",
      "West",
      "Wheeler",
      "White",
      "Williams",
      "Williamson",
      "Willis",
      "Wilson",
      "Wood",
      "Woods",
      "Wright",
      "Young",
    ],
  },
  ww: {
    männlich: [
      "Alexander",
      "Amos",
      "Arthur",
      "Augustus",
      "Benjamin",
      "Charles",
      "David",
      "Edward",
      "George",
      "James",
      "Jethro",
      "John",
      "Nathaniel",
      "Peter",
      "Philip",
      "Richard",
      "Robert",
      "Roger",
      "Thaddeus",
      "William",
      "Zachariah",
    ],
    weiblich: [
      "Abigail",
      "Alice",
      "Anna",
      "Catherine",
      "Cecilly",
      "Chastity",
      "Elizabeth",
      "France",
      "Joy",
      "Judith",
      "Margaret",
      "Mary",
      "Melinda",
      "Mercy",
      "Molly",
      "Patience",
      "Rebecca",
      "Ruth",
      "Sarah",
      "Silence",
      "Temperance",
    ],
    beinamen: [
      "Bailey",
      "Becker",
      "Bowman",
      "Cooper",
      "Cross",
      "Gilmore",
      "Glassick",
      "Graybill",
      "Hartman",
      "Hellman",
      "Jones",
      "Lawson",
      "Ludwig",
      "Miller",
      "Newcomer",
      "Peters",
      "Pritchett",
      "Sherman",
      "Smith",
      "Taylor",
      "Whately",
    ],
  },
};
