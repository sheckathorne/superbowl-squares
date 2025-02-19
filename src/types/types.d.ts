export interface Player {
  id: number;
  name: string;
  color: string;
  squareCount: number;
  squares: [number, number][];
}

export interface Team {
  id: number;
  name: string;
  logoUrl: string;
}

export interface SelectedTeam extends Team {
  side: string;
}
