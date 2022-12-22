import { IPhoneNumber } from 'shared/types';

type Device = {
  os: 'Android' | 'iOS';
  version: string;
};

type Driver = {
  id: number;
  name: string;
  phone: IPhoneNumber;
  device?: Device;
};

type Location = {
  latitude: string;
  longitude: string;
};

export type DriverPosition = {
  location: Location;
  timestamp: string;
};

type PositionWithDelay = {
  delayInMinutes: number;
  markWarning: boolean;
};

export type DriverPositionWithDelay = Pick<DriverPosition, 'location'> & {
  delayFromPrevious: PositionWithDelay;
  timestamp: {
    date: string;
    time: string;
  };
};

export interface IDriverPositions {
  driver: Driver;
  positions: DriverPosition[];
}
