export interface RotaInfo {
  title: string;
  createdDate: string;
}

export class RotaService {
  generateRotaTitle(): string {
    const today = new Date().toISOString().split('T')[0];
    return `CMU A Rota - ${today}`;
  }

  createRotaInfo(): RotaInfo {
    return {
      title: this.generateRotaTitle(),
      createdDate: new Date().toISOString().split('T')[0]
    };
  }
}