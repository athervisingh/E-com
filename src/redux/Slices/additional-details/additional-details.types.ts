export enum BandValue {
	B_1 = 'B1',
	B_2 = 'B2',
	B_3 = 'B3',
	B_4 = 'B4',
	B_5 = 'B5',
	B_6 = 'B6',
	B_7 = 'B7',
	B_8 = 'B8',
}

export enum Model {
	MAHALANOBIS_DISTANCE_CLASSIFIER = 'Mahalanobis Distance Classifier',
	MAXIMUM_LIKELIHOOD_CLASSIFIER = 'Maximum Likelhood Classifier',
	RANDOM_FOREST_CLASSIFIER = 'Random Forest Classifier',
	PARALLELEPIPED_CLASSIFIER = 'Parallelepiped Classifier',
}

export type BandValues = {
	band1: BandValue;
	band2: BandValue;
	band3: BandValue;
};