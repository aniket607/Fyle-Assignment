export const WORKOUT_TYPES = ['Running', 'Cycling', 'Swimming', 'Yoga'] as const;

export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export interface DropdownOption {
    label: string;
    value: string;
}
