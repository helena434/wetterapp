import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import './CoordinatesDisplay.css';

// Komponente zur Anzeige und Umwandlung von Koordinaten
const CoordinatesDisplay = ({ coordinates, wgs84CoordinatesChange }) => {
    // Zustände für die umgewandelten Koordinaten und den Ladezustand
    const [wgs84Coordinates, setWgsCoordinates] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const convertCoordinates = async () => {

            // Abbrechen, wenn keine Koordinaten vorhanden sind
            if (!coordinates) return; 

            // Ladezustand aktivieren
            setLoading(true);

            // Module für die Koordinatenprojektion laden
            loadModules(['esri/geometry/projection', 'esri/geometry/SpatialReference'])
            .then(([projection, SpatialReference]) => {
                return projection.load().then(() => {

                    // Koordinaten umwandeln
                    const wgs84Point = projection.project(coordinates, SpatialReference.WGS84);

                    // Umgewandelte Koordinaten speichern
                    const convertedCoordinates = {
                        x: wgs84Point.longitude,
                        y: wgs84Point.latitude,
                    };

                    // Umgewandelte Koordinaten im Zustand speichern
                    setWgsCoordinates(convertedCoordinates);

                    // Wenn wgs84CoordinatesChange eine Funktion ist, aufrufen
                    wgs84CoordinatesChange?.(convertedCoordinates);
                });
            })
            .catch(() => {
                // Im Fehlerfall den Zustand der umgewandelten Koordinaten auf null setzen
                setWgsCoordinates(null);
            })
            .finally(() => {
                // Zustand zurücksetzen
                setLoading(false);
            });
        };

        // Funktion zur Umwandlung der Koordinaten aufrufen
        convertCoordinates();
    }, [coordinates, wgs84CoordinatesChange]);

    return (
        <div className="coordinates-display">
            <h4>Getroffene Koordinate</h4>
            {loading ? ( // Überprüfen, ob die Koordinaten geladen werden
                <p>Loading coordinates...</p>
            ) : wgs84Coordinates ? ( // Überprüfen, ob umgewandelte Koordinaten vorhanden sind
                <p>
                    Latitude: {wgs84Coordinates.y.toFixed(3)} <br />
                    Longitude: {wgs84Coordinates.x.toFixed(3)}
                </p>
            ) : (
                <p>Keine Koordinaten ausgewählt.</p>
            )}
        </div>
    );
};

export default CoordinatesDisplay;


