import { render } from '@testing-library/react';
import WeatherDisplay from '../WeatherDisplay';

describe('WeatherDisplay', () => {
  const mockCoordinates = { x: 13.405, y: 52.52 };

  it('renders without crashing with valid coordinates', () => {
    render(<WeatherDisplay coordinates={mockCoordinates} />);
  });
});