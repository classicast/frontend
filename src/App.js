import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';


function getLabel(id, data) {
  if (data.hasOwnProperty('entities') &&
  data.entities.hasOwnProperty('labels') &&
  data.entities.labels.hasOwnProperty(id)) {
    return data.entities.labels[id];
  }
  // TODO: log error
  return {};
}

function getTrackTitle(trackNum, discNum, albumData) {
  const performances = albumData.entities.discs[discNum].tracks[trackNum].performances;

  const compositionTitles = performances.map((performanceId, index) => {
    const performance = albumData.entities.performances[performanceId];
    const compositionId = performance.composition;
    const composition = albumData.entities.compositions[compositionId];

    // If multi-movement composition
    if (composition.hasOwnProperty('movements')) {
      const movementIds = performance.movements;
      const movementTitles = movementIds.map((id) => {
        return composition.movements[id].title;
      });
      // Join multiple movement tiles into one (incase multiple movements on one track)
      // eg. Symphony in e minor: I. Allegro, II. Andante
      return `${composition.title}: ${movementTitles.join(',')}`
    }
    return composition.title;
  });
  return compositionTitles.join(',');
}

const Cover = ({imgUrl, imgAlt}) => {
  return <img src={imgUrl} alt={imgAlt} width={300} height={300}/>
};


const AlbumHeader = ({data}) => {
  const attributes = data.attributes;
  return (
    <div>
      <h3>{attributes.title}</h3>
      <p>{getLabel(attributes.labelId, data).displayName} {attributes.catalogNum} - {attributes.releaseYear} ({attributes.media})</p>
    </div>
  );
};

const Tracklist = ({discInfo, data}) => {
  const tracks = Object.keys(discInfo.tracks).sort().map((trackNum, index) => {
    return <li key={index}>{getTrackTitle(trackNum, discInfo.discNum, data)}</li>
  });

  return (
    <div>
      <h4>Tracks:</h4>
      <ol>
        {tracks}
      </ol>
    </div>
  );
};

const Discs = ({data}) => {
  if (data.discs === 1) {
    return <Tracklist discInfo={data.entities.discs[1]} data={data} />
  }
  const discs = [...Array(data.discs).keys()].map((disc, index) => {
    const discNum = disc + 1;
    return (
      <div key={index}>
        <p key={index}>Disc {discNum} of {data.attributes.numberOfDiscs}</p>
        <Tracklist discInfo={data.entities.discs[discNum]} data={data} />
      </div>
    )
  });

  return (
    <div>
      {discs}
    </div>
  );
};

const Album = ({data}) => {
  return (
    <div>
      <Cover
        imgUrl={data.attributes.coverImgUrl}
        imgAlt={data.attributes.title}
      />
      <AlbumHeader data={data} />
      <Discs data={data} />
    </div>
  );
};

// TODO: move to separate JSON file that is a mock API response
const AlbumInfo = {
  attributes: {
    id: 727,
    media: 'CD',
    releaseYear: 1990,
    labelId: 549,
    catalogNum: 'ARL 32',
    numberOfDiscs: 1,
    title: 'The Art of Nikolai Golovanov Volume I',
    description: 'TODO TODO TODO',
    coverImgUrl: 'https://s3-us-west-2.amazonaws.com/classicast/media-assets/albums/a/arlecchino/ARL+32+-+The+Art+of+Nikolai+Golovanov+Volume+I/Scans/Cover.jpg',
  },
  entities: {
    labels: {
      549: {
        displayName: 'Arlecchino',
      }
    },
    performances: {
      683: {
        composition: 357,
        performanceDate: '1947',
        persons: [
          { type: 'conductor', id: 928},
          { type: 'ensemble', id: 929},
          { type: 'soloist', instrument: 'piano', id: 930},
        ],
      },
      684: {
        composition: 358,
        performanceDate: '1952',
        persons: [
          { type: 'conductor', id: 928},
          { type: 'ensemble', id: 929},
          { type: 'soloist', instrument: 'trumpet', id: 931},
        ],
      },
      685: {
        composition: 359,
        movements: [0],
        performanceDate: '1946',
        persons: [
          { type: 'conductor', id: 928},
          { type: 'ensemble', id: 932},
          { type: 'soloist', instrument: 'piano', id: 933},
        ],
      },
      686: {
        composition: 359,
        movements: [1],
        performanceDate: '1946',
        persons: [
          { type: 'conductor', id: 928},
          { type: 'ensemble', id: 932},
          { type: 'soloist', instrument: 'piano', id: 933},
        ],
      },
      687: {
        composition: 359,
        movements: [2],
        performanceDate: '1946',
        persons: [
          { type: 'conductor', id: 928},
          { type: 'ensemble', id: 932},
          { type: 'soloist', instrument: 'piano', id: 933},
        ],
      },
    },
    compositions: {
      357: {
        persons: [{ type: 'composer', id: 927}],
        compositionDate: '1910',
        catalogs: [
          {
            catalogType: 'Opus',
            catalogNum: '60',
          },
        ],
        title: 'Promethus, the Poem of Fire',
      },
      358: {
        persons: [{ type: 'composer', id: 927}],
        compositionDate: '1905-1908',
        catalogs: [
          {
            catalogType: 'Opus',
            catalogNum: '54',
          }
        ],
        title: 'The Poem of Ecstasy',
      },
      359: {
        persons: [{ type: 'composer', id: 927}],
        compositionDate: '1896',
        catalogs: [
          {
            catalogType: 'Opus',
            catalogNum: '20',
          }
        ],
        title: 'Piano Concerto in F sharp minor',
        movements: [
          { title: 'I. Allegro' },
          { title: 'II. Andante' },
          { title: 'III. Allegro moderato' },
        ],
      }
    },
    persons: {
      927: { displayName: 'Alexander Scriabin' },
      928: { displayName: 'Nikolai Golovanov' },
      929: { displayName: 'Moscow Radio Symphony Orchestra' },
      930: { displayName: 'Alexander Goldenweiser' },
      931: { displayName: 'Serguei Popov' },
      932: { displayName: 'All-Russia Radio Orchestra' },
      933: { displayName: 'Heinrich Neuhaus' },
    },
    discs: {
      1: {
        totalTracks: 5,
        discNum: 1,
        tracks: {
          1: {
            audioUrl: 'some/url',
            performances: [683],
            duration: 1402,
          },
          2: {
            audioUrl: 'some/url',
            performances: [684],
            duration: 1341,
          },
          3: {
            audioUrl: 'some/url',
            performances: [685],
            duration: 403,
          },
          4: {
            audioUrl: 'some/url',
            performances: [686],
            duration: 472,
          },
          5: {
            audioUrl: 'some/url',
            performances: [687],
            duration: 594,
          },
        }
      }
    }
  },
};


class App extends Component {
  render() {
    return (
      <div className="App">
        <Album data={AlbumInfo} />
      </div>
    );
  }
}

export default App;
