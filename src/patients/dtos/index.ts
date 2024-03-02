export type UpdatePatientDto = {
  weight?: number;
  height?: number;
};

export type GetPatientResponseDTO = Array<{
  id: string;
  name: string;
  image: string;
  email: string;
}>;
