// https://www.nfl.com/teams/

let results = [];

const sections = document.querySelectorAll(
  "section .d3-l-grid--outer.d3-l-section-row .d3-l-grid--inner",
);

for (let i = 0; i < sections.length; i++) {
  const teams = sections[i].querySelectorAll(
    "div.d3-l-col__col-12:not(#scroll-nfcteams):not(#scroll-afcteams)",
  );
  for (let j = 0; j < teams.length; j++) {
    const teamElement = teams[j].querySelector("img");
    if (teamElement) {
      results.push({
        id: 16 * i + (j + 1),
        teamName: teamElement.alt,
        imgSrc: teamElement.getAttribute("data-src"),
      });
    }
  }
}

// [
//   {
//     "id": 1,
//     "teamName": "Arizona Cardinals",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/u9fltoslqdsyao8cpm0k"
//   },
//   {
//     "id": 2,
//     "teamName": "Atlanta Falcons",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/d8m7hzpsbrl6pnqht8op"
//   },
//   {
//     "id": 3,
//     "teamName": "Carolina Panthers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ervfzgrqdpnc7lh5gqwq"
//   },
//   {
//     "id": 4,
//     "teamName": "Chicago Bears",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ijrplti0kmzsyoaikhv1"
//   },
//   {
//     "id": 5,
//     "teamName": "Dallas Cowboys",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ieid8hoygzdlmzo0tnf6"
//   },
//   {
//     "id": 6,
//     "teamName": "Detroit Lions",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ocvxwnapdvwevupe4tpr"
//   },
//   {
//     "id": 7,
//     "teamName": "Green Bay Packers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/gppfvr7n8gljgjaqux2x"
//   },
//   {
//     "id": 8,
//     "teamName": "Los Angeles Rams",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ayvwcmluj2ohkdlbiegi"
//   },
//   {
//     "id": 9,
//     "teamName": "Minnesota Vikings",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/teguylrnqqmfcwxvcmmz"
//   },
//   {
//     "id": 10,
//     "teamName": "New Orleans Saints",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/grhjkahghjkk17v43hdx"
//   },
//   {
//     "id": 11,
//     "teamName": "New York Giants",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/t6mhdmgizi6qhndh8b9p"
//   },
//   {
//     "id": 12,
//     "teamName": "Philadelphia Eagles",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/puhrqgj71gobgdkdo6uq"
//   },
//   {
//     "id": 13,
//     "teamName": "San Francisco 49ers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/dxibuyxbk0b9ua5ih9hn"
//   },
//   {
//     "id": 14,
//     "teamName": "Seattle Seahawks",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/gcytzwpjdzbpwnwxincg"
//   },
//   {
//     "id": 15,
//     "teamName": "Tampa Bay Buccaneers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/v8uqiualryypwqgvwcih"
//   },
//   {
//     "id": 16,
//     "teamName": "Washington Commanders",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/xymxwrxtyj9fhaemhdyd"
//   },
//   {
//     "id": 17,
//     "teamName": "Baltimore Ravens",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ucsdijmddsqcj1i9tddd"
//   },
//   {
//     "id": 18,
//     "teamName": "Buffalo Bills",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/giphcy6ie9mxbnldntsf"
//   },
//   {
//     "id": 19,
//     "teamName": "Cincinnati Bengals",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/okxpteoliyayufypqalq"
//   },
//   {
//     "id": 20,
//     "teamName": "Cleveland Browns",
//     "imgSrc": "https://static.www.nfl.com/image/upload/f_auto/league/bedyixmmjhszfcx5wv2l"
//   },
//   {
//     "id": 21,
//     "teamName": "Denver Broncos",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/t0p7m5cjdjy18rnzzqbx"
//   },
//   {
//     "id": 22,
//     "teamName": "Houston Texans",
//     "imgSrc": "https://static.www.nfl.com/image/upload/f_auto/league/u6camnphqvjc6mku6u3c"
//   },
//   {
//     "id": 23,
//     "teamName": "Indianapolis Colts",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ketwqeuschqzjsllbid5"
//   },
//   {
//     "id": 24,
//     "teamName": "Jacksonville Jaguars",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/qycbib6ivrm9dqaexryk"
//   },
//   {
//     "id": 25,
//     "teamName": "Kansas City Chiefs",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/ujshjqvmnxce8m4obmvs"
//   },
//   {
//     "id": 26,
//     "teamName": "Las Vegas Raiders",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/gzcojbzcyjgubgyb6xf2"
//   },
//   {
//     "id": 27,
//     "teamName": "Los Angeles Chargers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/dhfidtn8jrumakbogeu4"
//   },
//   {
//     "id": 28,
//     "teamName": "Miami Dolphins",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/lits6p8ycthy9to70bnt"
//   },
//   {
//     "id": 29,
//     "teamName": "New England Patriots",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/moyfxx3dq5pio4aiftnc"
//   },
//   {
//     "id": 30,
//     "teamName": "New York Jets",
//     "imgSrc": "https://static.www.nfl.com/image/upload/f_auto/league/vdqo4iiufmdrimkaxslj"
//   },
//   {
//     "id": 31,
//     "teamName": "Pittsburgh Steelers",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/xujg9t3t4u5nmjgr54wx"
//   },
//   {
//     "id": 32,
//     "teamName": "Tennessee Titans",
//     "imgSrc": "https://static.www.nfl.com/image/private/f_auto/league/pln44vuzugjgipyidsre"
//   }
// ]
