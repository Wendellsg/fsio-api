import { FrequencyType, PeriodType } from '../entities/routine.entity';

export class CreateRoutineDto {
  description: string;
  frequency: number;
  frequencyType: FrequencyType;
  repetitions: number;
  series: number;
  period: PeriodType;
  exerciseId: string;
  professionalId: string;
}
