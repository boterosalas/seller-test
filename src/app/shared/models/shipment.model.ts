import {DetailEntity} from './order.model';

/**
 * Interfaz que contiene el tiempo restante de la promesa de entrega
 */
export class Remain {
  days: number;
  hours: number;
  minutes: number;
}

/**
 * Interfaz que contiene el estado del envío con su id y nombre
 */
export class State {
  id: number;
  name: string;
  step: number;
}

/**
 * Interfaz que contiene el dpto
 */
export class Department {
  id: string;
  code: number;
  name: string;
}

/**
 * Interfaz que contiene la ciudad
 */
export class City {
  id: number;
  code: number;
  name: string;
  department: Department;
}

/**
 * Interfaz que contiene la dirección del envío
 */
export class Address {
  identification: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  comments: string;
  zip_code: string;
  city: City;
}

/**
 * Interfaz que contiene los datos de un paquete
 */
export class Package {
  id: number;
  created_at: string;
  count: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  description: string;
  declared_price: number;
}

export class Carrier {
  id: number;
  name: string;
  picture: string;
  conversion: number;
}

export class CarrierService {
  id: number;
  title: string;
  description: string;
  type: number;
  min_weight: number;
  max_weight: number;
  carrier: Carrier;
}

export class ShipmentEvent {
  id: number;
  name: string;
  event_date: string;
}


export class Shipment {
  id: number;
  order?: string;
  created_at: string;
  time_limit?: string;
  url: string;
  label: string;
  remain: Remain;
  packages: (Package)[];
  service: CarrierService;
  state_id: number;
  state: State;
  events?: (ShipmentEvent)[] | Array<ShipmentEvent>;
  pickup?: string;
  tracking?: string;
  address_from: Address;
  address_to: Address;
}

export class ListShipments {
  dataset?: (Shipment)[] |  Array<Shipment>;
  total: number;
  count: number;
}

export class PickupShipment {
  id: number;
  tracking: any;
  stored: boolean;
  pickup: string;
  pickup_terminal: any;
}
