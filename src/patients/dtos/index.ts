export type UpdatePatientDto = {
  weight?: number;
  height?: number;
  phone?: string;
  name?: string;
  birthDate?: Date;
};

export type GetPatientResponseDTO = Array<{
  id: string;
  name: string;
  image: string;
  email: string;
}>;
