import React, { useEffect, useState } from 'react';
import './WeatherDisplay.css';

// Komponente zur Anzeige des Wetters basierend auf Koordinaten
const WeatherDisplay = ({ coordinates }) => {
    // Zustand für den Standortnamen und die Wetterdaten
    const [locationName, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Überprüfen, ob gültige Koordinaten vorhanden sind
        if (coordinates && coordinates.x && coordinates.y) {
            const googleApiKey = 'ADD-API-KEY';
            const locationUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.y},${coordinates.x}&key=${googleApiKey}`;

            // Fetch-Request zur Geokodierungs-API
            fetch(locationUrl)
                .then(response => {
                    // Überprüfen, ob die Antwort erfolgreich war
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Antwort als JSON zurückgeben
                    return response.json();
                })

                .then(data => {
                    // Überprüfen, ob Geokodierungsdaten vorhanden sind
                    if (data.results && data.results.length > 0) {
                        const addressComponents = data.results[0].address_components;

                        // Suchen nach der Stadtkomponente
                        const cityComponent = addressComponents.find(component => 
                            component.types.includes("locality") || component.types.includes("administrative_area_level_1")
                        );

                        // Stadtname oder Fehlermeldung setzen
                        const cityName = cityComponent ? cityComponent.long_name : 'No location found';

                        // Stadtname im Zustand speichern
                        setLocation(cityName);

                        const weatherApiKey = 'ADD-API-KEY';
                        const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherApiKey}`;
                        
                        // Fetch-Request zur Wetter-API
                        return fetch(weatherURL);
                    } else {
                         // Fehlermeldung, wenn keine Daten gefunden werden
                        setLocation('No location found');
                    }
                })

                .then(response => {
                    // Überprüfen, ob die Antwort der Wetter-API erfolgreich war
                    if (response && !response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Antwort als JSON zurückgeben
                    return response.json();
                })

                .then(data => {
                    // Überprüfen, ob Wetterdaten vorhanden sind
                    if (data && data.list && data.list.length > 0) {
                        // Wetterdaten verarbeiten und in ein neues Format umwandeln
                        const weather = data.list.map(slot => ({
                            dateTime: slot.dt_txt,
                            temperature: (slot.main.temp - 273.15).toFixed(2),
                            weather: slot.weather[0].description,
                            windSpeed: slot.wind.speed,
                        })); 

                        // Nur die ersten zwei Wettervorhersagen speichern
                        setWeather(weather.slice(0,2));
                    } else {
                        setWeather('No weather found');
                    }
                })
                .catch(error => console.error('Fetch error:', error));
        }
    }, [coordinates]);

    return (
        <div className="weather-display">
        {/* Überprüfen, ob ein Ortsname vorhanden ist */}
        {locationName && (
            <div>
                <h4>Ort:</h4>
                <p>{locationName}</p>
            </div>
        )}
        {/* Überprüfen, ob Wetterdaten vorhanden sind */}
        {weather && (
            <div>
                <h4>Wetter: </h4>
                {Array.isArray(weather) && weather.length > 0 ? (
                weather.map((slot, index) => (
                    <div key={index}>
                        <p className="weather-border">
                            {slot.dateTime} <br/>
                            Temperatur: {slot.temperature} °C <br/>
                            Wetter: {slot.weather} <br/>
                            Windgeschwindigkeit: {slot.windSpeed} m/s
                        </p>
                    </div>
                ))
            ) : (
                <p>Keine Wetterdaten vorhanden.</p>
            )}
            </div>
        )}
    </div>
    );
};

export default WeatherDisplay;

