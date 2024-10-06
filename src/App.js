import './App.css';

import React, { useEffect, useState } from 'react';
import '@arcgis/core/assets/esri/themes/light/main.css'; 
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import SizeVariable from '@arcgis/core/renderers/visualVariables/SizeVariable';
import CoordinatesDisplay from './components/CoordinatesDisplay.js';
import WeatherDisplay from './components/WeatherDisplay.js';


const App = () => {
  // Definition zweier Zustandsvariablen: Eine für die Koordinaten und eine für die transformierten WGS84-Koordinaten
  const [coordinates, setCoordinates] = useState(null);
  const [wgsCoordinates, setWgsCoordinates] = useState(null);

  useEffect(() => {
    // Erstellem eine neue Webkarte
    const initializeMap = () => {
      const map = new WebMap({
        basemap: 'gray-vector',
      });

      // Renderer für die Darstellung der Symbole auf der Karte
      const renderer = new SimpleRenderer({
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          color: [255, 51, 51, 0.8],
          outline: {
            color: [50, 50, 50],
            width: 0.4,
          },
          size: '8px',
        },

        // Visuelle Variable für die Symbolgröße basierend auf Populationsdaten
        visualVariables: [
          new SizeVariable({
            field: 'POP',
            minDataValue: 100000,
            maxDataValue: 14000000,
            minSize: 6,
            maxSize: 90,
          }),
        ],
      });

      // FeatureLayer für die Städte
      const worldCitiesLayer = new FeatureLayer({
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/',
        renderer: renderer,
      });

      // Layer zur Karte hinzufügen
      map.add(worldCitiesLayer);

      // Erstellen einer Kartenansicht
      const view = new MapView({
        container: 'viewDiv',
        map: map,
        zoom: 5,
        center: [7.241, 52.452], // longitude, latitude
      });

      // Klick-Event hinzufügen, um die Koordinaten bei einem Klick auf die Karte zu speichern
      view.on("click", (event) => {
        setCoordinates(event.mapPoint);
      });

      // Hinzufügen einer Legende
      view.ui.add(
        new Expand({
          content: new Legend({
            view: view,
          }),
          view: view,
          expanded: false,
        }),
        'bottom-left'
      );
    };

    // Initialisierung der Karte 
    initializeMap();

    // Bereinige die Kartenansicht beim Demontieren der Komponente
    return () => {
      const viewDiv = document.getElementById('viewDiv');
      if (viewDiv) {
        viewDiv.innerHTML = ''; 
      }
    };
  }, []);

  // Transformation der Koordinaten (nur wenn die neuen Koordinaten anders sind)
  const transformCoordinates = (convertedCoordinates) => {
    if (!wgsCoordinates || (convertedCoordinates.x !== wgsCoordinates.x || convertedCoordinates.y !== wgsCoordinates.y)) {
      setWgsCoordinates(convertedCoordinates);
    }
  };

  return (
    <div className="full-height">
      <div id="viewDiv"></div>
      <CoordinatesDisplay coordinates={coordinates} wgs84CoordinatesChange={transformCoordinates} />
      <WeatherDisplay coordinates={wgsCoordinates} />
    </div>
  );
};

export default App;
