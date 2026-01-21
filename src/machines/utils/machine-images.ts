import harvesterImg from '../../../shared/ui/img/harvester.png';
import seederImg from '../../../shared/ui/img/seeder.png';
import washerImg from '../../../shared/ui/img/washer.png';

export function getMachineImage(machineName: string): string | null {
  const upperName = machineName.toUpperCase();
  
  if (upperName.startsWith('HARVESTER')) return harvesterImg;
  if (upperName.startsWith('TABLETOP_HARVESTER')) return harvesterImg;
  if (upperName.startsWith('SEEDER')) return seederImg;
  if (upperName.startsWith('WASHER')) return washerImg;
  
  return null;
}
