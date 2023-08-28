import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class createReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  comment: string;
}
