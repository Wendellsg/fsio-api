import { Category } from '../entities/exercise.entity';

export class CreateExerciseDto {
  name: string;
  description: string;
  category: Category;
  image: string;
  video: string;
  summary: string;
}
