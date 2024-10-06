import { render, screen } from '@testing-library/react';
import CoordinatesDisplay from '../CoordinatesDisplay';

describe('CoordinatesDisplay', () => {
    const mockWgs84CoordinatesChange = jest.fn(); 

it('renders without crashing with no coordinates', () => {
    render(<CoordinatesDisplay coordinates={null} wgs84CoordinatesChange={mockWgs84CoordinatesChange} />);
    expect(screen.getByText(/Keine Koordinaten ausgewählt/i)).toBeInTheDocument();
  });
});




