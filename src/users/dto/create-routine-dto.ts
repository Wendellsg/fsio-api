export class CreateRoutineDto {
  exerciseId: string;
  description: string;
  frequency: number;
  frequencyType: string;
  repetitions: number;
  series: number;
  period: string;
  professionalId?: string;
}
